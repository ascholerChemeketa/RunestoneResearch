# Runestone Research

This PreTeXt book is a workspace for experimenting with Runestone components.

## Overview

A PreTeXt JavaScript `<interactive>` with `custom-runestone="yes"` loads a
hand-built version of Runestone's JavaScript and CSS from
`assets/custom-runestone/`. Edit a fork of Runestone, rebuild that bundle, and
rebuild the book to try a new component feature. The standard components on
the book page keep using PreTeXt's normal Runestone bundle. Each experiment
can reuse this setup without further changes to PreTeXt's core or XSL.

The interactive displays its content in an iframe. The custom bundle loads
inside that iframe, discovers the copied HTML by its native `data-component`
value, and initializes it as a Runestone component.

## Adding an Experimental Component

1. Make a standard component in the PreTeXt source and build the `web` target.
   Copy that component's generated HTML into an XML-compatible XHTML file
   under `source/experiments/`. Preserve its Runestone markup and attributes;
   add the default XHTML namespace to the outer element. See
   `source/experiments/activecode.xhtml` and `parsons.xhtml`.
2. Give the copied component a separate question ID from the standard one.
   There must be one primary `data-component` element with
   `id="__RUNESTONE_ID__"`. Use the same placeholder in any IDs or references
   derived from it, such as ActiveCode's `__RUNESTONE_ID___editor`. The custom
   XSL replaces these placeholders with the enclosing exercise's `label`
   (plus PreTeXt's normal Runestone prefix). Leave unrelated IDs alone.
3. Include the XHTML in a JavaScript interactive. The containing section must
   declare the XInclude namespace, as the example below does. The optional
   `source` script is for experiment-specific page code and belongs under
   `assets/experiments/` (or omit the attribute if it is not needed); changes
   to the component itself belong in the Runestone fork.

```xml
<section xmlns:xi="http://www.w3.org/2001/XInclude" xml:id="my-section">
  <title>My experiment</title>
  <exercise xml:id="my-exercise" label="my-experiment">
    <statement>
      <interactive xml:id="my-interactive" platform="javascript"
                   custom-runestone="yes" design-width="1000" aspect="4:1"
                   source="experiments/my-experiment.js">
        <slate xml:id="my-slate" surface="html">
          <xi:include href="experiments/my-experiment.xhtml" />
        </slate>
      </interactive>
    </statement>
  </exercise>
</section>
```

For example, the ActiveCode snapshot contains a `data-component="activecode"`
element and a `data-duck-api="true"` attribute. The latter enables an
experimental Runestone change that calls the book server's Duck API proxy
each time the learner presses **Run** and shows the result below the editor.
Only this experimental component opts in. Native Runestone logging and answer
restoration still use the component's resolved question ID.

Custom Runestone iframes use responsive resizing automatically; no authored
`resize-behavior` attribute is needed.

## Build a Modified Runestone Bundle

Fork and clone [Runestone's `rs` repository](https://github.com/RunestoneInteractive/rs).
Make component changes under
`bases/rsptx/interactives/runestone/<component>/`. The npm package and
`webpack.config.js` are in `bases/rsptx/interactives/`, **not** its `runestone/`
subdirectory. Use the Node and npm versions required by that package's
`package.json`, then install its dependencies with `npm ci`.

From the **interactives directory**, build the bundle to the book's `assets/custom-runestone/`:

```bash
npm run build -- --env "builddir=/path/to/yourbook/assets/custom-runestone"
```

The adapter writes the browser bundle, lazy-loaded chunks, CSS, fonts, and
other required assets to the book's `assets/custom-runestone/`.

Those assets are copied into the output directory when the book is built.
This customized runestone bundle is used only by `<interactive custom-runestone="yes">` elements.

## Features that Need a Server

The custom JavaScript bundle can change client-side behavior, but it cannot
grant browser access to an external API that blocks cross-origin requests or
provide server-held credentials. If a proposed feature needs access to an
external domain for an API or a similar service, [file a Runestone feature
request](https://github.com/RunestoneInteractive/rs/issues/new). Describe the
service and request shape so Runestone can provide the necessary server-side
support. This book's Duck API demonstration uses an explicitly allowlisted
route in Runestone's book-server `rsproxy`; that route is an example of such
support, not a general-purpose proxy for arbitrary URLs.

The main book source is `source/main.ptx`. The project pins its PreTeXt CLI
version in `requirements.txt`.

## XSL

The project's
`xsl/custom.xsl` monkey-patches PreTeXt to include the hosted Runestone
manifest entry, configure the custom assets, and enables automatic iframe resizing.

Currently, any book using experimental components requires this custom XSL.
Once this XSL is merged into PreTeXt, it will no longer be required.