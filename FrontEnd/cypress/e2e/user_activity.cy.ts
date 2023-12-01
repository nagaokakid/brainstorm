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
    const username: string = 'cypress';
    const password: string = 'cypress';
    const foreignJoinCode: string = "461250";
    const foreignChatRoomTitle = "Movies";
    var newChatRoomTitle: string;
    var newChatRoomDescription: string;

    function generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters.charAt(randomIndex);
        }
      
        return randomString;
    }
    
    // login as existing user before each test
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
        cy.get('.CreateChatRoomButton').should('exist');
        cy.get('.chat-list').find('.chats').children().should('have.length.gt', 0);
    })

    // Test 2
    it('view all direct messages', () => 
    {
        cy.get('.navigation-bar').find('.nav-button').contains('Direct Message').click();
        cy.get('.CreateChatRoomButton').should('be.hidden');
        cy.get('.chat-list').find('.chats').children().should('have.length.gt', 0);
    })

    // Test 3
    it('create a new chat room', () => 
    {
        cy.get('.navigation-bar').find('.nav-button').contains('Chat Rooms').click();
        cy.get('.CreateChatRoomButton').click();

        newChatRoomTitle = generateRandomString(10);     // unique title and desc
        newChatRoomDescription = generateRandomString(20);
        cy.get('.WindowSectionContent').find('#chatRoomName').type(newChatRoomTitle);
        cy.get('.WindowSectionContent').find('#description').type(newChatRoomDescription);

        cy.intercept('POST', '/api/chatroom').as('response');
        cy.get('.WindowSectionContent').find('.submitButton').click();  // create chat room
        cy.wait('@response').then((interception) => 
        {
            expect(interception.response.statusCode).to.equal(200);     // verify response code
        })

        cy.wait(3000);
        
        // verify new chat room exists in chat list
        cy.get('.chat-list').find('.chats').find('.chat-item').last().then(($lastChild) => {
            cy.wrap($lastChild).find('.chat-details').find('.chat-title').invoke('text').should('eq', newChatRoomTitle);
            cy.wrap($lastChild).find('.chat-details').find('.last-message').invoke('text').should('eq', newChatRoomDescription);
        });
    })

    // Test 4
    it('send a message in a chat room', () => 
    {
        cy.get('.navigation-bar').find('.nav-button').contains('Chat Rooms').click();
        cy.get('.chats').find('.chat-title').contains(newChatRoomTitle).click();
        let msg = generateRandomString(10);
        cy.get('.MsgInputContainer').find('[placeholder="Enter Message here..."]').type(msg);
        cy.get('.send').click(); // send msg

        // verify message is present in chat window
        cy.get('.MsgWindowContainer').find('.MsgSection').find('.MessageContainer').last().then(($lastChild) => 
        {
            cy.wrap($lastChild).find('p').contains(msg).should('exist');
        })
    })

    // Test 5
    it('join a chat room via 6-digit code', () =>
    {
        cy.get('.JoinCodeInput').type(foreignJoinCode);
        cy.get('.JoinCodeButton').click();
    })

    // Test 6
    it('send a direct message to chat room member via chat room', () => 
    {
        // send direct message (user must manually fill in prompt)
        cy.get('.navigation-bar').find('.nav-button').contains('Chat Rooms').click();
        cy.get('.chats').find('.chat-title').contains('Movies').click();
        cy.get('.MemberListContainer').find('li').contains('string').click();
        cy.log('back from prompt...now checking direct message');

        // check direct message list
        cy.get('.navigation-bar').find('.nav-button').contains('Direct Message').click();
        let target = cy.get('.chats').find('.chat-item').find('.chat-title:contains("string")').should('exist');
        target.click();
        cy.get('.MsgSection').find('.MsgWindowContainer').find('.MsgSection').children().should('have.length.gt', 0);
    })

    // Test 7
    it('send a direct message to another user via pre-existing direct message window', () => 
    {
        cy.get('.navigation-bar').find('.nav-button').contains('Direct Message').click();
        cy.get('.chats').find('.chat-item').find('.chat-title').first().click();
        let msg = generateRandomString(10);
        cy.get('.MsgInputContainer').find('[placeholder="Enter Message here..."]').type(msg);
        cy.get('.send').click(); // send msg
        cy.get('.MsgWindowContainer').find('.MsgSection').find('.MessageContainer').contains(msg).should('exist');
    })

    // Test 8
    it('create a brainstorm session, input ideas, vote, and leave the session', () =>
    {
        // create brainstorm session
        cy.get('.navigation-bar').find('.nav-button').contains('Chat Rooms').click();
        cy.get('.chats').find('.chat-item').find('.chat-title').first().click();
        cy.get('.ChatHeader').find('a').contains('Create BrainStorm Session').click();
        var bsInfo = cy.get('.BSinfoWindow');
        bsInfo.get('#BSname').type('test session');
        bsInfo.get('#BSdescription').type('for cypress e2e');
        bsInfo.get('#BStimer').type('10');
        bsInfo.get('#createBs').click();
        
        // start session and add 4 ideas
        cy.url().should('contain', '/BrainStorm');
        cy.get('.StartSessionButton').click();
        var input = cy.get('.InputSection');
        var sendBtn = cy.get('.SendSection');
        input.type('idea 1');
        sendBtn.click();
        input.type('idea 2');   // check for this idea after voting ends
        sendBtn.click();
        input.type('idea 3');
        sendBtn.click();
        input.type('idea 4');
        sendBtn.click();

        // Delete one of the ideas
        cy.get('.LocalIdeasContainer').find('.Idea').first().find('.DeleteButton').click();
        cy.get('.EndSessionButton').click();
        cy.get('.OnlineIdeasContainer').children().should('have.length', 3);

        // Vote on each idea differently
        cy.get('.OnlineIdeasContainer').find('.IdeaBox').each(($element, index) => {
            // var currIdeaButton = cy.wrap($element).find('.IdeaButton');
            var likeBtn = cy.wrap($element).find('.LikeIdea');
            var dislikeBtn = cy.wrap($element).find('.DislikeIdea');
            
            if (index === 0)    // Like first idea twice (but should register as 1 like vote)
            {
                likeBtn.click();
                likeBtn.click();
            }
            if (index === 1)    // Dislike the second idea twice (but should register as 1 dislike vote)
            {
                dislikeBtn.click();
                dislikeBtn.click();
            }
            if (index === 3)    // Like and dislike third idea
            {
                dislikeBtn.click();
                likeBtn.click();
                likeBtn.click();
                likeBtn.click();
            }
        })

        // End voting and verify the results
        cy.get('.EndVoteButton').click();
        cy.get('.OnlineIdeasContainer').children().should('have.length', 1);
        cy.get('.OnlineIdeasContainer').find('.IdeaResultBox').find('.IdeaThought').should('contain', 'idea 2');
        cy.get('.ExitButton').click();
        cy.get('.YesBtn').click();
        cy.url().should('contain', '/main');
    })



}) // end