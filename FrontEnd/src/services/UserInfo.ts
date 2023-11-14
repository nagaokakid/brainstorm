import Idea from "../models/Idea";
import {
    userInfoObject,
    chatRoomObject,
    newDirectMessageObject,
    chatRoomMessageObject,
    directMessageObject,
    brainstormDTO,
    user,
} from "../models/TypesDefine";

class UserInfo {

    // The url of the backend
    static BaseURL = "http://localhost:5135/"

    // the object that contains the user info
    static currentUser = {} as user;

    // the list of local ideas
    static localIdeas = [] as string[];

    // the list of ideas from backend
    static ideasList = [] as Idea[];

    // get the user info from session storage
    static getCurrentUser() {
        if (sessionStorage.getItem("currentUser") !== null) {
            this.currentUser = JSON.parse(sessionStorage.getItem("currentUser") ?? "");
        }
        return this.currentUser;
    }

    // get the user info
    static getUserInfo() {
        return this.getCurrentUser().userInfo;
    }

    // get the token
    static getToken() {
        return this.getCurrentUser().token;
    }

    // get the chat room list
    static getChatRoomsList() {
        return this.getCurrentUser().chatRooms;
    }

    // get the direct message list
    static getDirectMessagesList() {
        return this.getCurrentUser().directMessages;
    }

    // get the local ideas
    static getLocalIdeas() {
        if (sessionStorage.getItem("localIdea") !== null) {
            this.localIdeas = JSON.parse(sessionStorage.getItem("localIdea") ?? "");
        }
        return this.localIdeas;
    }

    // get the ideas list
    static getIdeasList() {
        if (sessionStorage.getItem("ideaList") !== null) {
            this.localIdeas = JSON.parse(sessionStorage.getItem("ideaList") ?? "");
        }
        return this.ideasList;
    }


    static getUserId() {
        return this.getUserInfo().userId ?? "";
    }

    static getFirstName() {
        return this.getUserInfo().firstName ?? "";
    }

    static getLastName() {
        return this.getUserInfo().lastName ?? "";
    }

    static getUserName() {
        const temp = this.getUserInfo();
        return temp.firstName + " " + temp.lastName;
    }

    /**
     * Get the chat room information or direct message information
     * @param {*} chatId Can be the chat room id or the to_user_id
     * @param {*} chatType Can be either 'Direct Message List' or 'Chat Room List'
     * @returns 
     */
    static getListHistory(chatId: string, chatType: string) {
        if (chatType === "Direct Message List") {
            console.log("----> Getting direct message history");
            const result = this.getDirectMessagesList().find(chat => chat.user2.userId === chatId);
            return result ? result.directMessages : [];
        }
        else if (chatType === "ChatRoom List") {
            console.log("----> Getting chat room message history");
            const result = this.getChatRoomsList().find(chat => chat.id === chatId);
            return result ? result.messages : [];
        }
        else {
            console.log("----> Invalid chat type");
            return [];
        }
    }

    /**
     * Get the Brainstorm session information
     * @param bsid The brainstorm id
     * @returns The brainstorm session object
     */
    static getBS_Session(bsid: string) {
        let result: brainstormDTO = {
            sessionId: "No Valid Session",
            title: "No Valid Session",
            description: "No Valid Session",
            creator: {
                userId: "",
                firstName: "",
                lastName: ""
            },
            members: [],
        }

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
        console.log("----> Trying to add new member to local.");
        this.getChatRoomsList().forEach(chatRoom => {
            if (chatRoom.id === chatId) {
                chatRoom.members.push(userInfo);
                console.log("----> Added new member.");
            }
        });
    }

    /**
     * Add new chat room to the chat room list
     * @param {*} chatRoom An object that contains the chat room information
     * @returns 
     */
    static addNewChatRoom(chatRoom: chatRoomObject) {
        console.log("----> Trying to add new chat room to local.");
        const list = this.getChatRoomsList();
        if (list.find(current => current.id === chatRoom.id)) {
            alert("Chat room already exists.");
        }
        else {
            console.log("----> Added new chat room.");
            list.push(chatRoom);
        }
    }

    /**
     * Add new direct message to the direct message list
     * @param {*} newDirectMessage An object that contains the from_user, to_user and message information
     * @returns 
     */
    static addNewDirectMessage(newDirectMessage: newDirectMessageObject) {
        let result = null;
        console.log("----> Trying to add new direct message to local.");

        this.getDirectMessagesList().map((current) => {
            if (newDirectMessage.toUserInfo.userId === current.user2.userId || newDirectMessage.fromUserInfo.userId === current.user2.userId) {
                const newMsg =
                {
                    message: newDirectMessage.message,
                    timestamp: newDirectMessage.timestamp
                }
                result = current.directMessages.push(newMsg);
                this.setupUser(true);
                console.log("----> Added incoming direct message to existing direct message list");
            }
        });

        if (result === null) {
            console.log("----> Create a new Direct Message Object");
            const newMsgObject = {
                user1: this.getUserInfo(),
                user2: newDirectMessage.toUserInfo.userId === this.getUserId() ? newDirectMessage.fromUserInfo : newDirectMessage.toUserInfo,
                directMessages: [
                    {
                        message: newDirectMessage.message,
                        timestamp: newDirectMessage.timestamp
                    }
                ]
            }
            console.log("----> Added new direct message to direct message list");
            this.currentUser.directMessages.push(newMsgObject);
            this.setupUser(true);
        }
        else {
            return result;
        }
    }

    /**
     * Add new chat room message to the chat room
     * @param {*} message An object that contains the from_user, chat room id and message information
     * @returns 
     */
    static addChatRoomMessage(message: chatRoomMessageObject) {
        let result = null;
        console.log("----> Trying to add new chat room message to local.");
        this.getChatRoomsList().forEach(chatRoom => {
            if (chatRoom.id === message.chatRoomId) {
                console.log("----> Added new chat room message");
                result = chatRoom.messages.push(message);

                if (message.brainstorm) {

                    if (chatRoom.bs_session) {
                        chatRoom.bs_session?.push(message.brainstorm);
                    } else if (!chatRoom.bs_session) {
                        chatRoom.bs_session = [message.brainstorm];
                    }
                }

                this.setupUser(true);
            }
        });

        return result;
    }

    static addNewIdea(idea: string) {
        this.getLocalIdeas().push(idea);
        sessionStorage.setItem("bs_user", JSON.stringify(this.localIdeas));
    }

    static addLikes(id: string) {
        this.getIdeasList().map(idea => {
            if (idea.id === id) {
                idea.likes = 1;
                idea.dislikes = 0;
            }
        });
        // sessionStorage.setItem("bs_ideaList", JSON.stringify(this.ideasList));
    }

    static addDislikes(id: string) {
        this.getIdeasList().map(idea => {
            if (idea.id === id) {
                idea.likes = 0;
                idea.dislikes = 1;
            }
        });
        // sessionStorage.setItem("bs_ideaList", JSON.stringify(this.ideasList));
    }

    static deleteIdea(position: number) {
        this.getLocalIdeas().splice(position, 1);
        sessionStorage.setItem("bs_user", JSON.stringify(this.localIdeas));
    }

    static clearIdea() {
        this.localIdeas = [];
        sessionStorage.setItem("bs_user", JSON.stringify(this.localIdeas));
    }

    static clearIdeaList() {
        this.ideasList = [];
        sessionStorage.setItem("bs_ideaList", JSON.stringify(this.ideasList));
    }

    /**
     * Check if the user is the host of the brainstorm session
     * @param bsid The brainstorm session id
     * @returns True if the user is the host of the brainstorm session
     */
    static isHost(id: string) {
        return this.getUserId() == id;
    }

    static setupUser(forceUpdate?: boolean) {
        if (sessionStorage.getItem("currentUser") === null) {
            sessionStorage.setItem("currentUser", JSON.stringify(this.currentUser));
        } else if (forceUpdate) {
            sessionStorage.setItem("currentUser", JSON.stringify(this.currentUser));
        }
        this.currentUser = JSON.parse(sessionStorage.getItem("currentUser") ?? "");
    }

    static bsUserSetup() {
        if (sessionStorage.getItem("bs_user") === null) {
            this.localIdeas = [];
            sessionStorage.setItem("bs_user", JSON.stringify(this.localIdeas));
        }
        this.localIdeas = JSON.parse(sessionStorage.getItem("bs_user") ?? "");

        if (sessionStorage.getItem("bs_ideaList") === null) {
            this.ideasList = [];
            sessionStorage.setItem("bs_ideaList", JSON.stringify(this.ideasList));
        }
        this.ideasList = JSON.parse(sessionStorage.getItem("bs_ideaList") ?? "");
    }

    static updateUserInfo() {
        this.setupUser(true);
    }
}

export default UserInfo;