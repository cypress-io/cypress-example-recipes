/// <reference types="cypress" />
import { Given, Then } from 'cypress-cucumber-preprocessor/steps'
import fizzbuzz from '../../../fizzbuzz'

let inputNumber = 0

Given(`I try with {int}`, (i) => {
  inputNumber = i
})

Then(`the output shall be: {string}`, (text) => {
  expect(fizzbuzz(inputNumber)).to.eq(text)
})

//  with regular expression to match a string
Then(/^the output shall be ([^"]*)$/, (text) => {
  expect(fizzbuzz(inputNumber)).to.eq(text)
})
