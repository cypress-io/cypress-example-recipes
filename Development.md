## Development

- when adding a new example, add a matching test job to [circle.yml](circle.yml)
- there is a script [test-examples.js](test-examples.js) useful to run all examples one by one
  * note that the script only runs an example if it has `npm run test:ci` script command.

### Domains

When adding a new recipe, please either use local server or Cypress-controlled domain to avoid the recipe failing when the 3rd party server outside of our control changes or goes down. For example we have `jsonplaceholder.cypress.io` that we can use instead of `jsonplaceholder.typicode.com`.

### Test names

It is a good idea to wrap all tests in a suite using `describe` with the recipes name. For example,

```js
// examples/blogs__iframes/cypress/integration/xhr-spec.js
describe('Recipe: blogs__iframes', () => {
  it('spies on XHR request', () => {
    ...
  })
  it('stubs XHR response', () => {
    ...
  })
})
```

This makes it easy to understand where the test is coming from when looking at the terminal output.

```text
  Recipe: blogs__iframes
    ✓ spies on XHR request (939ms)
    ✓ stubs XHR response (350ms)
```

### Linting

Many recipes are linted using [@cypress/eslint-plugin-dev](https://github.com/cypress-io/eslint-plugin-dev). You can lint a single folder or lint and auto-fix with:

```shell
$ npx eslint examples/blogs__vue-vuex-rest/cypress
$ npx eslint examples/blogs__vue-vuex-rest/cypress --fix
```

There are NPM scripts for linting code and JSON files

```shell
npm run lint
npm run lint:json
```

### Testing in specific browser

You can test some examples using a specific browser. For example, to run just some folders using Brave browser, call

```shell
npm run test:ci:brave
```

Similarly, there are NPM scripts to test Firefox, Chrome, and even run some projects on Windows. The `test:ci:*` scripts are special in that they will find all projects with the matching script in each example subfolder and will only run those projects. Also, these scripts should start the server if necessary in each subproject. For example, [examples/blogs__application-actions/package.json](examples/blogs__application-actions/package.json) has the following scripts

```json
{
  "scripts": {
    "start": "../../node_modules/.bin/http-server -p 8888 --silent -c-1",
    "cypress:run:firefox": "../../node_modules/.bin/cypress run --browser firefox",
    "test:ci:firefox": "../../node_modules/.bin/start-test 8888 cypress:run:firefox"
  }
}
```

And we can test Firefox support by running

```shell
npm run test:ci:firefox
```

**Tip:** you can skip tests in a particular browser using [@cypress/skip-tests](https://github.com/cypress-io/cypress-skip-test) module.

### Recipes for upcoming Test Runner versions

When a new version of Test Runner is about to be released, but is not yet available, you can still write recipes. Just place the new recipes into a branch with the name matching the upcoming version, like [3.7.0](https://github.com/cypress-io/cypress-example-recipes/tree/3.7.0) that will be merged once the version v3.7.0 is officially released and we can upgrade. To run the branch _before_ the official NPM release, you can use [commit-message-install](http://github.com/bahmutov/commit-message-install) utility, that is already set up in [circle.yml](circle.yml) `build` job. It runs after "normal" `npm ci` installation and can install new pre-release version of Cypress based on the commit message. The installation uses a special `json` block object if found inside the commit's message body. A typical commit can be found [here](https://github.com/cypress-io/cypress/commit/b03b25c258990966cbc99e50796c039abbf2f893#commitcomment-36028805) - these comments are posted by CI automatically when each Test Runner `develop` commit is built.

Simply commit an empty set of changes with `git commit --allow-empty` and set the message body like this one

    test with https

    ```json
    {
      "platform": "linux",
      "arch": "x64",
      "env": {
        "CYPRESS_INSTALL_BINARY": "https://cdn.cypress.io/beta/binary/3.7.0/linux-x64/circle-develop-b03b25c258990966cbc99e50796c039abbf2f893-194641/cypress.zip"
      },
      "packages": "https://cdn.cypress.io/beta/npm/3.7.0/circle-develop-b03b25c258990966cbc99e50796c039abbf2f893-194639/cypress.tgz",
      "branch": "3.7.0",
      "commit": "b03b25c258990966cbc99e50796c039abbf2f893",
      "status": {
        "owner": "cypress-io",
        "repo": "cypress",
        "sha": "b03b25c258990966cbc99e50796c039abbf2f893",
        "platform": "linux",
        "arch": "x64",
        "context": "[linux-x64] cypress-test-example-repos"
      }
    }
    ```
and push to the branch. The CircleCI will install Cypress from the above links and then will go through the CI run, allowing you to confirm that the new recipes are working.

Once the new Cypress version is published, merge the branch.

## Fighting flake

If you notice a recipe test failing sometimes, run more of it! In [circle.yml](circle.yml) a job can take `repeat: N` parameter to run the recipe N times. Increase the number of times to run the recipe to flush out flaky tests and fix them.

Example recipe to run 5 times

```
- testing-dom__select2:
    requires:
      - build
    repeat: 5
```
