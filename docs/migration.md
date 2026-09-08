# Publishing architecture

## Target architecture

`cv/Harris_Bienn_CV.yaml` is the only CV content source. RenderCV validates it and produces the PDF, Markdown, and HTML outputs. The custom `cv/html/Full.html` template adds the web layout, while `site/assets` supplies progressive enhancement for section navigation, theme preference, and public GitHub projects.

The generated `dist` directory is the GitHub Pages artifact. It is disposable and must not be edited by hand.

## Preserving harrisbienn.github.io

GitHub reserves the account-root Pages URL for the repository named `harrisbienn.github.io`. That repository is therefore retained as a thin publisher while this repository remains the only editable CV and website source.

Its workflow checks out public `unified-cv/main`, runs this repository's containerized build and verification, and deploys the generated `dist/` artifact. It runs hourly, after deployment-plumbing changes, or by manual dispatch. No source files or generated artifacts are copied into the root repository, and no personal access token or cross-repository write credential is required.

The root workflow's source-build job has read-only access. Its separate deployment job alone receives `pages: write` and `id-token: write`. A failed build or verification stops before deployment, leaving the last successful site live.

## Release and rollback

Merging into `main` immediately updates the project URL. The account-root URL updates on the next hourly publisher run, or immediately when `Publish central CV` is manually dispatched in `harrisbienn.github.io` with `source_ref=main`.

To roll back the account-root site without rewriting history, dispatch that workflow with a known-good commit SHA from this repository. After a fix is merged, dispatch `source_ref=main` to resume current releases. The detailed operational runbook lives in the [root publisher repository](https://github.com/harrisbienn/harrisbienn.github.io/blob/master/docs/deployment.md).

## Legacy functionality retained

- A browsable HTML CV at the existing account-root URL.
- A printable PDF generated from the same content.
- An icon-linked contact strip sourced from the RenderCV identity fields.
- Vertically scrolling professional-experience and education-and-training timelines with collapsed, expandable details.
- A responsive specialties showcase with optional Shields.io badges and a text fallback.
- Collapsed technical-proficiency groups with on-demand Shields.io badges and complete local text fallbacks.
- Distinct publication, presentation, and award cards, with locally hosted first-page or journal-cover thumbnails for publications and an itemized military-honors list.
- A responsive three-card Community and Interests showcase derived from labeled RenderCV entries.
- Live public GitHub project cards with a resilient profile-link fallback.
- Responsive navigation and a user-selectable light or dark color theme.

The old Jekyll configuration and includes are replaced by RenderCV output and a custom HTML wrapper, eliminating the duplicated CV content previously stored in `_config.yml`.
