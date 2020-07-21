/* eslint-env browser */
/* global agGrid */
const columnDefs = [
  { headerName: 'Make', field: 'make', sortable: true },
  { headerName: 'Model', field: 'model', sortable: false },
  { headerName: 'Price', field: 'price', sortable: true },
]

// specify the data
const rowData = [
  { make: 'Toyota', model: 'Celica', price: 35000 },
  { make: 'Ford', model: 'Mondeo', price: 32000 },
  { make: 'Porsche', model: 'Boxter', price: 72000 },
]

// let the grid know which columns and what data to use
const gridOptions = {
  columnDefs,
  rowData,
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  const gridDiv = document.querySelector('#myGrid')

  new agGrid.Grid(gridDiv, gridOptions)
})
