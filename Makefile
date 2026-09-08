IMAGE_NAME := harris-bienn-cv-builder
CONTAINER_ENGINE ?= docker

.PHONY: build image verify clean

image:
	$(CONTAINER_ENGINE) build --tag $(IMAGE_NAME) .

build: image
	$(CONTAINER_ENGINE) run --rm --user "$$(id -u):$$(id -g)" --volume "$(CURDIR):/workspace" $(IMAGE_NAME)

verify:
	test -s dist/index.html
	test -s dist/Harris_Bienn_CV.pdf
	test -s dist/Harris_Bienn_CV.md
	test -s dist/assets/site.css
	test -s dist/assets/site.js
	test "$$(find dist/assets/publications -type f -name '*.jpg' | wc -l)" -eq 7

clean:
	$(CONTAINER_ENGINE) run --rm --volume "$(CURDIR):/workspace" --entrypoint sh $(IMAGE_NAME) -c 'rm -rf /workspace/dist'
