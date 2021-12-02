/// <reference types="cypress" />
// import dayjs in a single spec that needs it
const dayjs = require('dayjs')

// in our example we parse UTC date, thus we need the UTC plugin
// https://day.js.org/docs/en/plugin/utc
const utc = require('dayjs/plugin/utc')
// we also need to know if a timestamp is between two other timestamps
// https://day.js.org/docs/en/query/is-between
const isBetween = require('dayjs/plugin/isBetween')
// we will parse a few time strings
// https://day.js.org/docs/en/plugin/custom-parse-format
const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(utc)
dayjs.extend(isBetween)
dayjs.extend(customParseFormat)

describe('dayjs example', () => {
  it('has the current date', () => {
    cy.visit('index.html')
    const todaysDate = dayjs().format('MMM DD, YYYY')

    cy.contains('span', `Order shipped on: ${todaysDate}`)
  })

  it('parses UTC', () => {
    const time = dayjs.utc('2014-04-25T19:38:53.196Z').format('h:mm A')

    expect(time, 'formatted time').to.equal('7:38 PM')
  })

  it('has the posted time', () => {
    cy.visit('index.html')

    cy.get('.posted').contains('3:38 PM')
    .should('have.class', 'badge')

    // parse American time like "3:38 PM"
    const format = 'h:mm A'

    const start = dayjs('3:00 PM', format)
    const end = dayjs('5:00 PM', format)

    expect(start.isValid(), 'start date is valid').to.be.true
    expect(end.isValid(), 'end date is valid').to.be.true

    cy.get('.posted .badge')
    .should(($el) => {
      // the time in the element should be between 3pm and 5pm

      const posted = $el.text().trim()
      const m = dayjs(posted, format)

      expect(m.isValid(), 'posted date was parsed').to.be.true

      const message = `${posted} should be between ${start.format(format)} and ${end.format(format)}`

      expect(m.isBetween(start, end), message).to.be.true
    })
  })
})
