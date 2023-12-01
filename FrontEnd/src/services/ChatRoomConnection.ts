import * as signalR from "@microsoft/signalr";
import UserInfo from "./UserInfo";
import { chatRoomMessageObject, chatRoomObject, userInfoObject } from "../models/TypesDefine";
import Idea from "../models/Idea";

/**
 * This is the URL for the SignalR chatroom Hub
 */
const DIRECT_URL = UserInfo.BaseURL + "chatroom";

class SignalRChatRoom {

    private static instance: SignalRChatRoom | null;
    private connection: signalR.HubConnection;

    /**
     * This is the connection to the SignalR chatroom Hub
     */
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(DIRECT_URL)
            .withAutomaticReconnect()
            .build();
    }

    /**
     * This will reset the connection to the chat room
     */
    async reset() {
        this.removeCallBack();
        await this.connection.stop();
        SignalRChatRoom.instance = null;
    }

    /**
     * This is the function that actually makes the connection
     */
    async makeConnection() {
        await this.connection.start();
    }

    /**
     * Set a callback function that will be called when a chat room message is received
     * @param {*} callBackFunction A function that will be called when a chat room message is received
     */
    setReceiveChatRoomMessageCallback(callBackFunction: (bsid: string | undefined, msg: chatRoomMessageObject, timer?: number) => void) {
        this.connection.on("ReceiveChatRoomMessage", (msg: chatRoomMessageObject, timer?: number) => {
            UserInfo.addChatRoomMessage(msg);
            console.log(msg);
            
            if (msg.brainstorm && msg.brainstorm.creator.userId === UserInfo.getUserId()) {
                callBackFunction(msg.brainstorm.sessionId, msg, timer);
            } else {
                callBackFunction(undefined, msg);
            }
        });
    }

    /**
     * Set a callback function that will be called when a chat room info is received
     * @param {*} callBackFunction A function that will be called when a chat room info is received
     */
    setReceiveChatRoomInfoCallback(callBackFunction: () => void) {
        this.connection.on("ReceiveChatRoomInfo", (info: chatRoomObject) => {
            UserInfo.addNewChatRoom(info);
            callBackFunction();
        });
    }

    /**
     * Set a callback function that will be called when a new member joins the chat room
     * @param callBackFunction A function that will be called when a new member joins the chat room
     */
    setReceiveNewMemberCallback(callBackFunction: () => void) {
        this.connection.on("NewMemberJoined", (userInfo: userInfoObject, chatId: string) => {
            UserInfo.addNewMember(userInfo, chatId);
            callBackFunction();
        });
    }

    /**
     * Set a callback function that will be called when a new member joins the brainstorm session
     * @param callBackFunction A function that will be called when a new member joins the brainstorm session
     */
    setUserJoinedBrainstormSessionCallback(callBackFunction: (sessionId: string, userId: string, count: number, timer: number) => void) {
        this.connection.on("UserJoinedBrainstormingSession", (sessionId: string, userId: string, count: number, timer: number) => {
            // new user joined brainstorming session
            callBackFunction(sessionId, userId, count, timer);
        });
    }

    /**
     * Set a callback function that will be called when a new member want to join a brainstorm session that has already started
     * @param callBackFunction A function that will be called when a new member want to join a brainstorm session that has already started
     */
    setBrainstormSessionAlreadyStartedErrorCallback(callBackFunction: (sessionId: string) => void) {
        this.connection.on("SessionStartedNotAllowedToJoin", (sessionId: string) => {

            // brainstorm session has already started
            callBackFunction(sessionId);
        });
    }

    /**
     * Set a callback function that will be called when the host start the session
     * @param callBackFunction A function that will be called when the host start the session
     */
    setBrainstormSessionStartedCallback(callBackFunction: (sessionId: string, seconds: number) => void) {
        this.connection.on("BrainstormSessionStarted", (sessionId: string, seconds: number) => {

            // brainstorm session started
            callBackFunction(sessionId, seconds);
        });
    }

    /**
     * Set a callback function that will be called when the host end the session
     * @param callBackFunction A function that will be called when the host end the session
     */
    setBrainstormSessionEndedCallback(callBackFunction: (sessionId: string) => void) {
        this.connection.on("BrainstormSessionEnded", (sessionId: string) => {

            // brainstorm session ended
            callBackFunction(sessionId);
        });
    }

    /**
     * Set a callback function that will be called when the backend send all ideas
     * @param callBackFunction A function that will be called when the backend send all ideas
     */
    setReceiveAllIdeasCallback(callBackFunction: (sessionId: string, ideas: Idea[]) => void) {
        this.connection.on("ReceiveAllIdeas", (sessionId: string, ideas: Idea[]) => {
            // remove null elements from array
            const ideasNew: Idea[] = [];
            ideas.forEach(x=>{
                if(x) ideasNew.push(x)
            })
        
            // receive all ideas from brainstorm session
            callBackFunction(sessionId, ideasNew);
        });
    }

    /**
     * Set a callback function that will be called when the backend send all ideas result
     * @param callBackFunction A function that will be called when the backend send all ideas result
     */
    setReceiveVoteResultsCallback(callBackFunction: (sessionId: string, ideas: Idea[]) => void) {
        this.connection.on("ReceiveVoteResults", (sessionId: string, ideas: Idea[]) => {
            const sort = ideas.sort(x=>x.dislikes).sort(x=>x.likes)
            // receive the voting results
            callBackFunction(sessionId, sort);
        });
    }

    /**
     * Set a callback function that will be called when the host ask all clients to send their votes
     * @param callBackFunction A function that will be called when the host ask all clients to send their votes
     */
    setSendVotesCallback(callBackFunction: (ideas: Idea[]) => void) {
        this.connection.on("SendVotes", (ideas: Idea[]) => {

            // instruction to send all votes
            callBackFunction(ideas);
        });
    }

    /**
     * Send a message to the backend from chat room
     * @param {*} msg A message object that will be sent to the backend
     */
    async sendChatRoomMessage(msg: chatRoomMessageObject) {
        await this.connection.send("SendChatRoomMessage", msg.fromUserInfo.userId, msg.chatRoomId, msg.fromUserInfo.firstName, msg.fromUserInfo.lastName, msg.message)
            .catch(() => console.log("----> Unable to send chat room message."));
    }

    /**
     * Build the connection to the chat room
     * @param {*} joinCode The join code of the chat room
     * @param {*} type The type of the chat room
     */
    async joinChatRoom(joinCode: string, type: string) {
        await this.connection.send("JoinChatRoom", joinCode, type, UserInfo.getUserId(), UserInfo.getFirstName(), UserInfo.getLastName())
            .catch(() => {
                console.log("----> Join chatroom failed");
            });
    }

    /**
     * Send a request to the backend to create a new brainstorm session
     * @param title The brainstorm session title
     * @param description The brainstorm session description
     * @param chatRoomId The chat room id
     */
    async createBrainstormSession(title: string, description: string, chatRoomId: string, timer: string) {
        const result = await this.connection.send("CreateBrainstormSession", title, description, chatRoomId, UserInfo.getUserId(), UserInfo.getFirstName(), UserInfo.getLastName(), timer).then(() => {
            console.log("----> Create brainstorm session success");
            return true;
        }).catch(() => {
            console.log("----> Create brainstorm session failed");
            return false;
        });

        return result;
    }

    /**
     * Send a request to the backend to join a brainstorm session
     * @param sessionId The brainstorm session id
     */
    async joinBrainstormSession(sessionId: string) {
        console.log("----> Join brainstorm session");
        
        await this.connection.send("JoinBrainstormSession", sessionId, UserInfo.getUserId(), UserInfo.getFirstName(), UserInfo.getLastName()).catch(() => {
            console.log("----> Join brainstorm session failed");
        });
    }

    /**
     * Send a request to the backend to start a brainstorm session
     * @param sessionId The brainstorm session id
     */
    async startSession(sessionId: string, timer: number) {
        console.log("----> Start brainstorm session", sessionId, timer);
        
        await this.connection.send("StartSession", sessionId, timer)
    }

    /**
     * Send a request to the backend to end a brainstorm session
     * @param sessionId The brainstorm session id
     */
    async endSession(sessionId: string) {
        await this.connection.send("EndSession", sessionId)
    }


    async voteAnotherRound(sessionId: string){
        await this.connection.send("VoteAnotherRound", sessionId)
    }

    /**
     * Send a request to the backend to along with the ideas
     * @param sessionId The brainstorm session id
     * @param ideas The ideas
     */
    async sendAllIdeas(sessionId: string, ideas: string[]) {
        await this.connection.send("ReceiveAllIdeas", sessionId, ideas)
    }

    /**
     * Send a request to the backend remove the brainstorm session
     * @param sessionId The brainstorm session id
     */
    async removeSession(sessionId: string) {
        await this.connection.send("RemoveSession", sessionId, UserInfo.getUserInfo())
    }

    /**
     * Send a request to the backend to along with the votes
     * @param sessionId The brainstorm session id
     * @param votes The votes
     */
    async sendVotes(sessionId: string, votes: Idea[]) {
        await this.connection.send("ReceiveVotes", sessionId, votes)
    }

    async removeUserFromBrainstormSession(sessionId: string){
        await this.connection.send("RemoveUserFromSession", sessionId, UserInfo.getUserId())
    }

    /**
     * Send a request to the backend to ask all clients to send their votes
     * @param sessionId The brainstorm session id
     */
    async clientsShouldSendAllVotes(sessionId: string) {
        await this.connection.send("SendAllVotes", sessionId)
    }

    async removeChatRoomMessage(chatroomId: string, messageId: string){
        await this.connection.send("RemoveChatRoomMessage", chatroomId, messageId)
    }

    setRemoveChatRoomMessageCallback(callBackFunction: (chatRoomId: string, messageId: string) => void) {
        this.connection.on("RemoveChatRoomMessage", (chatRoomId: string, messageId: string) => {
            console.log("callback remove message: " + chatRoomId + " " + messageId);
            
            // remove message from chatroom
            callBackFunction(chatRoomId, messageId);
        });
    }

    /**
     * Remove all the call back functions
     */
    removeCallBack() {
        this.connection.off("NewMemberJoined");
        this.connection.off("ReceiveChatRoomMessage");
        this.connection.off("ReceiveChatRoomInfo");
        this.connection.off("UserJoinedBrainstormingSession");
        this.connection.off("SessionStartedNotAllowedToJoin");
    }

    /**
     * Remove all the brainstorm session call back functions
     */
    removeBSCallBack() {
        this.connection.off("BrainstormSessionStarted");
        this.connection.off("BrainstormSessionEnded");
        this.connection.off("ReceiveAllIdeas");
        this.connection.off("ReceiveVoteResults");
        this.connection.off("SendVotes");
    }

    /**
     * Get the instance of the SignalRChatRoom
     * @returns The instance of the SignalRChatRoom
     */
    static async getInstance() {
        if (SignalRChatRoom.instance == null) {
            SignalRChatRoom.instance = new SignalRChatRoom();
            await SignalRChatRoom.instance.makeConnection();
        }

        return SignalRChatRoom.instance;
    }
}

export default SignalRChatRoom;