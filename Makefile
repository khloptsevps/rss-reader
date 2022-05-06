install:
	npm ci

build:
	npx webpack

develop:
	npx webpack serve --env develop

lint:
	npx eslint .