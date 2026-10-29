# Custom Runestone development build

Place the Runestone development build here, including any additional chunks,
fonts, or other files it produces. PreTeXt copies this directory to
`external/custom-runestone` in the HTML output.

JavaScript interactives with `custom-runestone="yes"` load these entry files,
matching `_runestone_debug_service_info()` in PreTeXt's `pretext.py`:

- `prefix-runtime.bundle.js`
- `prefix-runtime-libs.bundle.js`
- `prefix-runestone.bundle.js`
- `prefix-runtime-libs.css`
- `prefix-runestone.css`

Both the standalone page and its `-if.html` page receive PreTeXt's `eBookConfig`
before these scripts, with `runestone_version` set to `dev`. They use these
assets in place of the standard Runestone bundle. Interactives without the
attribute, or with a value other than `yes`, retain the normal behavior.

To rebuild from the reference checkout, run this from the rsResearch directory:

```powershell
npm --prefix C:\Code\rs\bases\rsptx\interactives run build -- --config "$PWD/scripts/webpack.custom-runestone.cjs"
```

The local config uses Runestone's browser webpack configuration in development
mode and places the bundle, chunks, styles, and supporting assets here. It keeps
the build cache in rsResearch and skips Runestone's server-side compilation.
Run `pretext build web` afterward to copy the assets into the published
`output/web/external/custom-runestone` directory.
