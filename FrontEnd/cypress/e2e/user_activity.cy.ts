/* 
This is for simulating acceptance testing for the main page when a user is logged in:
- view chat list
- view direct message list
- create a chat room
- send a chat message
- send a direct message (new and existing)
- join a new chat room by code
- create a brainstorm session
- join a brainstorm session
- add ideas in a brainstorm session
- vote on ideas at the end of a round in brainstorm session
- leave the brainstorm session
*/

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

    // Test 1
    it('view all chat rooms', () => 
    {
        cy.get('.navigation-bar').find('.nav-button').contains('Chat Rooms').click();
        cy.get('.ChatListTitle').should('exist').contains(chatRoomTitle);
        cy.get('.search-bar').should('exist');
        cy.get('.CreateChatRoomButton').should('exist');
        cy.get('.chats').should('exist');
    })

    // Test 2
    it('view all direct messages', () => 
    {
        cy.get('.navigation-bar').find('.nav-button').contains('Direct Message').click();
        cy.get('.ChatListTitle').should('exist').contains(directMessageTitle);
        cy.get('.search-bar').should('exist');
        cy.get('.CreateChatRoomButton').should('be.hidden');
        cy.get('.chats').should('exist');
    })

    // Test 3
    it('create a new chat room', () => 
    {
        cy.get('.navigation-bar').find('.nav-button').contains('Chat Rooms').click();
        cy.get('.CreateChatRoomButton').click();
        cy.get('.WindowSectionContent').find('#chatRoomName').type('Cypress Chat Room');
        cy.get('.WindowSectionContent').find('#description').type('What do you know about e2e testing?');
        cy.get('.WindowSectionContent').find('.submitButton').click();
    })

    // Test 4
    it('send a message in a chat room', () => 
    {
        cy.get('.navigation-bar').find('.nav-button').contains('Chat Rooms').click();
        cy.get('.chats').find('.chat-title').contains('Cypress Chat Room').click();
        cy.get('.MsgInputContainer').find('[placeholder="Enter Message here..."]').type('cypress message');
        cy.get('.send').click();
    })

})