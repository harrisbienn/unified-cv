# Harris Bienn CV

This repository stages a unified replacement for the RenderCV fork and legacy Jekyll CV site. One validated YAML file drives the public website, printable PDF, and Markdown export.

## Source of truth

Edit `cv/Harris_Bienn_CV.yaml`. Do not edit generated files in `dist/`.

RenderCV 2.8 provides the schema, validation, and document renderers. The custom template at `cv/html/Full.html` wraps RenderCV's HTML output in the portfolio layout. Client-side enhancements turn professional experience and education and training into collapsed vertical timelines and load live GitHub project cards; all professional content remains available without JavaScript.

## Build

The project uses a container so the host does not need Python, Typst, RenderCV, or their dependencies.

```sh
make build
make verify
```

Set `CONTAINER_ENGINE=podman` when Podman is preferred over Docker.

Open `dist/index.html` after a successful build. The output directory also contains `Harris_Bienn_CV.pdf`, `Harris_Bienn_CV.md`, and the intermediate Typst file.

## Content review

The first normalized draft intentionally omits street address, phone number, and references from the public source. Editorial discrepancies and suggested next updates are tracked in `docs/content-review.md`.

## Deployment

The GitHub Actions workflow validates pull requests and deploys pushes to `main` through GitHub Pages. See `docs/migration.md` before changing the existing `harrisbienn.github.io` repository.
