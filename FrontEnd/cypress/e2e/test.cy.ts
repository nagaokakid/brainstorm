/* 
This is for simulating acceptance testing for the login/register page:
- test register
- test login
- test failed register (username already taken OR passwords don't match)
- test failed login (password is incorrect OR username doesn't exist in db)
*/

describe("Testing Login/Register Page of Brainstorm App", () => {
    
    // navigate to home page before each test
    beforeEach(() => {
        cy.visit('http://localhost:4000/');
    })

    // Register a new user
    it('register a new user', () => {
        const timestamp: number = Date.now();
        const timestampStr: string = timestamp.toString();

        cy.contains('Register').should('exist').click()     // click "Register" button

        cy.get('.tab-pane.fade.show.active').invoke('show').should('be.visible');   // fill out form
        cy.get('.tab-pane.fade.show.active').find('#Username').type(timestampStr)
        cy.get('#FirstName').should('be.visible').type(timestampStr);
        cy.get('#LastName').should('be.visible').type(timestampStr);
        cy.get('.tab-pane.fade.show.active').find('#Password').type(timestampStr)
        cy.get('#RePassword').should('be.visible').type(timestampStr);

        cy.get('#register').should('be.visible').click();   // click "Sign Up" button
    })

    // Attempt registry of existing user; expect 400 error response
    it('try to register an existing user account', () => {
        cy.contains('Register').should('exist').click()     // click "Register" button

        cy.get('.tab-pane.fade.show.active').invoke('show').should('be.visible');   // fill out form
        cy.get('.tab-pane.fade.show.active').find('#Username').type('cypress')
        cy.get('#FirstName').should('be.visible').type('cypress');
        cy.get('#LastName').should('be.visible').type('cypress');
        cy.get('.tab-pane.fade.show.active').find('#Password').type('cypress')
        cy.get('#RePassword').should('be.visible').type('cypress');

        cy.get('#register').should('be.visible').click();   // click "Sign Up" button
    })


})