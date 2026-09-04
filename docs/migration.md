# Migration plan

## Target architecture

`cv/Harris_Bienn_CV.yaml` is the only CV content source. RenderCV validates it and produces the PDF, Markdown, and HTML outputs. The custom `cv/html/Full.html` template adds the web layout, while `site/assets` supplies progressive enhancement for section navigation, theme preference, and public GitHub projects.

The generated `dist` directory is the GitHub Pages artifact. It is disposable and must not be edited by hand.

## Preserving harrisbienn.github.io

GitHub reserves the account-root Pages URL for the repository named `harrisbienn.github.io`. The lowest-maintenance migration is therefore to make this new codebase the next generation of that repository rather than introducing a second deployment repository and a cross-repository credential.

Recommended cutover:

1. Keep the current `harrisbienn.github.io` repository unchanged while this staging repository is reviewed.
2. Tag the legacy site's last commit and preserve its `master` branch.
3. Push this repository's `main` branch to `harrisbienn.github.io`.
4. In the repository's Pages settings, select GitHub Actions as the source.
5. Run the workflow manually, inspect the deployment, then make subsequent CV updates only in the RenderCV YAML source.

If a truly separate source repository is preferred, it can publish to a project URL without extra credentials. Publishing that separate repository to the account-root URL would require a controlled cross-repository deployment credential and is intentionally deferred.

## Legacy functionality retained

- A browsable HTML CV at the existing account-root URL.
- A printable PDF generated from the same content.
- Live public GitHub project cards with a resilient profile-link fallback.
- Responsive navigation and a user-selectable light or dark color theme.

The old Jekyll configuration and includes are replaced by RenderCV output and a custom HTML wrapper, eliminating the duplicated CV content previously stored in `_config.yml`.
