/* eslint-env browser */
/* global $ */
$(document).ready(function () {
  $('.js-example-basic-single').select2()
  $('.js-example-basic-multiple').select2()
  $('.js-example-remote-data').select2({
    placeholder: 'Pick a user',
    ajax: {
      url: 'https://jsonplaceholder.cypress.io/users',
      dataType: 'json',
      delay: 250,
      processResults (data) {
        return {
          results: $.map(data, function (item) {
            return {
              text: item.name,
              id: item.id,
            }
          }),
        }
      },
    },
  })
})
