import * as signalR from "@microsoft/signalr"

const DIRECT_URL = AppInfo.BaseURL + "direct"

class SignalRDirect {
    static #instance

    constructor(receiveDirectMessageCallback, receiveChatHistoryCallback) {
        this.connection = new signalR.HubConnectionBuilder()
        this.connection.withUrl(DIRECT_URL)
        this.connection.withAutomaticReconnect()

        this.connection = this.connection.build()

        console.log("starting connection");
        this.connection.start()
            .then(() => {
                console.log("connected");
                this.connection.on("ReceiveDirectMessage", (msg) => receiveDirectMessageCallback(msg));
                this.connection.on("ReceiveChatHistory", (msg) => receiveChatHistoryCallback(msg));
            })
            .catch(err => console.warn(err))
    }

    sendMessage(msg) {
        this.connection.send("SendDirectMessage", msg)
    }

    join(user) {
        this.connection.send("JoinDirect", user)
    }

    getChatHistory(fromId, toId) {
        this.connection.send("GetChatHistory", fromId, toId)
    }

    // This idea is from stack overflow
    static getInstance(receiveDirectMessageCallback, receiveChatHistoryCallback) {

        if (SignalRDirect.instance == null) {
            SignalRDirect.instance = new SignalRDirect(receiveDirectMessageCallback, receiveChatHistoryCallback)
        }
        return SignalRDirect.instance
    }
}

export default SignalRDirect