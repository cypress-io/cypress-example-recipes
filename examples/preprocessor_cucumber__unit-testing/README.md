# unit test with Gerkin

<https://www.rb2.nl/en/university/how-to-use-cypress-with-cucumber-plugin>

# unit-test-application-code

> Load and unit test application code without loading a web page

- Unit test your own application code libraries with Cucumber.
- Test the canonical *fizzbuzz* test  with Gherkin language

In [cypress/integration](cypress/integration) folder the specs show:

- FizzBuzz.feature
the gherkin file with the scenarios of the feature to be tested

In [cypress/integration/commonn](cypress/integration/common) folder, you place the steps binding that are common to all gherkin features.

**note:** the specs load the application directly, there is no web server to start.
 Just do `npm run cypress:bdd` to open Cypress and run only the Cucumber/Gherkin specs.
