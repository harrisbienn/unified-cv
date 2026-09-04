ARG RENDERCV_VERSION=2.8

FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

ARG RENDERCV_VERSION

ENV UV_TOOL_DIR=/opt/uv-tools
ENV UV_TOOL_BIN_DIR=/usr/local/bin

RUN uv tool install "rendercv[full]==${RENDERCV_VERSION}"

ENV HOME=/tmp/rendercv-home
ENV XDG_CACHE_HOME=/tmp/rendercv-cache

WORKDIR /workspace

COPY scripts/build.sh /usr/local/bin/build-cv
RUN chmod 0755 /usr/local/bin/build-cv

ENTRYPOINT ["build-cv"]
