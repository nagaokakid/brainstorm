import * as signalR from "@microsoft/signalr";
import UserInfo from "./UserInfo";
import { chatRoomMessageObject, chatRoomObject, userInfoObject } from "./TypesDefine";

/**
 * This is the URL for the SignalR chatroom Hub
 */
const DIRECT_URL = UserInfo.BaseURL + "chatroom";

class SignalRChatRoom {

    private static instance: SignalRChatRoom;
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
     * This is the function that actually makes the connection
     */
    async makeConnection() {
        console.log("----> Starting connection to chatroom services");
        await this.connection.start();
        this.connection.on("NewMemberJoined", (userInfo: userInfoObject, chatId: string) => {
            UserInfo.addNewMember(userInfo, chatId);
            console.log("----> New member joined callback")
        });
    }

    /**
     * Set a callback function that will be called when a chat room message is received
     * @param {*} callBackFunction A function that will be called when a chat room message is received
     */
    setReceiveChatRoomMessageCallback(callBackFunction: () => void) {
        this.connection.on("ReceiveChatRoomMessage", (msg: chatRoomMessageObject) => {
            console.log("----> Chatroom message received");
            UserInfo.addChatRoomMessage(msg);
            callBackFunction();
        });
    }

    /**
     * Set a callback function that will be called when a chat room info is received
     * @param {*} callback A function that will be called when a chat room info is received
     */
    setReceiveChatRoomInfoCallback(callBackFunction: () => void) {
        this.connection.on("ReceiveChatRoomInfo", (info: chatRoomObject) => {
            console.log("----> Chatroom info received", info);
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
        await this.connection.send("SendChatRoomMessage", msg.fromUserInfo.userId, msg.chatRoomId, msg.fromUserInfo.firstName, msg.fromUserInfo.lastName, msg.message).catch(() => console.log("----> Unable to send chat room message."));
    }

    /**
     * Build the connection to the chat room
     * @param {*} joinCode The join code of the chat room
     * @param {*} type The type of the chat room
     */
    async joinChatRoom(joinCode: string, type: string) {
        console.log("----> Joining chatroom:", joinCode);
        await this.connection.send("JoinChatRoom", joinCode, type, UserInfo.getUserId(), UserInfo.getFirstName(), UserInfo.getLastName()).catch(() => console.log("----> Join chatroom failed"));
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