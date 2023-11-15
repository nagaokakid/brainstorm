/* 
This is for simulating acceptance testing for the login/register page:
- test register
- test login
- test failed register (username already taken OR passwords don't match)
- test failed login (password is incorrect OR username doesn't exist in db)
*/

describe("Testing Login/Register Page of Brainstorm App", () => {
    
    // navigate to home page before each test
    beforeEach(() => 
    {
        cy.visit('http://localhost:4000/');
    })

    // Test 1: register a new user (timestamp ensures username is unique every time it runs)
    it('register a new user', () => 
    {
        const runTestCondition = Cypress.env('RUN_CONDITIONAL_TEST');

        if (runTestCondition === 'true')
        {
            const timestamp: number = Date.now();
            const timestampStr: string = timestamp.toString();
    
            cy.contains('Register').should('exist').click()     // click "Register" button
    
            cy.get('.tab-pane.fade.show.active').invoke('show').should('be.visible');   // fill out form
            cy.get('.tab-pane.fade.show.active').find('#Username').type(timestampStr)
            cy.get('#FirstName').should('be.visible').type(timestampStr);
            cy.get('#LastName').should('be.visible').type(timestampStr);
            cy.get('.tab-pane.fade.show.active').find('#Password').type(timestampStr)
            cy.get('#RePassword').should('be.visible').type(timestampStr);
    
            cy.intercept('POST', '/api/users').as('fetchRequest'); // setup intercept for http response
    
            cy.get('#register').should('be.visible').click();   // click "Sign Up" button
            cy.wait('@fetchRequest').then((interception) => 
            {
                expect(interception.response.statusCode).to.equal(201);     // verify response code
            });
            cy.url().should('include', '/main')     // verify URL change
            cy.wait(3000);  // wait 3 seconds to see main page
        }
        else 
        {
            cy.log("Skipping registry of new user to avoid flooding database")
        }
        
    })

    // Test 2: attempt registry of existing user; expect 400 error response
    it('try to register an existing user account', () => 
    {
        cy.contains('Register').should('exist').click()     // click "Register" button

        cy.get('.tab-pane.fade.show.active').invoke('show').should('be.visible');   // fill out form
        cy.get('.tab-pane.fade.show.active').find('#Username').type('cypress')
        cy.get('#FirstName').should('be.visible').type('cypress');
        cy.get('#LastName').should('be.visible').type('cypress');
        cy.get('.tab-pane.fade.show.active').find('#Password').type('cypress')
        cy.get('#RePassword').should('be.visible').type('cypress');

        cy.intercept('POST', '/api/users').as('fetchRequest'); // setup intercept for http response

        cy.get('#register').should('be.visible').click();   // click "Sign Up" button

        cy.wait('@fetchRequest').then((interception) => 
        {
            expect(interception.response.statusCode).to.equal(400);     // verify response code
        });
        
        cy.on('window:alert', (alertMsg) => 
        {
            expect(alertMsg).to.equal("Failed to create account")   // verify alert message
        })
    })

    // Test 3: attempt registry with non-matching passwords; expect alert message
    it('try to register with non-matching passwords', () => 
    {
        cy.contains('Register').should('exist').click()     // click "Register" button

        cy.get('.tab-pane.fade.show.active').invoke('show').should('be.visible');   // fill out form
        cy.get('.tab-pane.fade.show.active').find('#Username').type('test')
        cy.get('#FirstName').should('be.visible').type('test');
        cy.get('#LastName').should('be.visible').type('test');
        cy.get('.tab-pane.fade.show.active').find('#Password').type('p1')       // different passwords given
        cy.get('#RePassword').should('be.visible').type('p2');

        cy.get('#register').should('be.visible').click();   // click "Sign Up" button

        cy.on('window:alert', (alertMsg) => 
        {
            expect(alertMsg).to.equal("Passwords do not match")     // verify alert message
        })
    })

    // Test 4: login with existing user account
    it('login with existing user account', () => 
    {
        cy.get('.nav-link.active').should('be.visible');
        cy.contains('Login').should('exist').click();

        cy.get('.tab-pane.fade.show.active').find('#Username').type('cypress');     // fill in login credentials
        cy.get('.tab-pane.fade.show.active').find('#Password').type('cypress');

        cy.intercept('POST', '/api/users/login').as('fetchRequest1'); // setup intercepts for http responses
        cy.intercept('POST', '/chatroom/*').as('fetchRequest2');
        cy.intercept('POST', '/direct/*').as('fetchRequest3'); 

        cy.get('#login').click();       // click "Sign In" button
        cy.wait(['@fetchRequest1', '@fetchRequest2', '@fetchRequest3']).then(([interception1, interception2, interception3]) => 
        {
            expect(interception1.response.statusCode).to.equal(200);     // verify response codes
            expect(interception2.response.statusCode).to.equal(200); 
            expect(interception3.response.statusCode).to.equal(200); 
        });

        cy.url().should('include', '/main')     // verify URL change
    })





})