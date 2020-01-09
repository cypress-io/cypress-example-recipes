# Chrome remote debugging

This example shows you how you can utilize the chrome remote debugger protocol.

## What you can do with this
Set all pseudo classes and elements, like `:hover`, open Tabs, trigger media queries like `@media print`, and so on. basically all that stuff you can do with your beloved chrome dev console.

## Disadvantages
Currently you can not use it when running your tests in electron. So you have to use `cypress run --headless --browser chrome` to start your tests.

## Explanation
You have to use `ensureRdpPort`  to get the port in the cases where chrome is already started with activated remote debugging.

**Reset state**

If you have more than one test in one spec file you should ensure a clean state before each run. See the example `reset to clean state` suite. If you remove `task("resetCRI")` this suite will fail because it requires that the print media query is not set. But it was set in a previous test. A page reload will not reset the CRI! You have to call `clint.close()` in order to reset everything that has been done with the CRI. If you have your tests in different spec files, this also works because for every spec file a new browser window is opened.

## Debugging

Run with `DEBUG=cypress:server:protocol` to see connection messages
