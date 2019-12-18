describe("Test", () => {
    beforeEach(() => {
        cy.visit("index.html");
    })
    it("Printable div is not visible normally", () => {
        cy.get("#printable").should("not.be.visible");
    })
    it("Printable div is visible with 'print' media query", () => {
        cy.task("activatePrintMediaQuery");
        cy.get("#printable").should("be.visible");
    })
    it("Hover pseudo element is inactive normally", () => {
        cy.get("#pseudo-hover span").should("not.be.visible");
    })
    it("Hover pseudo element is active", () => {
        cy.task("activateHoverPseudo", { selector: "#pseudo-hover" });
        cy.get("#pseudo-hover span").should("be.visible");
    })
})