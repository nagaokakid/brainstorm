import * as signalR from "@microsoft/signalr"
import AppInfo from "./appInfo"

const DIRECT_URL = AppInfo.BaseURL + "chatroom"

class SignalRChatRoom {
    static #instance

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
        this.connection.withUrl(DIRECT_URL)
        this.connection.withAutomaticReconnect()
        this.connection = this.connection.build()

    }

    async makeConnection() {
        await this.connection.start()
        console.log("realtime chatroom connected");
    }

    receiveMessageCallback(callback) {
        this.connection.on("ReceiveChatRoomMessage", (msg) => {
            callback(msg)
            console.log("Receive realtime chatroom msg");
            console.log(msg);
            AppInfo.addMessage(msg)
        });
    }

    receiveChatRoomInfoCallback(callback){
        this.connection.on("ReceiveChatRoomInfo", (info) => {
            callback(info)
            console.log("Receive new ChatRoom Info");
            console.log(info);
            AppInfo.addNewChatRoom(info)
        })
    }

    async sendChatRoomMessage(msg) {
        console.log("sending chatroom message" + msg);
        console.log(msg);
        console.log("connection state " + this.connection.state);
        this.connection.send("SendChatRoomMessage", msg.fromUserInfo.userId,  msg.chatRoomId,  msg.fromUserInfo.firstName,  msg.fromUserInfo.lastName,  msg.message).catch(x=>console.log(x))
    }

    joinChatRoom(joinCode) {
        this.connection.send("JoinChatRoom", joinCode)
    }

    // This idea is from stack overflow
    static async getInstance() {

        if (SignalRChatRoom.instance == null) {
            SignalRChatRoom.instance = new SignalRChatRoom()
            await SignalRChatRoom.instance.makeConnection()
        }
        return SignalRChatRoom.instance
    }
}

export default SignalRChatRoom