import * as signalR from "@microsoft/signalr"

const DIRECT_URL = AppInfo.BaseURL + "chatroom"

class SignalRChatRoom {
    static #instance

    constructor(receiveChatRoomMessageCallback, changeUserStatusCallback) {
        this.connection = new signalR.HubConnectionBuilder()
        this.connection.withUrl(DIRECT_URL)
        this.connection.withAutomaticReconnect()

        this.connection = this.connection.build()

        console.log("starting chatroom connection");
        this.connection.start()
            .then(() => {
                console.log("chatroom connected");
                this.connection.on("ReceiveChatRoomMessage", (msg) => receiveChatRoomMessageCallback(msg));
                this.connection.on("ChangeUserStatus", (userId, isOnline) => changeUserStatusCallback(userId, isOnline));

            })
            .catch(err => console.warn(err))
    }

    sendChatRoomMessage(msg) {
        this.connection.send("SendChatRoomMessage", msg)
    }

    joinChatRoom(code) {
        this.connection.send("JoinChatRoom", code)
    }

    // This idea is from stack overflow
    static getInstance(receiveChatRoomMessageCallback) {

        if (SignalRChatRoom.instance == null) {
            SignalRChatRoom.instance = new SignalRChatRoom(receiveChatRoomMessageCallback)
        }
        return SignalRChatRoom.instance
    }
}

export default SignalRChatRoom