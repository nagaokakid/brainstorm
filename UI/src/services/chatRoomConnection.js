import * as signalR from "@microsoft/signalr"
import AppInfo from "./appInfo"
import { json } from "react-router-dom"

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
        }
            );
    }

    async sendChatRoomMessage(msg) {
        console.log("sending chatroom message" + msg);
        console.log(msg);
        console.log("connection state " + this.connection.state);
        // FromUserInfo: {UserId: "id", FirstName: "first", LastName: "last"},
        const test =  {    
            "msg": "hi"
        }
        console.log(test);
        this.connection.send("SendChatRoomMessage", test).catch(x=>console.log(x))
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