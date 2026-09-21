/* global window */
// A small JavaScript file for the download recipe to download.
//
// The page links to it through the second static server on port 9000, which
// stands in for "a different domain", exactly like the remote CSV, XLSX, PNG,
// TXT, ZIP and PDF links above it. Serving it ourselves keeps the recipe
// self-contained instead of depending on a third-party file staying reachable.
//
// The spec only checks that the downloaded file has more than 20 lines,
// so the contents below are deliberately ordinary.

const greetings = ['hello', 'hi', 'howdy', 'hey there']

// pick a random entry from a list
const pick = (list) => list[Math.floor(Math.random() * list.length)]

// "howdy, world!"
const greet = (name) => `${pick(greetings)}, ${name}!`

// "HOWDY, WORLD!"
const shout = (message) => String(message).toUpperCase()

// "Howdy, world!"
const capitalize = (message) => {
  const text = String(message)

  return text.charAt(0).toUpperCase() + text.slice(1)
}

// how many words are in the message?
const countWords = (message) => String(message).trim().split(/\s+/).filter(Boolean).length

window.recipeDemo = {
  greet,
  shout,
  capitalize,
  countWords,
}
