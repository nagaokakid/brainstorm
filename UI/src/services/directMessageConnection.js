import * as signalR from "@microsoft/signalr";
import AppInfo from "./appInfo";

// This is the URL for the SignalR direct message Hub
const DIRECT_URL = AppInfo.BaseURL + "direct";

class SignalRDirect
{
    static #instance

    // This is the connection to the SignalR direct message Hub
    constructor()
    {
        this.connection = new signalR.HubConnectionBuilder();
        this.connection.withUrl(DIRECT_URL);
        this.connection.withAutomaticReconnect();
        this.connection = this.connection.build();
    }

    // This is the function that actually makes the connection and join the direct message
    async makeConnection()
    {
        console.log("----> Starting connection to direct message");
        await this.connection.start()
            .then(async () =>
            {
                await this.join();
                console.log("----> Joined direct Message");
            })
            .catch(console.log("----> Connection to direct message failed"));
    }

    // This is the function that sets the callback for receiving direct messages
    setReceiveDirectMessageCallback(directMessageCallback)
    {
        this.connection.on("ReceiveDirectMessage", (msg) =>
        {
            directMessageCallback(msg);
            AppInfo.addMessage(msg);
        });
    }

    // This is the function that sends a direct message to the backend
    async sendMessage(msg)
    {
        console.log("----> Sending Direct Message");
        await this.connection.send("SendDirectMessage", msg.User1.userId, msg.User1.firstName, msg.User1.lastName, msg.User2.userId, msg.User2.firstName, msg.User2.lastName, msg.messages[0].message).catch(console.log("----> Send Direct Message failed"));
    }

    // This is the function that joins the direct message channel.
    async join()
    {
        console.log("----> Joining Direct Messaging");
        const user = AppInfo.getCurrentFriendlyUserInfo();
        await this.connection.send("JoinDirect", user.userId, user.firstName, user.lastName).catch(console.log("----> Join direct message failed"));
    }

    async getDirectMessageHistory(fromId, toId)
    {
        console.log("----> Getting Direct Message History");
        await this.connection.send("GetChatHistory", fromId, toId).catch(console.log("----> Get Direct Message History failed"));
    }

    // This idea is from stack overflow
    static async getInstance()
    {
        if (SignalRDirect.instance == null)
        {
            SignalRDirect.instance = new SignalRDirect();
            await SignalRDirect.instance.makeConnection();
        }

        return SignalRDirect.instance;
    }
}

export default SignalRDirect