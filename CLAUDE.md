# CLAUDE.md — brainchop-next

The leanest replica of brainchop-test's look and feel (`../brainchop-test`), built only from
stock npm packages: `@niivue/niivue` 1.0.0-rc.61 (viewer), `@brainchop/mindgrab` 0.1.20261122
(models), `@niivue/niimath` 1.4.20260924 (meshes, conform, reslice), `@niivue/dcm2niix`
1.4.20261029 (DICOM), `@itk-wasm/cuberille` 0.2.0 + `@itk-wasm/mesh-filters` 1.7.0 (watertight
mesh). No patches to any package. Bun + Vite. The goal is to showcase clean usage: no excessive
guards, comments only for non-obvious "why".

```sh
bun install && bun run dev    # live demo
bun test src                  # label helper tests (also run by CI)
bun run build                 # dist/, relative base './' so the /brainchop-next/ subpath works
```

Files: `index.html` (brainchop-test toolbar/footer markup + Mesh button + series picker + phone
pane switcher), `src/main.js` (UI logic), `src/labels.js` (pure label helpers: RAS indexing, draw
painting, per-label stats, CSV; tests in `labels.test.js`), `src/style.css` (trimmed from
brainchop-test's `css/brainchop.css`; phone layout is a media query, not JS),
`public/` (default image, favicon, `.nojekyll`).

Features: models, opacity, drag modes, shading/renderer, Draw (pen + Append/Remove/Undo into
label models), Stats (per-label volume/intensity, cm³/% toggle, isolate, CSV), Diagnostics
(copied to clipboard, includes mindgrab log), Alt-click isolation (+ readout, Esc restores), Save
(conformed / native segmentation, optional binary mask, conformed input, STL mesh, scene), Mesh
(brain2print parity: niimath with hollow / closing / fill bubbles / largest cluster / reduce / smooth,
or ITK cuberille → repair → largest → smoothRemesh → repair; an isolated label is meshed alone),
drops of NIfTI, meshes, NVD scenes and DICOM (series picker), phone layout (slim chrome, pane
switcher, V cycles views). Not ported: tissue-overlay
Alt-click isolation for the PVE model, the memory indicator.

## Deployment

`.github/workflows/deploy.yml` mirrors `../browserqc`: on push to `main`, Bun (pinned) runs
`install --frozen-lockfile`, `test src`, `build`, then `JamesIves/github-pages-deploy-action`
pushes `dist/` to the `gh-pages` branch (`contents: write`). Pages serves that branch (Settings →
Pages → Deploy from a branch → `gh-pages` / root) at https://rordenlab.github.io/brainchop-next/.
`public/.nojekyll` is required: Vite emits `assets/__vite-browser-external-*.js`, and Jekyll drops
files starting with `_`. No custom domain (browserqc has `public/CNAME`).

## Load-bearing decisions

- Vite `optimizeDeps.exclude` for niimath, dcm2niix, mindgrab, `@itk-wasm/*`, `itk-wasm`: the dev
  prebundler breaks their `new Worker(new URL(...))` / glue imports. `worker: { format: 'es' }`
  is required by `vite build` (mindgrab's worker uses top-level await).
- No `volumeIsNearestInterpolation`: since rc.15 label overlays are nearest in 2D by default and
  the 3D render stays linear (niivue/mono #210; brainchop-test needed a dist patch for this).
- Label LUTs: each model's table is registered once with `addColormap` (a `labels` array makes it a
  label colormap) and passed as `addVolume({ colormap })`. By rc.61 the label LUT is derived from
  `colormap`, so a continuous name (e.g. `gray`) clears a passed `colormapLabel`. Avoid
  `setColormapLabel` (rc.15–19 scanned every voxel for legend centroids, ~1 s).
- NiiVue caches overlay textures by `img` buffer identity: never edit `img` in place; assign a new
  array (Draw paints into `seg.labels.slice()`).
- Label state: `seg.labels` holds the pristine voxels; the displayed `img` may be an isolation
  copy. Saves and Stats read `seg.labels` (Mesh too, unless a label is isolated: then it meshes
    the shown copy); `withPristineLabels()` swaps it in around `saveVolume` / `saveDocument`.
  Alt-click and Esc are ignored while busy for that reason.
- `setBusy` disables every control that can load an image or start work, so `runModel` needs no
  stale-image check. `openFiles` still checks `busy`: the drop's folder walk is asynchronous.
- A new background image closes any unapplied drawing (`nv.closeDrawing()`; `loadVolumes` does
  not) and resets pens; a new model run removes meshes (a mesh belongs to its segmentation).
- `#appDialog` content persists after close: dialog CSS must be scoped to `[open]` or a closed
  dialog can render over the canvas and swallow clicks. Dialog buttons are `[label, action]`
  pairs in `#dialogButtons`; tile dialogs (Save, series) pass `[]`. Button styling is scoped to
  `.dialog-buttons`: a bare `dialog button` rule leaks float/margin into the tiles.
- Saves: native files are `saveVolume({filename:''})` bytes (the mask: `binaryMask`), i.e.
  uncompressed `.nii`; conformed files use niimath `conform()` + `resliceNN`. One niimath per task (`withNiimath`), disposed after.
- Drops: `filesFromDataTransfer` must be called synchronously in the drop event; a drop closes
  `#appDialog` (Mesh/Stats/picker hold state the drop invalidates). A
  `.nvd` scene replaces everything: app state is reset *before* `loadDocument` (it empties the
  scene, can then throw, and fires no `volumeLoaded`), with `fill: 'current'` so settings the
  scene omits keep the app's (else e.g. the V hotkey reverts to off). Scene `url`/thumbnail entries
  are fetched (a foreign scene can ping a server; accepted). Files route by NiiVue's own
  `meshExtensions` / `volumeExtensions`; `.json` are sidecars; everything else goes to
  `convert` (its `series` pair each image with its parsed sidecar; a nonzero exit keeps partial
  output), whose failure is ignored if anything else loads, else its last log line is appended to
  the generic "Drop NIfTI…" error. Several images open a picker (series number ·
  description · echo suffix, shape from a little-endian NIfTI-1 header) suggesting the largest
  single 3D volume. Stray recognised files (e.g. a viewer's PNG icon on a DICOM CD) appear as
  extra picker tiles.
- Mesh: niimath writes mz3, loaded as the only mesh; Save → STL uses `nv.saveMesh` (winding
  verified outward). Do NOT set `meshXRay`: its pass redraws every depth-failing surface
  (`depthFunc(GREATER)`), so a folded brain shows its own sulcal walls through itself. In 3D the
  head render hides the mesh; BG opacity 0 reveals it.
- ITK mesh (`itkMesh`), replacing brain2print's cbor-x / nifti-reader / static-copy:
  - `binaryMask` (also the Save mask): niimath `thr 0.5 bin` as `char`, applying `scl_slope`, so
    labels, mask and tissues all work. niimath GZIPS WHATEVER THE OUTPUT NAME SAYS (the old
    `binary_mask_native.nii` was gzip), so it asks for `.nii.gz` and decompresses.
  - Geometry from `nv.volumes[1].hdr` (`dims`, `affine`, qform or sform resolved; every mesh source
    shares overlay 1's grid); voxels are the file's last bytes. RAS goes straight into ITK (axes
    are arbitrary) and comes out RAS. Direction is ROW-major: the default image's direction is
    symmetric, so only an oblique header catches a transpose (brain2print's helper is column-major).
    Voxel data must own its buffer, or the wasm throws.
  - mesh-filters 1.7.0 wrappers drop falsy options: zeros go as strings (`newtonIterations: '0'`,
    `minimumComponentArea: '0'`, else repair silently drops components under 3% of the area even
    with Largest off).
  - One worker per run (cuberille's `getDefaultWebWorker`, terminated in `finally`): the package
    default caches a failed pipeline download until reload. Pipelines (JS glue + WASM, ~2.3 MB,
    zst 1.97 MB + JS 0.34 MB, the same if bundled) come from
    version-pinned jsdelivr URLs, re-fetched per run (HTTP cache). Offline (`!navigator.onLine`)
    errors become a dialog pointing to niimath; everything else works offline.
  - Hand-written MZ3 to NiiVue: NiiVue reads `.iwm.cbor` but exports no CBOR encoder, and
    `createMesh` is not exported.
  - Verified (headed Chromium): oblique x-flipped and qform-only headers match niimath's extents
    within 0.1 mm, STL volume positive; two spheres keep the small one with Largest off.
- Tissue fractions are uint8 with `scl_slope` 1/255 (never assume float32). Shown as in NiiVue's
  `vox.tissues` example: solid tints, alpha modulated by the fraction itself, ADDITIVE overlay
  blend (the old BG dimming is gone). Mesh the upstream `tissues.brain` (GM+WM) at 0.5.
- `addColormap` canonicalises names; use its return value (`tissueColormaps`).

## Testing

`bun test src` covers `labels.js`. Browser checks (Playwright, kept outside the repo) ran headed
Chromium (WebGPU) on dev and on a production build served from a subpath: all five models, STL
export (signed volume positive, ~1.2–1.6 L), mesh generate/cancel/drop/save, single .dcm and a
34-folder DICOM drop (19 series, picker suggests `5 · anat-T1w`) from
`../bidsui/datasets/reproinXA60e_DICOM_small/20260508120410_RO`, a DICOM folder with stray PNG/JSON,
Draw/Stats/isolation/saves/Diagnostics, and the phone layout. Folder drops were simulated with mock
FileSystemEntry objects (a real OS drag cannot be scripted). App-level WebGL2 fallback is
untested (headless SwiftShader too slow); mindgrab's own suite covers webgl2 and cpu.
dcm2niix 1.3.20260724 → 1.4.20261029 (stable = rc.2 bytes; fresh headless Chromium per run, drop → picker, M4 Pro):
618-file dcm_qa_nih 263 → 203 ms, renderer +106 → +92 MB; UIH 3D T1 (160 files, 78 MB) 438 →
413 ms, +352 → +277 MB (WORKERFS reads instead of copying into MEMFS); reproin XA (68 files)
805 → 635 ms, +282 → +242 MB (rc.1 was 827 ms; outputs byte-identical to rc.1).

## Ideas that would shrink the app further

- niivue: directory-aware drop + multi-file loader hook (−25); `addVolume` accepting ArrayBuffer
  + name and a `colormapLabel` option (−4); export its download helper (−3). #212 (pinch zoom) is
  open. Judged not compelling for NiiVue: per-label visibility (app zeroes data instead, since
  alpha-0 labels smear in the 3D ray-march), per-label getDescriptives.
- mindgrab: `detectBackend()` for the status badge; tissue colormaps like `MODELS[].colormap`.
- Skipped deliberately: native `popover`/`commandfor` (positioning inside the phone toolbar's
  scrolling row), merging the stats wrapper/footer wrappers, SHA-pinned actions, zipping
  multi-file saves (browsers may prompt once to allow multiple downloads). Audit 2026-09: Alt-click
  via `locationChange` `values[1]` (reads the isolated buffer, so can't switch isolation), dropping
  `describeSeries`' NIFTI guard (a bad .gz would fail the whole drop), dropping `ranInWorker`
  (Diagnostics), resyncing drag/shading/pane toolbar state from a loaded scene. Audit 2026-10
  (rc.19): none of the niivue ideas above landed (`downloadBlob` exists but is unexported);
  kept `colormapType: 1` on tissues (redundant with self-modulation, but matches vox.tissues);
  `setModulationImage` resolves ids by name, so a background named `gm.nii` would be modulated
  instead (accepted); foreign scenes with ≥2 overlays render ADDITIVE via `fill: 'current'`
  (accepted, as for other settings). Audit 2026-10-29 (dcm2niix stable): kept the app's own sidecar pairing for dropped volumes, since dcm2niix `groupOutputs` keeps only its output extensions (drops MHA, MIF, …) and keys by `relativePath`, which dropped files lack. Pre-existing, accepted: a dropped `.json` containing `null` throws in `describeSeries`; same-named NIfTI in different folders share the first sidecar.
  Audit 2026-11-22 (ITK mesh): no repo test for `itkMesh` (needs a browser and the CDN; scratch
  Playwright checks only). Unverified: niimath's `hollow` may keep only the largest component itself
  (`coreFLT.c` under `NII2MESH`), so Largest off might not apply with Hollow on. Kept two smoothing
  sliders (different algorithms and ranges).
