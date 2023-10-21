import * as signalR from "@microsoft/signalr";
import AppInfo from "./AppInfo";

/**
 * This is the URL for the SignalR direct message Hub
 */
const DIRECT_URL = AppInfo.BaseURL + "direct";

class SignalRDirect
{
    static #instance

    /**
     * This is the connection to the SignalR direct message Hub
     */
    constructor()
    {
        this.connection = new signalR.HubConnectionBuilder();
        this.connection.withUrl(DIRECT_URL);
        this.connection.withAutomaticReconnect();
        this.connection = this.connection.build();
    }

    /**
     * This is the function that actually makes the connection and join the direct message
     */
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

    /**
     * Set a callback function that will be called when a direct message is received
     * @param {*} callBackFunction A function that will be called when a direct message is received
     */
    setReceiveDirectMessageCallback(callBackFunction)
    {
        this.connection.on("ReceiveDirectMessage", (msg) =>
        {
            callBackFunction(msg);
            AppInfo.addDirectMessage(msg);
        });
    }

    /**
     * 
     * @param {*} msg An message object that will be sent to the backend
     */
    async sendMessage(msg)
    {
        console.log("----> Sending Direct Message");
        console.log(msg);
        await this.connection.send("SendDirectMessage", msg.user1.userId, msg.user1.firstName, msg.user1.lastName, msg.user2.userId, msg.user2.firstName, msg.user2.lastName, msg.messages[0].message).catch(console.log("----> Send Direct Message failed"));
    }

    /**
     * This is the function that joins the direct message channel.
     */
    async join()
    {
        console.log("----> Joining Direct Messaging");
        const user = AppInfo.getCurrentFriendlyUserInfo();
        await this.connection.send("JoinDirect", user.userId, user.firstName, user.lastName).catch(console.log("----> Join direct message failed"));
    }

    /**
     * 
     * @param {*} fromId 
     * @param {*} toId 
     */
    async getDirectMessageHistory(fromId, toId)
    {
        console.log("----> Getting Direct Message History");
        await this.connection.send("GetChatHistory", fromId, toId).catch(console.log("----> Get Direct Message History failed"));
    }

    /**
     * Get the instance of the SignalR direct message connection
     * @returns A singleton instance of the SignalR direct message connection
     */
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