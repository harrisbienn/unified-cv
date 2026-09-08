# Harris Bienn CV

This repository is the canonical source for Harris Bienn's CV and website. One validated YAML file drives the public website, printable PDF, and Markdown export.

## Source of truth

Edit `cv/Harris_Bienn_CV.yaml`. Do not edit generated files in `dist/`.

RenderCV 2.8 provides the schema, validation, and document renderers. The custom template at `cv/html/Full.html` wraps RenderCV's HTML output in the portfolio layout and presents contact details as an icon-linked strip beneath the CV title. Client-side enhancements turn professional experience and education and training into collapsed vertical timelines, present specialties as a Shields.io-enhanced capability grid, organize technical proficiencies into expandable badge groups with on-demand Shields.io icons, place publications, presentations, and awards in distinct static cards, showcase open-source/civic-technology work and community interests in responsive card grids, and load live GitHub project cards. Publication cards include locally hosted first-page or journal-cover thumbnails, while military service honors are presented as an itemized list. All professional content remains available without JavaScript or third-party badge assets.

GitHub project cards use the public repositories endpoint, prefer non-fork and non-archived repositories in recently updated order, and omit names listed in `excludedProjectRepositories` in `site/assets/site.js`.

## Build

The project uses a container so the host does not need Python, Typst, RenderCV, or their dependencies.

```sh
make build
make verify
```

Set `CONTAINER_ENGINE=podman` when Podman is preferred over Docker.

Open `dist/index.html` after a successful build. The output directory also contains `Harris_Bienn_CV.pdf`, `Harris_Bienn_CV.md`, and the intermediate Typst file.

Each build adds content-hash query parameters to the generated stylesheet and script URLs so local previews and GitHub Pages request updated assets after a refresh.

## Content review

The first normalized draft intentionally omits street address, phone number, and references from the public source. Editorial discrepancies and suggested next updates are tracked in `docs/content-review.md`.

## Deployment

The local workflow validates pull requests and publishes `main` at the [`/unified-cv/` project URL](https://harrisbienn.github.io/unified-cv/). A credential-free workflow in [`harrisbienn.github.io`](https://github.com/harrisbienn/harrisbienn.github.io) also builds this repository's `main` branch for the [account-root site](https://harrisbienn.github.io/), automatically each hour or on manual request.

Make all CV content, template, asset, and build changes here. The account-root repository contains deployment plumbing only. See `docs/migration.md` for publishing and rollback details.
