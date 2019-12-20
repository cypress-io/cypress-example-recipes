# Chrome remote debugging

This example shows you how you can utilize the chrome remote debugger protocol. 

## What you can do with this
Set all pseudo classes and elements, like `:hover`, open Tabs, trigger media queries like `@media print`, and so on. basically all that stuff you can do with your beloved chrome dev console.

## Disadvantages
Currently you can not use it when running your tests in electron. So you have to use `cypress run --headless --browser chrome` to start your tests.

## Explanation
You have to use `ensureRdpPort`  to get the port in the cases where chrome is already started with activated remote debugging.