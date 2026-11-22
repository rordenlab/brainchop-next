# brainchop-next

Minimal in-browser brain segmentation built only from stock npm packages:
[@brainchop/mindgrab](https://www.npmjs.com/package/@brainchop/mindgrab) (models),
[@niivue/niivue](https://www.npmjs.com/package/@niivue/niivue) (viewer),
[@niivue/niimath](https://www.npmjs.com/package/@niivue/niimath) (meshing),
[@itk-wasm/cuberille](https://www.npmjs.com/package/@itk-wasm/cuberille) +
[@itk-wasm/mesh-filters](https://www.npmjs.com/package/@itk-wasm/mesh-filters) (watertight meshing) and
[@niivue/dcm2niix](https://www.npmjs.com/package/@niivue/dcm2niix) (DICOM).
Images never leave the browser.

```sh
bun install
bun run dev      # live demo at http://localhost:5173
bun run build    # static site in dist/
```

Models: MindGrab skull stripping, 16chan18cls, mindmap, mindmap partial-volume (GM/WM/CSF), mindsnap (104 regions).
Drop NIfTI images, meshes (STL, GIfTI, …), NiiVue scenes (.nvd), or DICOM files or folders; with several DICOM series a
picker suggests the 3D anatomical. **Mesh** generates a surface over the segmentation or the isolated
region (fast niimath with hollow/closing/bubble options, or slow watertight ITK cuberille, which downloads ~2.3 MB of WASM from jsdelivr per run; Save writes it as STL); **Draw** edits labels, **Stats** reports per-region
volume and intensity, Option/Alt-click shows one region alone, and **Save** writes native or
conformed (256³) segmentations. On phones a pane switcher shows one plane at a time.

```sh
bun test src     # label helper tests
```

Every push to `main` builds, tests and pushes `dist/` to the `gh-pages` branch
(`.github/workflows/deploy.yml`), which GitHub Pages serves at
https://rordenlab.github.io/brainchop-next/ (*Settings → Pages → Deploy from a branch → gh-pages*).
