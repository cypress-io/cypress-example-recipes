/* global document */
/* eslint-disable no-console */
document.querySelector('[data-cy=download-csv-href]').addEventListener('click', () => {
  console.log('about to download CSV file')
  document.location.href = 'records.csv'
})

document.querySelector('[data-cy=download-pdf-href]').addEventListener('click', () => {
  console.log('about to download PDF file')
  document.location.href = 'why-cypress.pdf'
})
