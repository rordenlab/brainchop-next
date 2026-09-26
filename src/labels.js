// Pure label-volume helpers (bun test src/labels.test.js). Labels are uint8, in the image's
// storage order; NiiVue's drawing bitmap and locationChange voxels are in RAS order.

/** Storage index of a RAS voxel, mirroring NiiVue's own getVoxelValue. */
export function rasIndex(vol, [x, y, z]) {
  const [a, b, c] = vol.img2RASstart
  const [sx, sy, sz] = vol.img2RASstep
  return a + x * sx + b + y * sy + c + z * sz
}

/** Set every labelled voxel that the RAS-ordered drawing marks to `value`. */
export function paintLabels(labels, vol, drawing, value) {
  const [, nx, ny, nz] = vol.dimsRAS
  let r = 0
  for (let z = 0; z < nz; z++)
    for (let y = 0; y < ny; y++)
      for (let x = 0; x < nx; x++, r++) if (drawing[r]) labels[rasIndex(vol, [x, y, z])] = value
}

/**
 * Per-label volume and intensity statistics of `image` (same grid as `labels`). Values are
 * grouped by label in one buffer and each group sorted, so quartiles are exact for any datatype.
 */
export function labelStats(labels, image, { slope, inter, voxelMm3 }) {
  const count = new Uint32Array(256)
  for (const v of labels) count[v]++
  count[0] = 0 // background
  const start = new Uint32Array(257)
  for (let v = 0; v < 256; v++) start[v + 1] = start[v] + count[v]
  const values = new Float32Array(start[256])
  const next = start.slice(0, 256)
  for (let i = 0; i < labels.length; i++) if (labels[i]) values[next[labels[i]]++] = image[i] * slope + inter
  const rows = []
  for (let label = 1; label < 256; label++) {
    const n = count[label]
    if (!n) continue
    const s = values.subarray(start[label], start[label + 1]).sort()
    let sum = 0, sumSq = 0
    for (const x of s) { sum += x; sumSq += x * x }
    const mean = sum / n
    const q = (p) => s[Math.max(0, Math.ceil(p * n) - 1)]
    rows.push({ label, voxels: n, volumeMm3: n * voxelMm3, min: s[0], max: s[n - 1],
      q1: q(0.25), median: q(0.5), q3: q(0.75), mean, stdev: Math.sqrt(Math.max(0, sumSq / n - mean * mean)) })
  }
  return rows
}

export function statsCsv(rows, names) {
  const quote = (s) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)
  const keys = ['voxels', 'volumeMm3', 'min', 'max', 'q1', 'median', 'q3', 'mean', 'stdev']
  return [['label', 'name', ...keys].join(','),
    ...rows.map((r) => [r.label, quote(names[r.label] ?? `label_${r.label}`), ...keys.map((k) => +r[k].toFixed(6))].join(','))]
    .join('\n') + '\n'
}
