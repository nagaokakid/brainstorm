

describe('Testing Main Page (Logged In User)', () => 
{
    const username: string = 'string';
    const password: string = 'string';
    const chatRoomTitle: string = 'ChatRoom List';
    const directMessageTitle: string = 'Direct Message List';
    
    // login as user "string" before each test
    beforeEach(() => 
    {
        cy.visit('http://localhost:4000/');
        cy.get('.nav-link.active').should('be.visible');
        cy.contains('Login').should('exist').click();
        cy.get('.tab-pane.fade.show.active').find('#Username').type(username);
        cy.get('.tab-pane.fade.show.active').find('#Password').type(password);
        cy.get('#login').click();
    })

    it('view all chat rooms', () => 
    {
        cy.get('.navigation-bar').find('.nav-button').contains('Chat Rooms').click();
        cy.get('.ChatListTitle').should('exist').contains(chatRoomTitle);
        cy.get('.search-bar').should('exist');
        cy.get('.CreateChatRoomButton').should('exist');
        cy.get('.chats').should('exist');
    })

    it('view all direct messages', () => 
    {
        cy.get('.navigation-bar').find('.nav-button').contains('Direct Message').click();
        cy.get('.ChatListTitle').should('exist').contains(directMessageTitle);
        cy.get('.search-bar').should('exist');
        cy.get('.CreateChatRoomButton').should('be.hidden');
        cy.get('.chats').should('exist');
    })

})