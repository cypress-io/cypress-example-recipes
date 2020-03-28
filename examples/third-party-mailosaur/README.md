## Testing emails with Cypress and Mailosaur

We are using an open email `cypress-mailosaur-test@protonmail.com` with pw `Password-1`. Login at [Mailosaur application](https://mailosaur.com/app/).

Also `cypress.env.json` is shared.
This is so that things can work out of the box without any setup. We trust the community to put it to good use.

To get started:

```bash
# at repo root
npm i
# nav to this folder and run
npm run cypress:open
# or
npm run cypress:run
```

There are 2 test specs with different approaches.

* `mailosaur-cypress.spec` implements [Mailosaur API](https://docs.mailosaur.com/reference) using Cypress. Utilizes plugins and helper utilities to construct a test suite.

* `mailosaur-npm-cy-task.spec` utilizes [Mailosaur's Node package](https://www.npmjs.com/package/mailosaur) and [Mailosaur getting started examples](https://docs.mailosaur.com/docs/development) and implements them using [`cy.task`](https://docs.cypress.io/api/commands/task.html#Syntax).

> Note: [`sendmail` npm package](https://www.npmjs.com/package/sendmail) has been included to send custom emails utilizing `cy.task()`. Note that this is for testing the repo and usually your application would be sending these emails.

### Examples to improve upon

One can keep building the test suite with the api docs [](https://docs.mailosaur.com/reference).

* [Downloading attachments](https://docs.mailosaur.com/reference#download-an-attachment)
* [Spam test](https://docs.mailosaur.com/reference#perform-a-spam-test)
* Validating email content.

The idea is to utilize the `getEmailBody` function and access the email's html, links, images, attachments etc. properties. From there on you can build on the test suite
