## Development

- when adding a new example, add a matching test job to [circle.yml](circle.yml)
- there is a script [test-examples.js](test-examples.js) useful to run all examples one by one
  * note that the script only runs an example if it has `npm run test:ci` script command.

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
