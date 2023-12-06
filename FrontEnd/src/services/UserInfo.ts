import Idea from "../models/Idea";
import {
    userInfoObject,
    chatRoomObject,
    newDirectMessageObject,
    chatRoomMessageObject,
    brainstormDTO,
    user,
} from "../models/TypesDefine";

/*
 * UserInfo.ts
    * -----------------------------
    * This file is the service for the user info.
    * ----------------------------------------------------------
    * Author:  Mr. Yee Tsuung (Jackson) Kao and Mr. Roland Fehr
    * Date Created:  01/12/2023
    * Last Modified: 01/12/2023
    * Version: 0.0.1
*/

class UserInfo {
    

    // The url of the backend
    static BaseURL = "http://localhost:5135/"

    // the object that contains the user info
    static currentUser = {} as user;
    

    // the list of local ideas
    static localIdeas = [] as string[];

    // the list of ideas from backend
    static ideasList = [] as Idea[];

    /**
     * Set the user info to the user object
     * @param user The user object that contains the user info
     */
    static setCurrentUser(user: user) {
        this.currentUser = user;
    }

    // static setUsername() {
    //     if (sessionStorage.getItem("username") === null) {
    //         sessionStorage.setItem("username", this.getUserName());
    //     }
    // }

    /**
     * Set the user first name to the user info
     * @param newFirstName the new first name
     */
    static setFirstName(newFirstName: string) {
        const result = this.getCurrentUser();
        if (result) {
            result.userInfo.firstName = newFirstName;
        }
        this.updateUser(true);
    }

    /**
     * Set the last name to the user info
     * @param newLastName the new last name
     */
    static setLastName(newLastName: string) {
        const result = this.getCurrentUser();
        if (result) {
            result.userInfo.lastName = newLastName;
        }
        this.updateUser(true);
    }

    /**
     * Set the ideas list to the session storage
     * @param ideas The ideas list
     */
    static setLocalIdeas(ideas: string[]) {
        this.localIdeas = ideas;
    }

    /**
     * Set the ideas list to the session storage
     * @param ideas The ideas list
     */
    static setIdeasList(ideas: Idea[]) {
        this.ideasList = ideas;
    }

    static setToken() {
        if (sessionStorage.getItem("token") === null) {
            sessionStorage.setItem("token", this.getToken());
        }
    }

    /**
     * Get the user info from session storage
     * @returns The user object that contains the user info
     */
    static getCurrentUser() {
        if (sessionStorage.getItem("currentUser") !== null) {
            this.currentUser = JSON.parse(sessionStorage.getItem("currentUser") ?? "");
        }
        return this.currentUser;
    }

    /**
     * Get the user info from the user object
     * @returns The user info object
     */
    static getUserInfo() {
        return this.getCurrentUser().userInfo;
    }

    /**
     * Get the token from the user object
     * @returns The token
     */
    static getToken() {
        return this.getCurrentUser().token;
    }

    /**
     * Get the chat room list from the user object
     * @returns The chat room list
     */
    static getChatRoomsList() {
        if (this.getCurrentUser().chatRooms === null) {
            this.getCurrentUser().chatRooms = [];
            this.updateUser(true);
        }
        return this.getCurrentUser().chatRooms;
    }

    /**
     * Get the chat room info from the chat room list
     * @param chatRoomId The chat room id
     * @returns 
     */
    static getChatRoomInfo(chatRoomId: string) {
        return this.getChatRoomsList().find(chatRoom => chatRoom.id === chatRoomId);
    }

    /**
     * Get the chat room info from the chat room list
     * @param code The join code
     * @returns 
     */
    static getChatRoomByCode(code: string) {
        return this.getChatRoomsList().find(chatRoom => chatRoom.joinCode === code);
    }

    /**
     * Get the chat room member list
     * @param chatRoomId The chat room id
     * @returns The member list
     */
    static getMemberList(chatRoomId: string) {
        return this.getChatRoomsList().find(chatRoom => chatRoom.id === chatRoomId)?.members ?? [];
    }

    /**
     * Get the direct message list from the user object
     * @returns The direct message list
     */
    static getDirectMessagesList() {
        if (this.getCurrentUser().directMessages === null) {
            this.getCurrentUser().directMessages = [];
            this.updateUser(true);
        }
        return this.getCurrentUser().directMessages;
    }

    /**
     * Get the local ideas list from the session storage
     * @returns The local ideas list
     */
    static getLocalIdeas() {
        if (sessionStorage.getItem("localIdea") !== null) {
            this.localIdeas = JSON.parse(sessionStorage.getItem("localIdea") ?? "");
        }
        return this.localIdeas;
    }

    /**
     * Get the ideas list from the session storage
     * @returns The ideas list
     */
    static getIdeasList() {
        if (sessionStorage.getItem("ideaList") !== null) {
            this.localIdeas = JSON.parse(sessionStorage.getItem("ideaList") ?? "");
        }
        return this.ideasList;
    }

    /**
     * Get the user id from the user info object
     * @returns The user id
     */
    static getUserId() {
        return this.getUserInfo().userId;
    }

    /**
     * Get the first name from the user info object
     * @returns The first name
     */
    static getFirstName() {
        return this.getUserInfo().firstName;
    }

    /**
     * Get the last name from the user info object
     * @returns The last name
     */
    static getLastName() {
        return this.getUserInfo().lastName;
    }

    /**
     * Get the user name from the user info object
     * @returns The user name
     */
    static getUserName() {
        const temp = this.getUserInfo();
        return temp.firstName + " " + temp.lastName;
    }

    /**
     * Get the message history from the direct message list or the chat room list
     * @param {*} chatId Can be the chat room id or the to_user_id
     * @param {*} chatType Can be either 'Direct Message List' or 'Chat Room List'
     * @returns 
     */
    static getMessageHistory(chatId: string, chatType: string) {
        if (chatType === "Direct Message List") { // Search the direct message list
            return this.getDirectMessagesList().find(chat => (chat.user2.userId === chatId || chat.user1.userId === chatId))?.directMessages ?? [];
        } else if (chatType === "ChatRoom List") { // Search the chat room list
            return this.getChatRoomsList().find(chat => chat.id === chatId)?.messages ?? [];
        } else {
            return [];
        }
    }

    /**
     * Get the Brainstorm session information
     * @param bsid The brainstorm id
     * @returns The brainstorm session object
     */
    static getBS_Session(bsid: string) {
        let result = {} as brainstormDTO;

        this.getChatRoomsList().map(chatRoom => {
            chatRoom.bs_session?.map(bs => {
                if (bs.sessionId === bsid) {
                    result = bs;
                }
            });
        });

        return result;
    }

    /**
     * Add new member info to the chat room
     * @param {*} userInfo User information object
     * @param {*} chatId The chat room id
     */
    static addNewMember(userInfo: userInfoObject, chatId: string) {
        this.getChatRoomsList().find(chatRoom => chatRoom.id === chatId)?.members.push(userInfo);
        this.updateUser(true);
    }

    /**
     * Add new chat room to the chat room list
     * @param {*} chatRoom An object that contains the chat room information
     * @returns 
     */
    static addNewChatRoom(chatRoom: chatRoomObject) {
        const list = this.getChatRoomsList();
        if (list.find(current => current.id === chatRoom.id)) {
            alert("Chat room already exists.");
        } else {
            list.push(chatRoom);
        }
        this.updateUser(true);
    }

    /**
     * Add new direct message to the direct message list
     * @param {*} newDirectMessage An object that contains the from_user, to_user and message information
     * @returns 
     */
    static addNewDirectMessage(newDirectMessage: newDirectMessageObject) {
        if (newDirectMessage.fromUserInfo.userId === this.getUserId()) { // If the message is sent by the current user, return
            const result = this.getDirectMessagesList().find(current => (newDirectMessage.toUserInfo.userId === current.user1.userId || newDirectMessage.toUserInfo.userId === current.user2.userId));
            if (result) {
                result.directMessages.push({
                    fromUserId: newDirectMessage.fromUserInfo.userId,
                    messageId: newDirectMessage.messageId,
                    message: newDirectMessage.message,
                    timestamp: newDirectMessage.timestamp
                });
            } else {
                const newMsgObject = {
                    user1: this.getUserInfo(),
                    user2: newDirectMessage.toUserInfo.userId === this.getUserId() ? newDirectMessage.fromUserInfo : newDirectMessage.toUserInfo,
                    directMessages: [
                        {
                            fromUserId: newDirectMessage.fromUserInfo.userId,
                            messageId: newDirectMessage.messageId,
                            message: newDirectMessage.message,
                            timestamp: newDirectMessage.timestamp
                        }
                    ],
                }
                this.getDirectMessagesList().push(newMsgObject);
            }
        } else if (newDirectMessage.toUserInfo.userId === this.getUserId()) { // If the message is sent to the current user, add the message to the direct message list
            const result = this.getDirectMessagesList().find(current => (newDirectMessage.fromUserInfo.userId === current.user1.userId || newDirectMessage.fromUserInfo.userId === current.user2.userId));
            if (result) {
                result.directMessages.push({
                    fromUserId: newDirectMessage.fromUserInfo.userId,
                    messageId: newDirectMessage.messageId,
                    message: newDirectMessage.message,
                    timestamp: newDirectMessage.timestamp
                });
            } else {
                const newMsgObject = {
                    user1: newDirectMessage.fromUserInfo,
                    user2: this.getUserInfo(),
                    directMessages: [
                        {
                            fromUserId: newDirectMessage.fromUserInfo.userId,
                            messageId: newDirectMessage.messageId,
                            message: newDirectMessage.message,
                            timestamp: newDirectMessage.timestamp
                        }
                    ],
                }
                this.getDirectMessagesList().push(newMsgObject);
            }
        }
        this.updateUser(true);
    }

    /**
     * Add new chat room message to the chat room
     * @param {*} message An object that contains the from_user, chat room id and message information
     * @returns 
     */
    static addChatRoomMessage(message: chatRoomMessageObject) {
        const result = this.getChatRoomsList().find(chatRoom => chatRoom.id === message.chatRoomId);

        if (result) { // If there is a chat room that contains the chat room id, add the new message to the chat room
            result.messages.push(message);

            if (message.brainstorm) { // If the message contains a brainstorm session, add the brainstorm session to the chat room

                if (result.bs_session) { // If the chat room already has a brainstorm session, add the new brainstorm session to the chat room
                    result.bs_session?.push(message.brainstorm);
                } else if (!result.bs_session) { // If the chat room does not have a brainstorm session, create a new brainstorm session
                    result.bs_session = [message.brainstorm];
                }
            }

            this.updateUser(true);
        }
    }

    /**
     * Add new idea to the local idea list
     * @param idea The idea to be added
     */
    static addNewIdea(idea: string) {
        this.getLocalIdeas().push(idea);
        this.updateLocalIdea(true);
    }

    /**
     * Add likes to idea
     * @param id The idea id
     */
    static addLikes(id: string) {
        const result = this.getIdeasList().find(idea => idea.id === id);
        if (result) {
            result.likes = 1;
            result.dislikes = 0;
        }
        this.updateIdeaList(true);
    }

    /**
     * Add dislikes to idea
     * @param id The idea id
     */
    static addDislikes(id: string) {
        const result = this.getIdeasList().find(idea => idea.id === id);
        if (result) {
            result.likes = 0;
            result.dislikes = 1;
        }
        this.updateIdeaList(true);
    }

    /**
     * Remove a specific idea from the local idea list
     * @param position The position of the idea in the local idea list
     */
    static deleteIdea(position: number) {
        this.getLocalIdeas().splice(position, 1);
        this.updateLocalIdea(true);
    }

    static deleteChatRoomMessage(chatRoomId:string, messageId: string) {
        const result = this.getChatRoomsList().find(chatRoom => chatRoom.id === chatRoomId);
        if (result) {
            result.messages.splice(result.messages.findIndex(current => current.messageId === messageId), 1);
        }
        this.updateUser(true);
    }

    static deleteChatRoomMessageBySessionId(chatRoomId:string , sessionId: string) {
        const result = this.getChatRoomsList().find(chatRoom => chatRoom.id === chatRoomId);
        if (result) {
            result.messages.splice(result.messages.findIndex(current => current.brainstorm?.sessionId === sessionId), 1);
        }
        this.updateUser(true);
    }

    static leaveChatRoom(chatRoomId:string) {
        const index = this.getChatRoomsList().findIndex(chatRoom => chatRoom.id === chatRoomId);
        if (index >= 0) {
            this.getChatRoomsList().splice(index, 1);
        }
        this.updateUser(true);
    }

    static deleteDirectMessage(toId: string, id: string) {
        const result = this.getDirectMessagesList().find(current => (toId === current.user1.userId || toId === current.user2.userId));
        if (result) {
            result.directMessages.splice(result.directMessages.findIndex(current => current.messageId === id), 1);
        }
        this.updateUser(true);
    }

    /**
     * Empty the local idea list
     */
    static clearIdea() {
        this.localIdeas = [];
        this.updateLocalIdea(true);
    }

    /**
     * Empty the idea list
     */
    static clearIdeaList() {
        this.ideasList = [];
        this.updateIdeaList(true);
    }

    /**
     * Empty the user info
     */
    static clearAccount() {
        this.currentUser = {} as user;
        sessionStorage.removeItem("currentUser");
    }

    /**
     * Check if the user is the host of the brainstorm session
     * @param bsid The brainstorm session id
     * @returns True if the user is the host of the brainstorm session
     */
    static isHost(id: string) {
        return this.getUserId() === id;
    }

    /**
     * Check store user info in the session storage
     * @param forceUpdate Force update the user info
     */
    static updateUser(forceUpdate?: boolean) {
        if (sessionStorage.getItem("currentUser") === null) {
            sessionStorage.setItem("currentUser", JSON.stringify(this.currentUser));
        } else if (forceUpdate) {
            sessionStorage.setItem("currentUser", JSON.stringify(this.currentUser));
        }
        this.setCurrentUser(JSON.parse(sessionStorage.getItem("currentUser") ?? ""));
    }

    /**
     * Check store idea list in the session storage
     * @param forceUpdate Force update the idea list
     */
    static updateLocalIdea(forceUpdate?: boolean) {
        if (sessionStorage.getItem("localIdea") === null) {
            sessionStorage.setItem("localIdea", JSON.stringify(this.localIdeas));
        } else if (forceUpdate) {
            sessionStorage.setItem("localIdea", JSON.stringify(this.localIdeas));
        }
        this.setLocalIdeas(JSON.parse(sessionStorage.getItem("localIdea") ?? ""));
    }

    /**
     * Check store idea list in the session storage
     * @param forceUpdate Force update the idea list
     */
    static updateIdeaList(forceUpdate?: boolean) {
        if (sessionStorage.getItem("ideaList") === null) {
            sessionStorage.setItem("ideaList", JSON.stringify(this.ideasList));
        } else if (forceUpdate) {
            sessionStorage.setItem("ideaList", JSON.stringify(this.ideasList));
        }
        this.setIdeasList(JSON.parse(sessionStorage.getItem("ideaList") ?? ""));
    }

    /**
     * Update the chat room info
     * @param chatRoomId the chat room id
     * @param chatRoomTitle the chat room title
     * @param chatRoomDescription the chat room description
     */
    static updateChatRoom(chatRoomId: string, chatRoomTitle: string, chatRoomDescription: string) {
        const result = this.getChatRoomsList().find(chatRoom => chatRoom.id === chatRoomId);
        if (result) {
            result.title = chatRoomTitle;
            result.description = chatRoomDescription;
        }
        this.updateUser(true);
    }
}

export default UserInfo;