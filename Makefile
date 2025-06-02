# Variables for output directories and files
DIST = dist
DOCS_DIR = $(DIST)/docs
BUILD_OUT = $(DIST)/index.js
ZIP = $(DIST)/lambda.zip

# Declare phony targets (not actual files)
.PHONY: all build test lint format docs clean package update help

# Default target: build and package the project
all: package

# Build target: clean, lint, format, test, then build
build: clean lint format test
	@deno run -A build/build.ts

# Package target: build, generate docs, and zip output
package: build docs
	@cd $(DIST) && zip -r lambda.zip index.js docs

# Lint target: run Deno linter
lint:
	@deno lint

# Format target: run Deno formatter
format:
	@deno fmt

# Test target: run tests in test/ directory
test:
	@deno test test/ -A --permit-no-files --doc

# Docs target: generate HTML documentation in dist/docs/
docs:
ifeq ($(OS),Windows_NT)
	@if not exist $(DIST) mkdir $(DIST)
	@if not exist $(DOCS_DIR) mkdir $(DOCS_DIR)
else
	@mkdir -p $(DOCS_DIR)
endif
	@deno doc --lint --html --output=$(DOCS_DIR) src/

# Clean target: remove the dist/ directory
clean:
ifeq ($(OS),Windows_NT)
	@if exist $(DIST) rmdir /S /Q $(DIST)
else
	@[ -d $(DIST) ] && rm -rf $(DIST) || true
endif

# Update target: update dependencies to latest
update:
	@deno outdated --update --latest

# Help target: print available make commands
help:
	@echo "make             → Build and package the project"
	@echo "make build       → Clean, lint, fmt, test, and build"
	@echo "make package     → Build, generate docs, and zip dist content"
	@echo "make test        → Run tests"
	@echo "make lint        → Run linter"
	@echo "make format      → Check code formatting"
	@echo "make docs        → Generate full HTML docs site in dist/docs/"
	@echo "make clean       → Remove the dist/ directory"
	@echo "make update      → Update dependencies"
