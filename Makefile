.PHONY: help
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install package extension
	@echo "Installing package extension"
	npm install
	@echo "Packages installed"

run-dev: ## Start lodex
	@echo "Starting extension"
	npm run start
	@echo "Greenframe extension is now started"
	
build-extension: ## Build the extension locally
	@echo "Building extension"
	npm run build
	@echo "Extension built"