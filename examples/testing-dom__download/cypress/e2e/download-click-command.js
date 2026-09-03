// add this to your cypress commands.js file:

/**
 * When we download a file with a button click, Cypress expects a page reload. This causes our tests to fail even when the
 * file is downloaded successfully. This helper fudges a page reload so that Cypress doesn't fail the test.
 */
Cypress.Commands.add('downloadClick', (callBack, timeout = 5000) => {
	cy.window().then((win) => {
		win.document.addEventListener('click', () => {
			setTimeout(() => {
				win.document.location.reload();
			}, timeout);
		});
		
		callBack();
	});
})

// and then in your test you can use it like so:
cy.downloadClick(() => {
	cy.get('.your-download-button').click()
}, 3000) // passing in the timeout is optional
