/// <reference types="cypress" />

import { Given, Then } from 'cypress-cucumber-preprocessor/steps'
import fizzbuzz from '../../fizzbuzz'

let inputNumber = 0

Given(`I try with (+d)`, (i) => {
  inputNumber = i
})

// This is the same step that we have in socialNetworks/Facebook/different.js, but you don't have to worry about collisions!
Then(`I am very happy`, () => {
  expect(fizzbuzz(inputNumber)).to.eq(3)
})
