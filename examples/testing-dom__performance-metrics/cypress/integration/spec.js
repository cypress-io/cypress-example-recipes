describe('Check some performance metrics', () => {
  it('check page load time', () => {
    cy.visit('/index.html', {
      onBeforeLoad: win => {
        win.performance.mark("start-loading")
      },
      onLoad: win => {
        win.performance.mark("end-loading")
      }
    }).its("performance").then(p => {
      p.measure("pageLoad", "start-loading", "end-loading")
      const measure = p.getEntriesByName("pageLoad")[0]
      assert.isAtMost(measure.duration, 1000)
    })
  })

  it('check image load time', () => {
    cy.visit('/index.html').its('performance').then(p => {
      const img = p.getEntriesByType('resource').filter(x => x.name.indexOf('performance-example.png'))[0]
      assert.isAtMost(img.duration, 400)
    })
  })

  it('ensure max load time for images', () => {
    cy.visit('/index.html').its('performance').then(p => {
      const imgs = p.getEntriesByType('resource').filter(x => x.initiatorType === 'img')
      const slowestImg = imgs.reduce((p, c) => c.duration > p.duration ? c : p, { duration: 0 })
      assert.isAtMost(slowestImg.duration, 400, `image '${slowestImg.name}' should be loaded in reasonable time`)
    })
  })

  it('ensure that no image failed to load', () => {
    cy.visit('/index.html');
    cy.get('img').each(img => expect(img[0].naturalWidth).to.not.equal(0))
  })
})