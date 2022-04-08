install:
	npm install

lint:
	npx eslint .

test-coverage:
	npm test -- --coverage