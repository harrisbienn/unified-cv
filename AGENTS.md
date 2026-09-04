# Repository guidance

This repository treats `cv/Harris_Bienn_CV.yaml` as the canonical CV source.

- Build and validate through the container workflow in `Makefile`.
- Do not install RenderCV or its dependencies on the host.
- Generated files belong in `dist/` and are not committed.
- Keep public-site enhancements progressive: the CV must remain complete and readable when JavaScript or the GitHub API is unavailable.
- Do not publish street addresses, phone numbers, or professional references without explicit approval.
