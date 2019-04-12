/// <reference types="Cypress" />

context('Assertions', () => {
    describe("navbar-test", () => {
        it('.it should display the correct name', () => {
            cy.visit('/').contains("Chromstahl");
        });
    });
});
