/* 
This is for simulating acceptance testing for the login/register page:
- successful register
- successful login
- failed register (username already taken, passwords don't match, or form is empty)
- failed login (password is incorrect OR username doesn't exist in db)
*/

describe("Testing Login/Register Page", () => 
{
    
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

    // Test 2: attempt registry of existing user
    it('fail to register an existing user account', () => 
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

    // Test 3: attempt registry with non-matching passwords
    it('fail to register with non-matching passwords', () => 
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

    // Test 4: attempt registry with empty form
    it('fail to register with an empty form', () => 
    {
        cy.contains('Register').should('exist').click()     // click "Register" button
        cy.get('.tab-pane.fade.show.active').invoke('show').should('be.visible');
        cy.get('#register').should('be.visible').click();   // click "Sign Up" button
        cy.on('window:alert', (alertMsg) => 
        {
            expect(alertMsg).to.equal("Please complete the form")     // verify alert message
        })
    })
    
    // Test 5: login with existing user account
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

    // Test 6: try login with incorrect password for an existing user
    it('fail to login with incorrect password', () => 
    {
        cy.get('.nav-link.active').should('be.visible');
        cy.contains('Login').should('exist').click();
    
        cy.get('.tab-pane.fade.show.active').find('#Username').type('cypress');
        cy.get('.tab-pane.fade.show.active').find('#Password').type('notThePassword'); // incorrect password
    
        cy.intercept('POST', '/api/users/login').as('fetchRequest'); // setup intercept for http responses
    
        cy.get('#login').click();       // click "Sign In" button
        cy.wait('@fetchRequest').then((interception) => 
        {
            expect(interception.response.statusCode).to.equal(401);     // verify response code
        })
        cy.on('window:alert', (alertMsg) => 
        {
            expect(alertMsg).to.equal("Login credentials are invalid. Please ensure the username and password are correct.")     // verify alert message
        })
    })

    // Test 7: try login with invalid username
    it('fail to login with invalid username', () => 
    {
        cy.get('.nav-link.active').should('be.visible');
        cy.contains('Login').should('exist').click();
    
        cy.get('.tab-pane.fade.show.active').find('#Username').type('notAValidUsername');   // invalid username
        cy.get('.tab-pane.fade.show.active').find('#Password').type('whatPassword?');
    
        cy.intercept('POST', '/api/users/login').as('fetchRequest'); // setup intercept for http responses
    
        cy.get('#login').click();       // click "Sign In" button
        cy.wait('@fetchRequest').then((interception) => 
        {
            expect(interception.response.statusCode).to.equal(401);     // verify response code
        })
        cy.on('window:alert', (alertMsg) => 
        {
            expect(alertMsg).to.equal("Login credentials are invalid. Please ensure the username and password are correct.")     // verify alert message
        })
    })
        


}) // end