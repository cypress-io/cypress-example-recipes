// requires jQuery to use JSONP
// https://learn.jquery.com/ajax/working-with-jsonp/

/* global document, jQuery */
/* eslint-disable no-console */

function updateFavoriteFruits (contents) {
  if (typeof contents !== 'string') {
    contents = contents.map((item) => `<li>${item}</li>`).join('')
  }

  document.querySelector('.favorite-fruits').innerHTML = contents
}

function getFavoriteFruits () {
  const favFruits = document.querySelector('.favorite-fruits')

  if (!favFruits) {
    return
  }

  favFruits.innerHTML = '<div class="loader"></div>'

  jQuery.ajax({
    url: '/favorite-fruits-jsonp',
    jsonp: 'fruitsCallback',
    dataType: 'jsonp',
    success (fruits) {
      updateFavoriteFruits(fruits)
    },
    error (req, message, err) {
      console.error(message)
      console.error('error for request', req)
      console.error(err)
    },
  })
}

// get the list of fruits on startup
getFavoriteFruits()
