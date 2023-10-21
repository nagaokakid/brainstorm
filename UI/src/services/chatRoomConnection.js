import * as signalR from "@microsoft/signalr";
import AppInfo from "./AppInfo";
import { DataContext, DataDispatchContext } from "../context/dataContext";

/**
 * This is the URL for the SignalR chatroom Hub
 */
const DIRECT_URL = AppInfo.BaseURL + "chatroom";

class SignalRChatRoom
{
    static #instance

    /**
     * This is the connection to the SignalR chatroom Hub
     */
    constructor()
    {
        this.connection = new signalR.HubConnectionBuilder();
        this.connection.withUrl(DIRECT_URL);
        this.connection.withAutomaticReconnect();
        this.connection = this.connection.build();
    }

    /**
     * This is the function that actually makes the connection
     */
    async makeConnection()
    {
        console.log("----> Starting connection to chatroom services");
        await this.connection.start();
        this.connection.on("NewMemberJoined", (userInfo, chatId) =>
        {
            AppInfo.addNewMember(userInfo, chatId);
            console.log("----> New member joined callback")
        });
    }

    /**
     * Set a callback function that will be called when a chat room message is received
     * @param {*} callBackFunction A function that will be called when a chat room message is received
     */
    setReceiveChatRoomMessageCallback(callBackFunction)
    {
        this.connection.on("ReceiveChatRoomMessage",(msg) =>
        {
            const setChatMessage = DataDispatchContext()[2];
            const chatMessage = DataContext()[2];
            setChatMessage(!chatMessage);
            callBackFunction(msg);
            AppInfo.addChatRoomMessage(msg);
        });
    }

    /**
     * Set a callback function that will be called when a chat room info is received
     * @param {*} callback A function that will be called when a chat room info is received
     */
    setReceiveChatRoomInfoCallback(callBackFunction)
    {
        this.connection.on("ReceiveChatRoomInfo", (info) =>
        {
            var setChatRoomInfo = DataDispatchContext()[3];
            var chatRoomInfo = DataContext()[3];
            console.log("----> Chatroom info received", info);
            console.log("before", chatRoomInfo)
            setChatRoomInfo(!chatRoomInfo);
            console.log("after", chatRoomInfo)
            callBackFunction(info);
            AppInfo.addChatRoomInfo(info);
        });
    }

    /**
     * Send a message to the backend from chat room
     * @param {*} msg A message object that will be sent to the backend
     */
    async sendChatRoomMessage(msg)
    {
        console.log("----> Sending chatroom message", msg);
        console.log("----> Connection state ", this.connection.state);
        await this.connection.send("SendChatRoomMessage", msg.fromUserInfo.userId, msg.chatRoomId, msg.fromUserInfo.firstName, msg.fromUserInfo.lastName, msg.message).catch(x => console.log(x));
    }

    /**
     * Build the connection to the chat room
     * @param {*} joinCode The join code of the chat room
     * @param {*} type The type of the chat room
     */
    async joinChatRoom(joinCode, type)
    {
        console.log("----> Joining chatroom", joinCode);
        await this.connection.send("JoinChatRoom", joinCode, type, AppInfo.getUserId(), AppInfo.getFirstName(), AppInfo.getLastName()).catch(console.log("----> Join chatroom failed"));
    }

    /**
     * Get the instance of the SignalRChatRoom
     * @returns The instance of the SignalRChatRoom
     */
    static async getInstance()
    {
        if (SignalRChatRoom.instance == null)
        {
            SignalRChatRoom.instance = new SignalRChatRoom();
            await SignalRChatRoom.instance.makeConnection();
        }

        return SignalRChatRoom.instance;
    }
}

export default SignalRChatRoom