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

    function generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters.charAt(randomIndex);
        }
      
        return randomString;
    }

    function goToChatRooms() { cy.get('.NavBar').find('.NavBtn').eq(0).click(); }
    function goToDirectMessages() { cy.get('.NavBar').find('.NavBtn').eq(1).click(); }
    
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

    // Create chat room test
    it('create a new chat room', () => 
    {
        goToChatRooms();
        cy.get('.CreateChatRoomIcon').click()

        newChatRoomTitle = generateRandomString(10);     // unique title and desc
        newChatRoomDescription = generateRandomString(20);
        cy.get('.WindowSectionContent').find('#chatRoomName').type(newChatRoomTitle);
        cy.get('.WindowSectionContent').find('#description').type(newChatRoomDescription);

        cy.intercept('POST', '/api/chatroom').as('response');
        cy.get('.WindowSectionContent').find('.SubmitButton').click();  // create chat room
        cy.wait('@response').then((interception) => 
        {
            expect(interception.response.statusCode).to.equal(200);     // verify response code
        })

        cy.wait(3000);

        goToChatRooms();
        
        // verify new chat room exists in chat list
        cy.get('.ListContainer').find('.ListItem').last().within(() => {
            cy.get('.ItemTitle').should('have.text', newChatRoomTitle);
            cy.get('.LastMessage').should('have.text', newChatRoomDescription);
        });
    })

    // Send chat room message test
    it('send a message in a chat room', () => 
    {
        goToChatRooms();
        cy.get('.ListContainer').find('.ListItem').last().click();
        let msg = generateRandomString(10);
        cy.get('.MsgInputContainer').find('[placeholder="Enter Message here..."]').type(msg);
        cy.get('.Send').click(); // send msg
        goToChatRooms();
        cy.get('.ListContainer').find('.ListItem').last().click();
        cy.wait(1500);

        // verify message is present in chat window
        cy.get('.MessageContainer').find('.MessageWrapper').last().within(() => 
        {
            cy.get('.Message').find('p').should('have.text', msg);
        })
    })

    // Join chat room test
    it('join a chat room via 6-digit code', () =>
    {
        cy.wait(3000);
        cy.get('#JoinCodeForm').type(foreignJoinCode);
        cy.get('.JoinCodeButton').click();  // join foreign chat room
        cy.wait(2000);
        goToChatRooms();
        cy.get('.ListContainer').find('.ListItem').contains('.ItemTitle', foreignChatRoomTitle);
    })

    // Edit a chat room test
    it("edit a chat room's title and description", () => 
    {
        // pull up the edit chat room window
        cy.get('.ListContainer').find('.ListItem').contains('.ItemTitle', newChatRoomTitle).parent().parent().find('div[style="display: flex;"]').find('.EditChatRoomButton').invoke('show').click();

        // set up intercept for expected API response
        cy.intercept('PUT', '/api/chatroom').as('response');

        // edit title and desc
        cy.get('.EditChatRoomForm').find('#ChatRoomTitle').clear().type('editedTitle');
        cy.get('.EditChatRoomForm').find('#ChatRoomDescription').clear().type('editedDescription');
        cy.get('.SaveEditChatRoomButton').click();

        // verify correct API response
        cy.wait('@response').then((interception) => 
        {
            expect(interception.response.statusCode).to.equal(200);
        })

        goToChatRooms();
        cy.get('.ListContainer').find('.ListItem').contains('.ItemTitle', 'editedTitle').should('exist');
    })

    // Send direct message test
    it('send a direct message to chat room member via chat room', () => 
    {
        var msg = generateRandomString(10);

        // send direct message
        goToChatRooms();
        cy.get('.ListContainer').find('.ListItem').contains('.ItemTitle', foreignChatRoomTitle).click();
        cy.get('.ChatMemberList')
            .find('.MembersList')
            .find('ul.Members')
            .find('.UserProfileName')
            .contains('cypress2')
            .parent().parent()
            .then(member => {
                cy.wrap(member).click();
                cy.wrap(member).find('.DMInputForm').type(msg);
                cy.wait(1000);
                cy.wrap(member).find('button').click();
            });

        // check direct message list
        goToDirectMessages();
        
        cy.get('.ListContainer').find('.ListItem').contains('.ItemTitle', 'cypress2').click();
        var lastMsg = cy.get('#MsgSection').children().last();
        lastMsg.find('.Message').find('p').should('have.text', msg);
    })

    // Leave a chat room test
    it('leave a chat room', () => 
    {
        var prevCount = 0;
        cy.intercept('DELETE', '/api/chatroom').as('response');

        cy.get('.ListContainer').children().then(children => {
            prevCount = children.length;
        
            // leave the chat room
            cy.get('.ListContainer')
                .find('.ListItem')
                .contains('.ItemTitle', foreignChatRoomTitle)
                .parent()
                .parent()
                .find('div[style="display: flex;"]')
                .find('.EditChatRoomButton')
                .invoke('show')
                .click();
            cy.get('.EditChatRoomButtonsContainer').find('.LeaveChatRoomButton').click();
            
            // wait to ensure previous commands are complete
            cy.wait(3000);

            // verify API response
            cy.wait('@response').then((interception) => 
            {
                expect(interception.response.statusCode).to.equal(200);
            })
        
            goToChatRooms();
        
            // verify new count
            cy.get('.ListContainer').children().should('have.length', prevCount - 1);
        })
    })

    // Send direct message in pre-existing direct message window test
    it('send a direct message to another user via pre-existing direct message window', () => 
    {
        goToDirectMessages();
        cy.get('.ListContainer').children().first().click();
        let msg = generateRandomString(10);
        cy.get('.MsgInputContainer').find('[placeholder="Enter Message here..."]').type(msg);
        cy.get('.Send').click(); // send msg
        cy.wait(1000);
        cy.get('.MsgWindowContainer').find('.MsgSection').find('.MessageContainer').contains(msg).should('exist');
    })

    // Brainstorm session features test
    it('create a brainstorm session, input ideas, vote, and leave the session', () =>
    {
        // create brainstorm session
        goToChatRooms();
        cy.get('.ListContainer').children().first().click();
        cy.get('.ChatHeader').find('a').contains('Create Brainstorm Session').click();

        // fill out session info
        cy.get('.CreateBSForm').then((BSform) => {
            cy.wrap(BSform).find('#BSname').type('test session');
            cy.wrap(BSform).find('#BSdescription').type('for cypress e2e');
            cy.wrap(BSform).find('#BStimer').type('15');
        })

        // create session
        cy.get('.BSinfoWindow').find('.CreateBtn').click();
        
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
        cy.get('.EndVoteButton').first().click();
        cy.get('.OnlineIdeasContainer').children().should('have.length', 1);
        cy.get('.OnlineIdeasContainer').find('.IdeaResultBox').find('.IdeaThought').should('contain', 'idea 2');
        cy.get('.LeaveSessionButton').click();
        cy.url().should('contain', '/main');
    })

    // View chat rooms test
    it('view all chat rooms', () => 
    {
        goToChatRooms();
        cy.get('.CreateChatRoomIcon').should('exist');
        cy.get('.ChatRoomHeader').should('contain', "Chat Rooms");
        cy.get('.ListContainer').children().should('have.length.gt', 0);
    })

    // View direct messages test
    it('view all direct messages', () => 
    {
        goToDirectMessages();
        cy.get('.DirectMessageHeader').should('contain', "Direct Messages");
        cy.get('.ListContainer').children().should('have.length.gt', 0);
    })



}) // end