# Clipboard
> Copy / paste text example

The widget to copy text is `@github/clipboard-copy-element` custom element that comes from [github/github-elements](https://github.com/github/github-elements)

![Copy / paste test](./images/copy-paste.gif)

See the [cypress/integration/spec.js](./cypress/integration/spec.js) file.

The page [index.html](./index.html) shows the copy button on "mouseover" event. When the text is copied to the clipboard, it shows a [tiny toast](https://github.com/bahmutov/tiny-toast) popup.
