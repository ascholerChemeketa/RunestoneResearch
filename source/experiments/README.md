# Experiment HTML

These XHTML fragments were copied from the standard components in
`output/web/sec-activecode.html` and `output/web/sec-parsons.html`. Each section
includes its fragment inside an HTML slate using `xi:include`.

Edit these source files to change the experiment's HTML. They are snapshots,
so rebuilding the book does not replace your edits with freshly generated HTML.
Keep the XHTML namespace on the outer element and use XML-compatible markup.

The component IDs use `experiment` instead of `baseline` so the experiment and
the standard example have independent saved state. Keep IDs and any references
to them consistent when making changes.

Experiment-specific JavaScript belongs in `assets/experiments/activecode.js` or
`assets/experiments/parsons.js`. The custom Runestone build belongs in
`assets/custom-runestone/`.
