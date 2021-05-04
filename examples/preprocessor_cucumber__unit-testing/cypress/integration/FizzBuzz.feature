Feature: FizzBuzz BDD

  I want to start a FizzBuzz game

  Scenario: the number 3 should fizz
    Given I try with 3    
    Then the output shall be fizz

Scenario: the number 5 should buzz
    Given I try with 5
    Then the output shall be: 'buzz'


