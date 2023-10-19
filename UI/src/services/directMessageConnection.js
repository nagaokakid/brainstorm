import * as signalR from "@microsoft/signalr"
import AppInfo from "./appInfo"

const DIRECT_URL = AppInfo.BaseURL + "direct"

class SignalRDirect {
    static #instance

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
        this.connection.withUrl(DIRECT_URL)
        this.connection.withAutomaticReconnect()
        this.connection = this.connection.build()
    }

    async makeConnection(){
        console.log("starting connection")
        await this.connection.start()
            .then(async () => {
                await this.join()
                console.log("join Direct Message");
            })
            .catch(err => console.warn(err))
    }

    setReceiveDirectMessageCallback(directMessageCallback){
        this.connection.on("ReceiveDirectMessage", (msg) => directMessageCallback(msg));
    }

    async sendMessage(msg) {
        console.log("Sending Direct Message");
        await this.connection.send("SendDirectMessage", msg.fromUserInfo.userId, msg.fromUserInfo.firstName, msg.fromUserInfo.lastName, msg.toUserInfo.userId, msg.toUserInfo.firstName, msg.toUserInfo.lastName, msg.message)
    }

    async join() {
        console.log("Joining Direct Messaging");
        const user = AppInfo.getCurrentFriendlyUserInfo()
        await this.connection.send("JoinDirect", user.userId, user.firstName, user.lastName)
    }

    getChatHistory(fromId, toId) {
        this.connection.send("GetChatHistory", fromId, toId)
    }

    // This idea is from stack overflow
    static async getInstance() {

        if (SignalRDirect.instance == null) {
            SignalRDirect.instance = new SignalRDirect()
            await SignalRDirect.instance.makeConnection()
        }
        return SignalRDirect.instance
    }
}

export default SignalRDirect