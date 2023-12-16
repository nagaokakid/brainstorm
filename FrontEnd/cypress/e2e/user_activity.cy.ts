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
    const foreignJoinCode: string = "134585";
    const foreignChatRoomTitle = "foreign room";
    var newChatRoomTitle: string;
    var newChatRoomDescription: string;

    const navBar = '.navigation-bar-container'
    const navBtn = ".navBtn"
    const createChatRoomIcon = '.create-chat-room-icon'

    function generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters.charAt(randomIndex);
        }
      
        return randomString;
    }

    function goToChatRooms() { cy.get(navBar).find(navBtn).eq(0).click(); }
    function goToDirectMessages() { cy.get(navBar).find(navBtn).eq(1).click(); }
    
    // login as existing user before each test
    beforeEach(() => 
    {
        cy.visit('http://localhost:4000/');
        cy.get('.nav-link.active').should('be.visible');
        cy.contains('Login').should('exist').click();
        cy.get('.tab-pane.fade.show.active').find('#username').type(username);
        cy.get('.tab-pane.fade.show.active').find('#password').type(password);
        cy.get('#login').click();
    })

    // Create chat room test
    it('create a new chat room', () => 
    {
        goToChatRooms();
        cy.get(createChatRoomIcon).click()

        newChatRoomTitle = generateRandomString(10);     // unique title and desc
        newChatRoomDescription = generateRandomString(20);
        cy.get('#CreateChatRoomForm').find('#chatRoomName').type(newChatRoomTitle);
        cy.get('#CreateChatRoomForm').find('#description').type(newChatRoomDescription);

        cy.intercept('POST', '/api/chatroom').as('response');
        cy.get('.create-room-content-container').find('#SubmitButton').click();  // create chat room
        cy.wait('@response').then((interception) => 
        {
            expect(interception.response.statusCode).to.equal(200);     // verify response code
        })

        cy.wait(3000);

        goToChatRooms();
        
        // verify new chat room exists in chat list
        cy.get('.list-container').find('.list-item').last().within(() => {
            cy.get('.item-title').should('have.text', newChatRoomTitle);
            cy.get('.last-message').should('have.text', newChatRoomDescription);
        });
    })

    // Send chat room message test
    it('send a message in a chat room', () => 
    {
        goToChatRooms();
        cy.get('.list-container').find('.list-item').last().click();
        let msg = generateRandomString(10);
        cy.get('.msg-input-container').find('[placeholder="Enter Message here..."]').type(msg);
        cy.get('.msg-input-send').click(); // send msg
        goToChatRooms();
        cy.get('.list-container').find('.list-item').last().click();
        cy.wait(1500);

        // verify message is present in chat window
        cy.get('.msg-window-container').find('.message-box-container').last().within(() => 
        {
            cy.get('.message-box').find('p').should('have.text', msg);
        })
    })

    // Join chat room test
    it('join a chat room via 6-digit code', () =>
    {
        cy.wait(3000);
        cy.get('#JoinCodeForm').type(foreignJoinCode);
        cy.get('.join-code-button').click();  // join foreign chat room
        cy.wait(2000);
        goToChatRooms();
        cy.get('.list-container').find('.list-item').contains('.item-title', foreignChatRoomTitle);
    })

    // Edit a chat room test
    it("edit a chat room's title and description", () => 
    {
        // pull up the edit chat room window
        cy.get('.list-container')
            .find('.list-item')
            .invoke('show')
            .find('.item-detail')
            .contains('.item-title', newChatRoomTitle)
            .parent().parent()
            .find('div[style="display: flex;"]')
            .find('.edit-chat-room-button')
            .invoke('show')
            .click();

        // set up intercept for expected API response
        cy.intercept('PUT', '/api/chatroom').as('response');

        // edit title and desc
        cy.get('.edit-chat-room-form').find('#ChatRoomTitle').clear().type('editedTitle');
        cy.get('.edit-chat-room-form').find('#ChatRoomDescription').clear().type('editedDescription');
        cy.get('.save-edit-chat-room-button').click();

        // verify correct API response
        cy.wait('@response').then((interception) => 
        {
            expect(interception.response.statusCode).to.equal(200);
        })

        goToChatRooms();
        cy.get('.list-container').find('.list-item').contains('.item-title', 'editedTitle').should('exist');
    })

    // Send direct message test
    it('send a direct message to chat room member via chat room', () => 
    {
        var msg = generateRandomString(10);

        // send direct message
        goToChatRooms();
        cy.get('.list-container').find('.list-item').contains('.item-title', foreignChatRoomTitle).click();
        cy.get('.chat-member-list-container')
            .find('.members-list')
            .find('ul.members')
            .find('.user-profile-name')
            .contains('cypress2')
            .parent().parent()
            .then(member => {
                cy.wrap(member).click();
                cy.wrap(member).find('.dm-input-form').type(msg);
                cy.wait(1000);
                cy.wrap(member).find('button').click();
            });

        // check direct message list
        goToDirectMessages();
        
        cy.get('.list-container').find('.list-item').contains('.item-title', 'cypress2').click();
        var lastMsg = cy.get('#MsgSection').children().last();
        lastMsg.find('.message-box').find('p').should('have.text', msg);
    })

    // Leave a chat room test
    it('leave a chat room', () => 
    {
        var prevCount = 0;
        cy.intercept('DELETE', '/api/chatroom').as('response');

        cy.get('.list-container').children().then(children => {
            prevCount = children.length;
        
            // leave the chat room
            cy.get('.list-container')
                .find('.list-item')
                .contains('.item-title', foreignChatRoomTitle)
                .parent()
                .parent()
                .find('div[style="display: flex;"]')
                .find('.edit-chat-room-button')
                .invoke('show')
                .click();
            cy.get('.edit-chat-room-window').find('.leave-chat-room-button').click();
            
            // wait to ensure previous commands are complete
            cy.wait(3000);

            // verify API response
            cy.wait('@response').then((interception) => 
            {
                expect(interception.response.statusCode).to.equal(200);
            })
        
            goToChatRooms();
        
            // verify new count
            cy.get('.list-container').children().should('have.length', prevCount - 1);
        })
    })

    // Send direct message in pre-existing direct message window test
    it('send a direct message to another user via pre-existing direct message window', () => 
    {
        goToDirectMessages();
        cy.get('.list-container').children().first().click();
        let msg = generateRandomString(10);
        cy.get('.msg-input-container').find('[placeholder="Enter Message here..."]').type(msg);
        cy.get('.msg-input-send').click(); // send msg
        cy.wait(1000);
        cy.get('.msg-window-container').find('.msg-section').find('.message-box').contains(msg).should('exist');
    })

    // Brainstorm session features test
    it('create a brainstorm session, input ideas, vote, and leave the session', () =>
    {
        // create brainstorm session
        goToChatRooms();
        cy.get('.list-container').children().first().click();
        cy.get('.chat-header').find('a').contains('Create Brainstorm Session').click();

        // fill out session info
        cy.get('.create-bs-form').then((BSform) => {
            cy.wrap(BSform).find('#BSname').type('test session');
            cy.wrap(BSform).find('#BSdescription').type('for cypress e2e');
            cy.wrap(BSform).find('#BStimer').type('15');
        })

        // create session
        cy.get('#createBs').click();
        
        // start session and add 4 ideas
        cy.url().should('contain', '/BrainStorm');
        cy.get('.start-session-button').click();
        var input = cy.get('.input-section');
        var sendBtn = cy.get('.send-section');
        input.type('idea 1');
        sendBtn.click();
        input.type('idea 2');   // check for this idea after voting ends
        sendBtn.click();
        input.type('idea 3');
        sendBtn.click();
        input.type('idea 4');
        sendBtn.click();

        // Delete one of the ideas
        cy.get('.local-ideas-container').find('.Idea').first().find('.local-idea-delete-button').click();
        cy.get('.end-session-button').click();
        cy.get('.online-ideas-container').children().should('have.length', 3);

        // Vote on each idea differently
        cy.get('.online-ideas-container').find('.idea-box').each(($element, index) => {
            // var currIdeaButton = cy.wrap($element).find('.IdeaButton');
            var likeBtn = cy.wrap($element).find('.like-idea');
            var dislikeBtn = cy.wrap($element).find('.dislike-idea');
            
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
        cy.get('.end-vote-button').first().click();
        cy.get('.online-ideas-container').children().should('have.length', 1);
        cy.get('.online-ideas-container').find('.idea-result-box').find('.idea-thought').should('contain', 'idea 2');
        cy.get('.leave-session-button').click();
        cy.url().should('contain', '/main');
    })

    // View chat rooms test
    it('view all chat rooms', () => 
    {
        goToChatRooms();
        cy.get(createChatRoomIcon).should('exist');
        cy.get('.chat-room-header').should('contain', "Chat Rooms");
        cy.get('.list-container').children().should('have.length.gt', 0);
    })

    // View direct messages test
    it('view all direct messages', () => 
    {
        goToDirectMessages();
        cy.get('.direct-message-header').should('contain', "Direct Messages");
        cy.get('.list-container').children().should('have.length.gt', 0);
    })



}) // end