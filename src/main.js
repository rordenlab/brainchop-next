import { NiiVue, DRAG_MODE, SHOW_RENDER } from '@niivue/niivue'
import { shiny } from '@niivue/niivue/assets/matcaps'
import { Niimath } from '@niivue/niimath'
import { runDcm2niix, traverseDataTransferItems } from '@niivue/nv-ext-dcm2niix'
import { segment, segmentTissues, checkSupport, checkWebgl2Support, MODELS } from '@brainchop/mindgrab'
import { labelStats, paintLabels, rasIndex, statsCsv } from './labels.js'

const $ = (id) => document.getElementById(id)
const NIFTI = /\.nii(\.gz)?$/i
// [GM, WM, CSF] tints: a light floor..tint ramp avoids a dark edge over bright T1 white matter.
const TISSUES = [['gm', [255, 64, 64]], ['wm', [255, 255, 255]], ['csf', [64, 128, 255]]]

const nv = new NiiVue({
  backend: 'webgl2',
  matcaps: { Shiny: shiny },
  backgroundColor: [0, 0, 0, 1],
  is3DCrosshairVisible: true,
  clipPlaneColor: [0.7, 0, 0.7, 0.5],
  isLegendVisible: false,
  isDragDropEnabled: false, // the page handles drops, so DICOM goes through dcm2niix
  primaryDragMode: DRAG_MODE.crosshair,
  secondaryDragMode: DRAG_MODE.slicer3D, // right button; the toolbar changes it
  showRender: SHOW_RENDER.ALWAYS,
  isYoked3DTo2DZoom: true,
  isViewModeHotKeyEnabled: true, // V cycles the views
  crosshairGap: 11,
})
// The current segmentation: { kind: 'labels', model, labels } (pristine voxels of overlay 1),
// { kind: 'mask', mask } (mindgrab) or { kind: 'tissues', brain } (GM+WM fraction).
let seg = null
let isolated = null // label shown alone, or null for all
let lastVox = null // RAS voxel under the crosshair
let lastRun = null // for Diagnostics
let series = [] // { file, label, detail } per dropped image, in series order
let busy = false
let savedBgOpacity = null // BG slider value to restore after the tissue-fraction view dims it

function setBusy(on) {
  busy = on
  for (const id of ['modelSelect', 'seriesSelect', 'meshBtn', 'saveBtn', 'viewBtn', 'drawBtn', 'statsBtn']) $(id).disabled = on
  if (on) $('modelProgress').removeAttribute('value') // indeterminate: mindgrab reports no fraction
  else $('modelProgress').value = 0
}

// Buttons are [label, action] pairs; each closes the dialog, then runs its action.
function showModal(title, html, buttons = [['Close']]) {
  $('dialogTitle').textContent = title
  $('dialogMessage').innerHTML = html
  $('dialogButtons').replaceChildren(...buttons.map(([label, action]) => {
    const button = Object.assign(document.createElement('button'), { type: 'button', textContent: label })
    button.onclick = () => {
      $('appDialog').close()
      action?.()
    }
    return button
  }))
  $('appDialog').showModal()
}

function showError(title, error) {
  $('location').textContent = title
  showModal(title, '')
  $('dialogMessage').append(Object.assign(document.createElement('p'), { textContent: error.message ?? error }))
}

function download(data, filename) {
  const url = URL.createObjectURL(data instanceof Blob ? data : new Blob([data]))
  Object.assign(document.createElement('a'), { href: url, download: filename }).click()
  setTimeout(() => URL.revokeObjectURL(url))
}

// One niimath per task: dispose() frees its wasm heap.
async function withNiimath(task) {
  const niimath = new Niimath()
  try {
    await niimath.init()
    return await task(niimath)
  } finally {
    niimath.dispose()
  }
}

async function removeOverlays() {
  while (nv.volumes.length > 1) await nv.removeVolume(nv.volumes.length - 1)
}

function setBgOpacity(value) {
  $('opacitySlider0').value = value
  $('opacitySlider0').oninput()
}

function restoreBgOpacity() {
  if (savedBgOpacity !== null) setBgOpacity(savedBgOpacity)
  savedBgOpacity = null
}

// Every control that could load another image is disabled while this runs.
async function runModel() {
  const choice = $('modelSelect').value
  const name = $('modelSelect').selectedOptions[0].text
  setBusy(true)
  $('location').textContent = `Running ${name}…`
  try {
    seg = null
    setIsolated(null)
    await removeOverlays()
    await nv.removeAllMeshes() // a mesh belongs to the segmentation it was made from
    const input = await nv.saveVolume({ volumeByIndex: 0, filename: '' })
    const opacity = Number($('opacitySlider1').value)
    const log = []
    const options = { worker: true, onLog: (line) => log.push(line) }
    let result
    if (choice === 'pve') {
      result = await segmentTissues(input, { ...options, model: 'mindmap' })
      for (const [tissue] of TISSUES) {
        // colormapType 1 (transparent below calMin): otherwise the 3D shader renders every tiny fraction opaque.
        await nv.addVolume({ url: new File([result.tissues[tissue]], `${tissue}.nii`), colormap: tissueColormaps[tissue], colormapType: 1, calMin: 0.03, calMax: 1, opacity })
      }
      seg = { kind: 'tissues', brain: result.tissues.brain }
      savedBgOpacity ??= $('opacitySlider0').value
      setBgOpacity(0.1) // fractions are hard to read over a bright T1
    } else {
      result = await segment(input, { ...options, model: choice, mask: choice === 'mindgrab' })
      await nv.addVolume({ url: new File([result.image], choice === 'mindgrab' ? 'brain.nii' : `${choice}.nii`), colormap: choice === 'mindgrab' ? 'copper2' : 'gray', opacity })
      if (choice === 'mindgrab') seg = { kind: 'mask', mask: result.mask }
      else {
        await nv.setColormapLabel(1, MODELS[choice].colormap)
        seg = { kind: 'labels', model: choice, labels: nv.volumes[1].img }
      }
      restoreBgOpacity()
    }
    const { backend, elapsedMs, ranInWorker } = result
    lastRun = { model: name, backend, elapsedMs, ranInWorker, log }
    updateBackendStatus(backend)
    $('location').textContent = `${name}: ${(elapsedMs / 1000).toFixed(1)} s on ${backend}`
  } catch (error) {
    $('modelSelect').value = '' // so the same model can be retried
    await removeOverlays()
    restoreBgOpacity()
    showError('Segmentation failed', error)
  } finally {
    setBusy(false)
  }
}

function openMeshDialog() {
  if (!seg) return showModal('Mesh', '<p>Run a segmentation model first; the mesh encloses its labels.</p>')
  showModal('Generate STL mesh', `
    <label class="mesh-field">Reduce to <output id="reduceValue">20%</output>
      <input id="reduce" type="range" min="5" max="100" step="5" value="20" />
      <small>Fraction of triangles kept. Lower values make a smaller file.</small></label>
    <label class="mesh-field">Smoothing iterations <output id="smoothValue">0</output>
      <input id="smooth" type="range" min="0" max="20" step="1" value="0" />
      <small>Humphrey's Classes smoothing after meshing.</small></label>`, [
    ['Cancel', () => nv.removeAllMeshes()],
    ['Create', () => void createMesh({ i: 0.5, b: 1, r: Number($('reduce').value) / 100, s: Number($('smooth').value) })],
  ])
  $('reduce').oninput = () => { $('reduceValue').textContent = `${$('reduce').value}%` }
  $('smooth').oninput = () => { $('smoothValue').textContent = $('smooth').value }
}

// Runs a save with the pristine labels in place, even while one label is isolated on screen.
async function withPristineLabels(save) {
  if (seg?.kind !== 'labels') return save()
  const overlay = nv.volumes[1]
  const shown = overlay.img
  overlay.img = seg.labels
  try {
    return await save()
  } finally {
    overlay.img = shown
  }
}

const overlayBytes = (i) => withPristineLabels(() => nv.saveVolume({ volumeByIndex: i, filename: '' }))

// What the mesh and the binary mask enclose: every label, the brain mask, or GM+WM >= 0.5.
const segBytes = async () => (seg.kind === 'labels' ? overlayBytes(1) : seg.kind === 'mask' ? seg.mask : seg.brain)

// Replaces any mesh in the scene; Save writes it as STL.
async function createMesh(options) {
  setBusy(true)
  $('location').textContent = 'Creating mesh with niimath…'
  try {
    const source = await segBytes()
    const mesh = await withNiimath((niimath) => niimath.image(source).mesh(options).run('brainchop.mz3'))
    await nv.removeAllMeshes()
    await nv.addMesh({ url: new File([mesh], 'brainchop.mz3') })
    $('location').textContent = `Mesh: ${(nv.meshes[0].indices.length / 3).toLocaleString()} triangles`
  } catch (error) {
    showError('Mesh failed', error)
  } finally {
    setBusy(false)
  }
}

// Every overlay (plus, optionally, a 0/1 mask) as [name, uncompressed NIfTI bytes], in the input's own space.
async function segmentationFiles(withMask) {
  const files = []
  for (let i = 1; i < nv.volumes.length; i++) {
    files.push([nv.volumes[i].name.replace(NIFTI, ''), await overlayBytes(i)])
  }
  if (withMask) {
    const source = await segBytes()
    const threshold = seg.kind === 'tissues' ? 0.5 : 0 // fractions are 0..1; labels and masks are 0 or more
    files.push(['binary_mask', await withNiimath((niimath) => niimath.image(source).thr(threshold).bin().run('mask.nii'))])
  }
  return files
}

// 256^3 1 mm conform of the input (niimath), the grid the models run on.
const conformedInput = (niimath) => nv.saveVolume({ volumeByIndex: 0, filename: '' }).then((input) => niimath.image(input).conform().run('conformed.nii.gz'))

async function save(kind, withMask) {
  setBusy(true)
  $('location').textContent = 'Saving…'
  try {
    if (kind === 'native') for (const [name, bytes] of await segmentationFiles(withMask)) download(bytes, `${name}_native.nii`)
    if (kind === 'conformed') {
      const files = await segmentationFiles(withMask)
      await withNiimath(async (niimath) => {
        const reference = await conformedInput(niimath)
        for (const [name, bytes] of files) download(await niimath.image(bytes).resliceNN(reference).run(`${name}.nii.gz`), `${name}.nii.gz`)
      })
    }
    if (kind === 'input') download(await withNiimath(conformedInput), 'conformed_input.nii.gz')
    if (kind === 'mesh') await nv.saveMesh(nv.meshes.length - 1, 'brainchop.stl')
    if (kind === 'scene') await withPristineLabels(() => nv.saveDocument('brainchop.nvd'))
    $('location').textContent = 'Saved'
  } catch (error) {
    showError('Save failed', error)
  } finally {
    setBusy(false)
  }
}

function openSaveModal() {
  const options = [
    ['conformed', 'Segmentation: conformed', 'resliced to the 256³ · 1 mm model grid', !!seg],
    ['native', 'Segmentation: native space', 'on the input grid', !!seg],
    ['input', 'Conformed input volume', 'the resampled T1 (256³ · 1 mm)', true],
    ['mesh', 'Save STL mesh', 'the mesh shown in the viewer', nv.meshes.length > 0],
    ['scene', 'Scene', 'everything, as a .nvd document', true],
  ]
  showModal('Save', `<div class="save-options">${options.map(([kind, title, sub, ok]) =>
    `<button type="button" class="save-opt" data-kind="${kind}"${ok ? '' : ' disabled'}>
      <span class="save-opt-title">${title}</span><span class="save-opt-sub">${sub}</span></button>`).join('')}</div>
    ${seg ? '<label class="save-mask-option"><input type="checkbox" id="saveBinaryMask"><span><strong>Also save binary mask</strong><small>Foreground 1 · background 0</small></span></label>' : ''}`,
  [])
  $('dialogMessage').querySelectorAll('.save-opt').forEach((btn) => {
    btn.onclick = () => {
      const withMask = $('saveBinaryMask')?.checked
      $('appDialog').close()
      void save(btn.dataset.kind, withMask)
    }
  })
}

// --- labels: Draw, Alt-click isolation and Stats edit or read seg.labels, never the display copy ---
const labelName = (label) => MODELS[seg.model].colormap.labels[label] ?? `label_${label}`

function stats() {
  const { hdr, img } = nv.volumes[0]
  const [, dx, dy, dz] = hdr.pixDims
  seg.stats ??= labelStats(seg.labels, img, { slope: hdr.scl_slope || 1, inter: hdr.scl_inter || 0, voxelMm3: dx * dy * dz })
  return seg.stats
}

function showLabels() {
  nv.volumes[1].img = isolated === null ? seg.labels : seg.labels.map((v) => (v === isolated ? v : 0))
  nv.updateGLVolume()
}

function setIsolated(label) {
  isolated = label
  const rows = label === null ? [] : stats()
  const row = rows.find((r) => r.label === label)
  $('isoHud').hidden = !row
  if (row) {
    const total = rows.reduce((sum, r) => sum + r.volumeMm3, 0)
    $('isoHud').textContent = `${labelName(label)}\n${(row.volumeMm3 / 1000).toFixed(1)} cm³ (${((100 * row.volumeMm3) / total).toFixed(1)}% of brain)\n` +
      `${row.voxels.toLocaleString()} voxels\nintensity ${row.mean.toFixed(0)} ± ${row.stdev.toFixed(0)}`
  }
  if (seg?.kind === 'labels') showLabels()
}

// A pen chip carries the pen value (-1 = off) and, for a filled pen, data-filled.
function setPen(chip = $('penRow').firstElementChild) {
  const pen = Number(chip.dataset.pen)
  nv.drawIsEnabled = pen >= 0
  if (pen >= 0) {
    if (!nv.drawingVolume) nv.createEmptyDrawing() // drawIsEnabled only flips the flag
    nv.drawPenValue = pen
    nv.drawPenFilled = 'filled' in chip.dataset
  }
  $('penRow').querySelectorAll('.chip').forEach((b) => b.classList.toggle('active', b === chip))
}

function applyDrawing(mode) {
  if (mode === 0) return nv.drawUndo()
  if (seg?.kind !== 'labels') return showModal('Draw', '<p>Drawing edits label segmentations: run a labelling model first.</p>')
  const drawing = nv.drawingVolume?.img
  if (!drawing) return showModal('Draw', '<p>Pick a pen and draw on the image first.</p>')
  seg.labels = seg.labels.slice() // a new buffer: NiiVue caches overlay textures by buffer identity
  paintLabels(seg.labels, nv.volumes[1], drawing, mode === 1 ? 1 : 0)
  seg.stats = null
  nv.closeDrawing()
  setPen()
  setIsolated(isolated)
}

function openStats() {
  if (seg?.kind !== 'labels') return showModal('Region volumes', '<p>Stats need a label segmentation: run a labelling model first.</p>')
  const rows = [...stats()].sort((a, b) => b.volumeMm3 - a.volumeMm3)
  const total = rows.reduce((sum, r) => sum + r.volumeMm3, 0)
  const { R, G, B } = MODELS[seg.model].colormap
  const cm3 = (mm3) => (mm3 >= 10000 ? Math.round(mm3 / 1000).toLocaleString() : (mm3 / 1000).toFixed(1))
  // Label names are the package's own colormap data, so they are safe to template.
  showModal('Region volumes', `<div id="statsPanel">
    <div class="stat-toggle"><button type="button" class="active">cm³</button><button type="button">% of total</button></div>
    <span class="stat-total">total ${cm3(total)} cm³</span>
    <div id="statsRows">${rows.map((r) => `<div class="stat-row" data-label="${r.label}">
      <div class="stat-line"><span class="stat-name">${labelName(r.label)}</span>
        <span class="stat-track"><span class="stat-bar" style="background:rgb(${R[r.label]},${G[r.label]},${B[r.label]})"
          data-abs="${(100 * r.volumeMm3) / rows[0].volumeMm3}" data-pct="${(100 * r.volumeMm3) / total}"></span></span>
        <span class="stat-val" data-abs="${cm3(r.volumeMm3)}" data-pct="${((100 * r.volumeMm3) / total).toFixed(1)}%"></span>
        <button type="button" class="stat-iso" title="Show only this region in the viewer">isolate</button></div>
      <div class="stat-detail" hidden>${[['min', r.min], ['max', r.max], ['Q1', r.q1], ['Q3', r.q3], ['median', r.median],
        ['mean', r.mean.toFixed(2)], ['SD', r.stdev.toFixed(2)], ['voxels', r.voxels.toLocaleString()]]
        .map(([k, v]) => `<div><span class="k">${k}</span><span class="v">${v}</span></div>`).join('')}</div></div>`).join('')}</div>
    <button type="button" id="statsCsvBtn">Download CSV</button></div>`)
  const panel = $('statsPanel')
  panel.querySelectorAll('.stat-row').forEach((row) => {
    const detail = row.querySelector('.stat-detail')
    row.onclick = () => { detail.hidden = !detail.hidden }
    row.querySelector('.stat-iso').onclick = (e) => {
      e.stopPropagation() // not a detail toggle
      $('appDialog').close()
      setIsolated(Number(row.dataset.label))
    }
  })
  const showUnit = (unit) => {
    panel.querySelectorAll('.stat-toggle button').forEach((b, i) => b.classList.toggle('active', (i === 1) === (unit === 'pct')))
    panel.querySelectorAll('.stat-val').forEach((v) => { v.textContent = v.dataset[unit] })
    panel.querySelectorAll('.stat-bar').forEach((b) => { b.style.width = `${b.dataset[unit]}%` })
  }
  panel.querySelectorAll('.stat-toggle button').forEach((b, i) => { b.onclick = () => showUnit(i ? 'pct' : 'abs') })
  showUnit('abs')
  $('statsCsvBtn').onclick = () => download(statsCsv(rows, MODELS[seg.model].colormap.labels), 'label_stats.csv')
}

async function openDiagnostics() {
  const adapter = await navigator.gpu?.requestAdapter().catch(() => null)
  const run = lastRun ?? {}
  const text = [
    ':: Diagnostics https://github.com/neuroneural/brainchop/issues ::',
    `Model: ${run.model ?? 'none run yet'}`,
    `Inference backend: ${run.backend ?? '-'}${run.ranInWorker ? ' (worker)' : ''}`,
    `Inference ms: ${run.elapsedMs ? Math.round(run.elapsedMs) : '-'}`,
    `Input dims: ${nv.volumes[0]?.hdr.dims.slice(1, 4).join('×')}`,
    `Renderer: ${nv.backend}`,
    `WebGPU adapter: ${adapter ? `${adapter.info.vendor} ${adapter.info.architecture}`.trim() || 'yes' : 'none'}`,
    `Secure context: ${isSecureContext}`,
    `Cross-origin isolated: ${crossOriginIsolated}`,
    `Cores: ${navigator.hardwareConcurrency}`,
    `User agent: ${navigator.userAgent}`,
    ...(run.log ?? []),
  ].join('\n')
  const copied = await navigator.clipboard.writeText(text).then(() => true, () => false)
  showModal('Diagnostics', `<p>${copied ? 'Copied to the clipboard.' : 'Could not copy to the clipboard.'}</p><pre class="diagnostics"></pre>`)
  $('dialogMessage').querySelector('pre').textContent = text
}

async function updateBackendStatus(ran) {
  const el = $('backendStatus')
  const gpu = ran ? ran === 'webgpu' : (await checkSupport()).supported
  const gl = ran ? ran === 'webgl2' : checkWebgl2Support().supported
  el.textContent = gpu ? 'WebGPU' : gl ? 'WebGL2' : 'CPU'
  el.style.color = gpu ? '#4CAF50' : gl ? '#FF9800' : '#f44336'
  el.title = gpu ? 'WebGPU inference: fastest' : gl ? 'WebGL2 inference (WebGPU unavailable)' : 'No GPU inference: CPU only, where the page allows it'
}

function popover(button, panel) {
  const open = (on) => { panel.hidden = !on; button.setAttribute('aria-expanded', String(on)) }
  button.onclick = () => open(panel.hidden)
  document.addEventListener('click', (e) => { if (!panel.parentElement.contains(e.target)) open(false) })
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') open(false) })
}

// --- drag and drop: NiiVue's own extension lists route volumes and meshes; the rest is DICOM ---
const hasExtension = (extensions, file) => extensions.some((ext) => file.name.toUpperCase().endsWith(`.${ext}`))

// Dimensions and voxel size from a little-endian NIfTI-1 header, which the first stream chunk
// holds; anything else (NIfTI-2, big-endian, empty) has no shape to show.
async function niftiShape(file) {
  let stream = file.stream()
  if (/\.gz$/i.test(file.name)) stream = stream.pipeThrough(new DecompressionStream('gzip'))
  const reader = stream.getReader()
  const { value } = await reader.read()
  void reader.cancel()
  if (!(value?.byteLength >= 348)) return { dims: [] }
  const header = new DataView(value.buffer, value.byteOffset)
  if (header.getInt32(0, true) !== 348) return { dims: [] }
  const dims = Array.from({ length: header.getInt16(40, true) }, (_, i) => header.getInt16(42 + 2 * i, true))
  return { dims, mm: header.getFloat32(80, true) }
}

// Label each image by its sidecar (series number, description, echo/phase suffix) and summarise
// its shape, so the user can tell a 3D anatomical from fMRI or a field map.
async function describeSeries(images, sidecars) {
  const entries = await Promise.all(images.map(async (file) => {
    const base = file.name.replace(NIFTI, '')
    const sidecar = sidecars.find((f) => f.name === `${base}.json`)
    const meta = sidecar ? await sidecar.text().then(JSON.parse).catch(() => ({})) : {}
    const suffix = base.match(/_(e\d+(_ph)?|ph)$/)?.[1]
    const { dims, mm } = NIFTI.test(file.name) ? await niftiShape(file) : { dims: [] }
    const volumes = dims[3] > 1 ? dims[3] : 1
    return { file, number: meta.SeriesNumber ?? 0, voxels: volumes === 1 ? dims.slice(0, 3).reduce((a, b) => a * b, 1) : 0,
      label: [meta.SeriesNumber, meta.SeriesDescription ?? base, suffix].filter((x) => x !== undefined).join(' · '),
      detail: dims.length ? `${dims.slice(0, 3).join('×')} · ${mm.toFixed(1)} mm${volumes > 1 ? ` · ${volumes} volumes` : ''}` : '' }
  }))
  return entries.sort((a, b) => a.number - b.number)
}

async function loadSeries(index) {
  setBusy(true)
  try {
    await nv.loadVolumes([{ url: series[index].file }])
    $('seriesSelect').value = index
    $('location').textContent = series[index].label
  } catch (error) {
    showError('Could not open image', error)
  } finally {
    setBusy(false)
  }
}

// Several series: offer them all, suggesting the largest single 3D volume (the anatomical the
// models expect) rather than loading one arbitrarily.
function chooseSeries() {
  const suggested = series.reduce((best, s, i) => (s.voxels > series[best].voxels ? i : best), 0)
  $('location').textContent = `${series.length} series: choose one`
  showModal(`Choose one of ${series.length} series`, `<div class="save-options series-options">${series.map((s, i) =>
    `<button type="button" class="save-opt${i === suggested ? ' suggested' : ''}" data-i="${i}">
      <span class="save-opt-title"></span><span class="save-opt-sub">${s.detail}${i === suggested ? ' · suggested' : ''}</span></button>`).join('')}</div>`, [])
  $('dialogMessage').querySelectorAll('.save-opt').forEach((button) => {
    button.querySelector('.save-opt-title').textContent = series[button.dataset.i].label // descriptions come from the files
    button.onclick = () => {
      $('appDialog').close()
      void loadSeries(Number(button.dataset.i))
    }
  })
  $('dialogMessage').querySelector('.suggested').focus()
}

async function openFiles(files) {
  if (busy || !files.length) return // a run may have started while the drop was read
  setBusy(true)
  try {
    const scene = files.find((f) => hasExtension(['NVD'], f))
    if (scene) { // a scene replaces everything, so the rest of the drop is moot
      // Reset first: loadDocument empties the scene before it can throw, and fires no volumeLoaded.
      seg = null
      savedBgOpacity = null
      setIsolated(null)
      $('modelSelect').value = ''
      $('seriesSelect').hidden = true
      await nv.loadDocument(scene, { fill: 'current' }) // settings the scene omits keep the app's (e.g. V hotkey)
      setPen()
      if (!nv.volumes.length) throw new Error('The scene contains no loadable image')
      $('opacitySlider0').value = nv.volumes[0].opacity // the scene's, not the slider's
      $('location').textContent = scene.name
      return
    }
    const meshes = files.filter((f) => hasExtension(nv.meshExtensions, f))
    const volumes = files.filter((f) => hasExtension(nv.volumeExtensions, f))
    const jsons = files.filter((f) => f.name.endsWith('.json'))
    const other = files.filter((f) => !meshes.includes(f) && !volumes.includes(f) && !jsons.includes(f))
    let converted = []
    let dicomError
    if (other.length) {
      $('location').textContent = `Converting ${other.length} file(s) with dcm2niix…`
      converted = await runDcm2niix(other, { niftiOnly: false }).catch((error) => { dicomError = error; return [] })
    }
    const images = [...volumes, ...converted.filter((f) => NIFTI.test(f.name))]
    if (!meshes.length && !images.length) throw new Error(`Drop NIfTI images, meshes (such as STL), NiiVue scenes (.nvd), or DICOM files or folders.${dicomError ? ` (dcm2niix: ${dicomError.message})` : ''}`)
    for (const mesh of meshes) await nv.addMesh({ url: mesh })
    $('location').textContent = meshes.map((f) => f.name).join(', ')
    if (!images.length) return
    series = await describeSeries(images, [...jsons, ...converted.filter((f) => f.name.endsWith('.json'))])
    $('seriesSelect').replaceChildren(...series.map((s, i) => new Option(s.label, i)))
    $('seriesSelect').hidden = series.length < 2
    $('seriesSelect').selectedIndex = -1 // nothing chosen yet
    if (series.length > 1) chooseSeries()
    else await loadSeries(0)
  } catch (error) {
    showError('Could not open the drop', error)
  } finally {
    setBusy(false)
  }
}

document.addEventListener('dragover', (e) => e.preventDefault())
document.addEventListener('drop', (e) => {
  e.preventDefault()
  // Called synchronously: the item list is emptied once the event returns.
  if (busy) return
  $('appDialog').close() // an open Mesh, Stats or series dialog holds state the drop invalidates
  traverseDataTransferItems(e.dataTransfer.items).then(openFiles, (error) => showError('Could not read the drop', error))
})
$('seriesSelect').onchange = () => loadSeries(Number($('seriesSelect').value))

// --- toolbar wiring ---
$('opacitySlider0').oninput = () => {
  nv.volumes[0].opacity = Number($('opacitySlider0').value)
  nv.updateGLVolume()
}
$('opacitySlider1').oninput = () => {
  for (const v of nv.volumes.slice(1)) v.opacity = Number($('opacitySlider1').value)
  nv.updateGLVolume()
}
$('modelSelect').onchange = runModel
const dragButtons = $('dragSegmented').querySelectorAll('button')
dragButtons.forEach((btn) => {
  btn.onclick = () => {
    nv.secondaryDragMode = Number(btn.dataset.drag)
    dragButtons.forEach((b) => b.classList.toggle('active', b === btn))
  }
})
popover($('viewBtn'), $('viewPopover'))
$('shadingSlider').oninput = (e) => { nv.volumeIllumination = Number(e.target.value) }
const rendererChips = $('rendererRow').querySelectorAll('.chip')
rendererChips.forEach((btn) => {
  btn.disabled = btn.dataset.backend === 'webgpu' && !navigator.gpu
  btn.onclick = async () => {
    if (btn.dataset.backend === nv.backend) return
    await nv.reinitializeView({ backend: btn.dataset.backend }).catch((error) => showError('Could not switch renderer', error))
    rendererChips.forEach((b) => b.classList.toggle('active', b.dataset.backend === nv.backend))
  }
})
popover($('drawBtn'), $('drawPopover'))
$('penRow').querySelectorAll('.chip').forEach((chip) => { chip.onclick = () => setPen(chip) })
$('drawApplyRow').querySelectorAll('.chip').forEach((b) => { b.onclick = () => applyDrawing(Number(b.dataset.apply)) })
$('statsBtn').onclick = openStats
$('diagnosticsBtn').onclick = openDiagnostics
// Alt/Option-click a region to show only it; again, or on background, restores all. Listening on
// the container survives the canvas swap of a renderer switch. Not while busy: a save briefly
// swaps the pristine labels in (withPristineLabels).
$('canvas-container').addEventListener('click', (e) => {
  if (!e.altKey || busy || seg?.kind !== 'labels' || !lastVox) return
  const label = seg.labels[rasIndex(nv.volumes[1], lastVox)]
  setIsolated(label === 0 || label === isolated ? null : label)
})
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !busy && isolated !== null && !$('appDialog').open) setIsolated(null)
})
const paneButtons = $('paneSwitcher').querySelectorAll('[data-slice]')
paneButtons.forEach((btn) => { btn.onclick = () => { nv.sliceType = Number(btn.dataset.slice) } })
$('resetView').onclick = () => {
  nv.pan2Dxyzmm = [0, 0, 0, 1]
  nv.scaleMultiplier = 1
}
$('saveBtn').onclick = openSaveModal
$('meshBtn').onclick = openMeshDialog
$('dialogXBtn').onclick = () => $('appDialog').close()
$('appDialog').onclick = (e) => { if (e.target === $('appDialog')) $('appDialog').close() }
$('aboutBtn').onclick = () => showModal('About BrainChop', `
  <p><strong>Privacy first.</strong> Everything runs locally in your browser; your images never leave your device.</p>
  <p><strong>Controls.</strong> Drag and drop NIfTI images, meshes (such as STL), scenes (.nvd), or DICOM files or folders; with
  several DICOM series you choose one. Choose a model to segment the image, then <strong>Mesh</strong> to generate
  a mesh for 3D printing, and <strong>Save</strong> it as STL. Press <strong>C</strong> to cycle the clip plane and
  <strong>V</strong> to cycle views. <strong>Option/Alt-click</strong> a region to show it alone; click it again, click
  the background or press Esc to restore all labels.</p>
  <p><strong>Models</strong> from <a href="https://www.npmjs.com/package/@brainchop/mindgrab" target="_blank">@brainchop/mindgrab</a>
  run on WebGPU, or WebGL2 where WebGPU is unavailable. Rendering by
  <a href="https://github.com/niivue/niivue" target="_blank">NiiVue</a>; meshing by
  <a href="https://github.com/rordenlab/niimath" target="_blank">niimath</a>.</p>`)

// --- viewer ---
await nv.attachTo('gl1')
// addColormap returns the canonical (capitalised) name the volumes must use.
const tissueColormaps = Object.fromEntries(TISSUES.map(([name, [r, g, b]]) =>
  [name, nv.addColormap(`tissue-${name}`, { R: [r >> 1, r], G: [g >> 1, g], B: [b >> 1, b], A: [0, 48], I: [0, 255] })]))
nv.addEventListener('sliceTypeChange', (e) => {
  paneButtons.forEach((b) => b.classList.toggle('active', Number(b.dataset.slice) === e.detail.sliceType))
})
nv.addEventListener('locationChange', (e) => {
  lastVox = e.detail.vox
  $('location').replaceChildren(...e.detail.string.split('   ').map((s) => s.trim()).filter(Boolean)
    .map((s) => Object.assign(document.createElement('span'), { className: 'loc-seg', textContent: s })))
})
// A new background image invalidates the segmentation and any unapplied drawing.
nv.addEventListener('volumeLoaded', () => {
  if (nv.volumes.length > 1) return
  seg = null
  setIsolated(null)
  nv.closeDrawing()
  setPen()
  $('modelSelect').value = ''
  restoreBgOpacity()
  $('opacitySlider0').oninput()
})
await nv.loadVolumes([{ url: './t1_crop.nii.gz' }])
void updateBackendStatus()
fetch('https://api.github.com/repos/neuroneural/brainchop')
  .then((r) => r.json())
  .then((d) => { $('star-count').textContent = d.stargazers_count ?? 0 })
  .catch(() => {})
