import * as signalR from "@microsoft/signalr";
import UserInfo from "./UserInfo";
import { newDirectMessageObject, sendMessageObject } from "./TypesDefine";

/**
 * This is the URL for the SignalR direct message Hub
 */
const DIRECT_URL = UserInfo.BaseURL + "direct";

class SignalRDirect {

    private static instance: SignalRDirect;
    private connection: signalR.HubConnection;

    /**
     * This is the connection to the SignalR direct message Hub
     */
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(DIRECT_URL)
            .withAutomaticReconnect()
            .build();
    }

    /**
     * This is the function that actually makes the connection and join the direct message
     */
    async makeConnection() {
        console.log("----> Starting connection to direct message");
        try {
            await this.connection.start();
            console.log("----> Connection to direct message successful");
            await this.join();
            console.log("----> Joined direct Message");
        } catch (error) {
            console.log("----> Error: " + error);
        }
    }

    /**
     * Set a callback function that will be called when a direct message is received
     * @param {*} callBackFunction A function that will be called when a direct message is received
     */
    setReceiveDirectMessageCallback(callBackFunction: () => void) {
        this.connection.on("ReceiveDirectMessage", (msg: newDirectMessageObject) => {
            UserInfo.addNewDirectMessage(msg);
            callBackFunction();
        });
    }

    /**
     * Send a direct message to the backend
     * @param {*} msg An message object that will be sent to the backend
     */
    async sendMessage(msg: sendMessageObject) {
        console.log("----> Sending Direct Message");
        await this.connection.send("SendDirectMessage", msg.user1.userId, msg.user1.firstName, msg.user1.lastName, msg.user2.userId, msg.user2.firstName, msg.user2.lastName, msg.message).catch(() => console.log("----> Send Direct Message failed"));
    }

    /**
     * This is the function that joins the direct message channel.
     */
    async join() {
        console.log("----> Joining Direct Messaging");
        const user = UserInfo.getCurrentFriendlyUserInfo();
        await this.connection.send("JoinDirect", user.userId, user.firstName, user.lastName).catch(() => console.log("----> Join direct message failed"));
    }

    /**
     * Search the direct message history between two users
     * @param {*} fromId Sender's user id
     * @param {*} toId Receiver's user id
     */
    async getDirectMessageHistory(fromId: string, toId: string) {
        console.log("----> Getting Direct Message History");
        await this.connection.send("GetChatHistory", fromId, toId).catch(() => console.log("----> Get Direct Message History failed"));
    }

    /**
     * Get the instance of the SignalR direct message connection
     * @returns A singleton instance of the SignalR direct message connection
     */
    static async getInstance(): Promise<SignalRDirect> {
        if (!SignalRDirect.instance) {
            SignalRDirect.instance = new SignalRDirect();
            await SignalRDirect.instance.makeConnection();
        }

        return SignalRDirect.instance;
    }
}

export default SignalRDirect