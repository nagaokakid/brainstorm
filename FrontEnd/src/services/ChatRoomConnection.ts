import * as signalR from "@microsoft/signalr";
import UserInfo from "./UserInfo";
import { chatRoomMessageObject, chatRoomObject, userInfoObject } from "./TypesDefine";
import FriendlyUser from "../models/FriendlyUser";

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

    async reset() {
        await this.connection.stop();
        SignalRChatRoom.instance = null;
    }

    /**
     * This is the function that actually makes the connection
     */
    async makeConnection() {
        console.log("----> Starting connection to chatroom services");
        await this.connection.start();
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
     * Set a callback function that will be called when a chat room message is received
     * @param {*} callBackFunction A function that will be called when a chat room message is received
     */
    setReceiveChatRoomMessageCallback(callBackFunction: () => void) {
        this.connection.on("ReceiveChatRoomMessage", (msg: chatRoomMessageObject) => {
            UserInfo.addChatRoomMessage(msg);
            callBackFunction();
        });
    }

    /**
     * Set a callback function that will be called when a chat room info is received
     * @param {*} callBackFunction A function that will be called when a chat room info is received
     */
    setReceiveChatRoomInfoCallback(callBackFunction: () => void) {
        this.connection.on("ReceiveChatRoomInfo", (info: chatRoomObject) => {
            console.log("----> Receive chatroom info callback", info);
            UserInfo.addNewChatRoom(info);
            callBackFunction();
        });
    }

    /**
     * Send a message to the backend from chat room
     * @param {*} msg A message object that will be sent to the backend
     */
    async sendChatRoomMessage(msg: chatRoomMessageObject) {
        console.log("----> Sending chatroom message", msg);
        console.log("----> Connection state ", this.connection.state);
        await this.connection.send("SendChatRoomMessage", msg.fromUserInfo.userId, msg.chatRoomId, msg.fromUserInfo.firstName, msg.fromUserInfo.lastName, msg.message)
            .catch(() => console.log("----> Unable to send chat room message."));
    }

    /**
     * Build the connection to the chat room
     * @param {*} joinCode The join code of the chat room
     * @param {*} type The type of the chat room
     */
    async joinChatRoom(joinCode: string, type: string) {
        console.log("----> Joining chatroom:", joinCode);
        await this.connection.send("JoinChatRoom", joinCode, type, UserInfo.getUserId(), UserInfo.getFirstName(), UserInfo.getLastName())
            .catch(() => {
                console.log("----> Join chatroom failed");
                alert("Join chatroom failed");
            });
    }

    async createBrainstormSession(title: string, description: string, chatRoomId: string) {
        await this.connection.send("CreateBrainstormSession", title, description, chatRoomId, UserInfo.getUserId(), UserInfo.getFirstName(), UserInfo.getLastName())
    }

    async joinBrainstormSession(sessionId: string) {
        await this.connection.send("JoinBrainstormSession", sessionId, UserInfo.getUserId(), UserInfo.getFirstName(), UserInfo.getLastName())
    }

    async startSession(sessionId: string) {
        await this.connection.send("StartSession", sessionId)
    }

    async endSession(sessionId: string) {
        await this.connection.send("EndSession", sessionId)
    }

    async sendAllIdeas(sessionId: string) {
        await this.connection.send("SendAllIdeas", sessionId)
    }

    async removeSession(sessionId: string) {
        await this.connection.send("RemoveSession", sessionId)
    }

    setUserJoinedBrainstormSessionCallback(callBackFunction: (sessionId: string, user: FriendlyUser) => void) {
        this.connection.on("UserJoinedBrainstormingSession", (sessionId: string, user: FriendlyUser) => {

            // new user joined brainstorming session
            callBackFunction(sessionId, user);
        });
    }

    setBrainstormSessionStartedCallback(callBackFunction: (sessionId: string) => void) {
        this.connection.on("BrainstormSessionStarted", (sessionId: string) => {

            // brainstorm session started
            callBackFunction(sessionId);
        });
    }


    setBrainstormSessionEndedCallback(callBackFunction: (sessionId: string) => void) {
        this.connection.on("BrainstormSessionEnded", (sessionId: string) => {

            // brainstorm session ended
            callBackFunction(sessionId);
        });
    }


    setReceiveAllIdeasCallback(callBackFunction: (sessionId: string, ideas: string[]) => void) {
        this.connection.on("ReceiveAllIdeas", (sessionId: string, ideas: string[]) => {

            // receive all ideas from brainstorm session
            callBackFunction(sessionId, ideas);
        });
    }

    /**
     * Remove all the brainstorm session call back functions
     */
    removeBSCallBack() {
        this.connection.off("UserJoinedBrainstormingSession");
        this.connection.off("BrainstormSessionStarted");
        this.connection.off("BrainstormSessionEnded");
        this.connection.off("ReceiveAllIdeas");
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

export default SignalRChatRoom