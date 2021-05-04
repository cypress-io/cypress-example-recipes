/// <reference types="cypress" />

import { Given, Then } from 'cypress-cucumber-preprocessor/steps'
import fizzbuzz from '../../../fizzbuzz'

let inputNumber = 0

Given(`I try with {int}`, (i) => {
  inputNumber = i
})

//    I see Fizz     in the output
Then(`I see {string} in the output`, (text) => {
  expect(fizzbuzz(inputNumber)).to.eq(text)
})
