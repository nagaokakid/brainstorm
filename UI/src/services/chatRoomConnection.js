import * as signalR from "@microsoft/signalr";
import AppInfo from "./appInfo";

// This is the URL for the SignalR chatroom Hub
const DIRECT_URL = AppInfo.BaseURL + "chatroom";

class SignalRChatRoom
{
    static #instance

    // This is the connection to the SignalR chatroom Hub
    constructor()
    {
        this.connection = new signalR.HubConnectionBuilder();
        this.connection.withUrl(DIRECT_URL);
        this.connection.withAutomaticReconnect();
        this.connection = this.connection.build();
    }

    // This is the function that actually makes the connection
    async makeConnection()
    {
        console.log("----> Starting connection to chatroom services");
        await this.connection.start()
        .then(respone =>
            {
                if (respone.ok)
                {
                    console.log("----> Realtime chatroom connected.");
                }
            })
        .catch(console.log("----> Connection to chatroom failed"));
    }

    // Receive a message from backend and to the chat room info
    receiveMessageCallback(callback)
    {
        this.connection.on("ReceiveChatRoomMessage", (msg) =>
        {
            callback(msg);
            console.log("----> Receive realtime chatroom msg");
            AppInfo.addMessage(msg);
        });
    }

    // Receive a new chat room info from backend and add it to the user info
    receiveChatRoomInfoCallback(callback)
    {
        this.connection.on("ReceiveChatRoomInfo", (info) =>
        {
            callback(info);
            console.log("----> Receive new ChatRoom Info");
            AppInfo.addNewChatRoom(info);
        });
    }

    // Send a message to the backend from chat room
    async sendChatRoomMessage(msg) {
        console.log("----> Sending chatroom message", msg);
        console.log("----> Connection state ", this.connection.state);
        await this.connection.send("SendChatRoomMessage", msg.fromUserInfo.userId,  msg.chatRoomId,  msg.fromUserInfo.firstName,  msg.fromUserInfo.lastName,  msg.message).catch(x=>console.log(x));
    }

    // Build the connection to the chat room
    async joinChatRoom(joinCode) {
        console.log("----> Joining chatroom", joinCode);
        await this.connection.send("JoinChatRoom", joinCode).catch(console.log("----> Join chatroom failed"));
    }

    // This idea is from stack overflow
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