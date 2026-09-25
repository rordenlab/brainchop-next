import { expect, test } from 'bun:test'
import { labelStats, paintLabels, rasIndex, statsCsv } from './labels.js'

// 2x2x1 grid stored with x flipped relative to RAS: RAS x=0 is storage index 1.
const vol = { dimsRAS: [3, 2, 2, 1], img2RASstart: [1, 0, 0], img2RASstep: [-1, 2, 4] }

test('rasIndex follows the storage permutation', () => {
  expect(rasIndex(vol, [0, 0, 0])).toBe(1)
  expect(rasIndex(vol, [1, 1, 0])).toBe(2)
})

test('paintLabels writes drawn RAS voxels into storage order', () => {
  const labels = new Uint8Array(4)
  paintLabels(labels, vol, new Uint8Array([1, 0, 0, 1]), 7)
  expect([...labels]).toEqual([0, 7, 7, 0])
})

test('labelStats: exact quartiles, scaling, background skipped', () => {
  const labels = new Uint8Array([0, 2, 2, 2, 2, 5])
  const image = new Int16Array([99, 4, 1, 3, 2, 10])
  const [a, b] = labelStats(labels, image, { slope: 2, inter: 1, voxelMm3: 0.5 })
  expect(a).toMatchObject({ label: 2, voxels: 4, volumeMm3: 2, min: 3, max: 9, q1: 3, median: 5, q3: 7, mean: 6 })
  expect(a.stdev).toBeCloseTo(Math.sqrt(5))
  expect(b).toMatchObject({ label: 5, voxels: 1, min: 21, max: 21, stdev: 0 })
  expect(statsCsv([b], ['bg'])).toBe('label,name,voxels,volumeMm3,min,max,q1,median,q3,mean,stdev\n5,label_5,1,0.5,21,21,21,21,21,21,0\n')
})
