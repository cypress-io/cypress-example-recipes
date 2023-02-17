/// <reference types="cypress" />

// use https://github.com/abdolence/x2js to parse XML to JSON
const X2JS = require('x2js')
const x2js = new X2JS()

describe('XML assertions', () => {
  it('returns the right object', () => {
    cy.request('http://localhost:6055/xml-os').then((res) => {
      expect(res.headers, 'responds with XML')
      .to.have.property('content-type', 'text/xml; charset=utf-8')

      expect(res.body, 'body is XML string').to.be.a('string')

      const result = x2js.xml2js(res.body)

      expect(result, 'has data property').to.have.property('data')

      // confirm the entire response object
      expect(result.data).to.deep.equal({
        query: {
          vendor: 'redhat',
          name: 'linux',
        },
        _id: '12344556',
        _type: 'product',
      })
    })
  })
})
