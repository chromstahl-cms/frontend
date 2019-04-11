/// <reference types="Cypress" />

context('Assertions', () => {
    describe("router-test", () => {
        it('.should route to login', () => {
            cy.visit('/').get('.loginIcon').click().get('h1').should("have.text", "Log in");
        });

        it('.it should navigate back to home from login', () => {
            cy.visit('/login').get('#target > div:nth-child(2) > div > a:nth-child(1) > h2').click().get('#blogMount');
        });

        it('.it should navigate to register from login', () => {
            cy.visit('/login').get('.register-link').click().get('span').contains('Register');
        });

        it('.it should navigate to login from register', () => {
            cy.visit('/register').get('.login-link').click().get('span').contains('Login');
        });
    });
});
