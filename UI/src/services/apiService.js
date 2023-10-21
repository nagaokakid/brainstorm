/* eslint-disable react-hooks/rules-of-hooks */
import AppInfo from "./AppInfo";
import SignalRChatRoom from "./ChatRoomConnection";
import SignalRDirect from "./DirectMessageConnection";

export default class ApiService
{
    /**
     * Do a Login API call to the backend and connect to all chatrooms and direct messaging
     * @param {*} username The username of the user
     * @param {*} password The password of the user
     * @returns A json object that contains the response from the backend
     */
    async Login(username, password)
    {
        const resp = await fetch(AppInfo.BaseURL + "api/users/login",
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Username: username, Password: password }),
        });

        // if response is okay, assign to appinfo for later use
        if (resp.ok) {
            AppInfo.loginRegisterResponse = await resp.json();
            localStorage.setItem("token", AppInfo.getToken());
            console.log("----> Login success");
            await this.connectChatRooms();
            await this.connectDirectMessaging();
        }

        return resp;
    }

    /**
     * Do a Register API call to the backend and connect to direct messaging
     * @param {*} username The username of the user
     * @param {*} password The password of the user
     * @param {*} firstName The first name of the user
     * @param {*} lastName The last name of the user
     * @returns A json object that contains the response from the backend
     */
    async Register(username, password, firstName, lastName)
    {
        const resp = await fetch(AppInfo.BaseURL + "api/users",
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Username: username, Password: password, FirstName: firstName, LastName: lastName }),
            
        });
        
        // if response is okay, assign to appinfo for later use
        if (resp.ok)
        {
            AppInfo.loginRegisterResponse = await resp.json();
            localStorage.setItem("token", AppInfo.getToken());
            console.log("----> Register success");
            await this.connectDirectMessaging();
        }
        
        return resp;
    }

    /**
     * Do a GetChatRooms API call to the backend and build the connection to the chat room
     * @param {*} title The chat room name or title
     * @param {*} description The chat room description
     * @returns A json object that contains the response from the backend
     */
    async CreateChatRoom(title, description)
    {
        const resp = await fetch(AppInfo.BaseURL + "api/chatroom",
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    "Authorization": 'Bearer ' + AppInfo.getToken(),
                },
                body: JSON.stringify({
                    userId: AppInfo.getUserId(),
                    title: title,
                    description: description
                }),

            });

        // if response is okay, assign to appinfo for later use
        if (resp.ok)
        {
            const data = (await resp.json())["chatRoom"];
            AppInfo.addNewChatRoom(data);
            console.log("----> Create chatroom success");
            await this.connectChatRoom(data.joinCode);
        }

        return resp;
    }

    /**
     * Do a chatroom join API call to the backend without an account
     * @param {*} code The join code of the chatroom
     * @returns A json object that contains the response from the backend
     */
    async GuestJoin(code)
    {
        const resp = await fetch(AppInfo.BaseURL + "api/chatroom/guest",
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + AppInfo.getToken()
            },
            body: JSON.stringify({
                code: code
            }),

        });

        // if response is okay, assign to appinfo for later use
        if (resp.ok)
        {
            AppInfo.loginRegisterResponse = await resp.json();
            localStorage.setItem("token", AppInfo.getToken());
            console.log("----> Guest join success");
            await this.connectChatRooms();
        }

        return resp;
    }

    /**
     * Build the connection to the backend for each chatroom
     */
    async connectChatRooms()
    {
        const connection = await SignalRChatRoom.getInstance();
        const chatRooms = AppInfo.getChatRoomsList();

        // Build connection only if there are chatrooms
        if (chatRooms)
        {
            console.log("----> Connecting to chatrooms");
            for (let index = 0; index < chatRooms.length; index++)
            {
                const element = chatRooms[index];
                await connection.joinChatRoom(element.joinCode, "Second");
            }
        }
    }

    /**
     * Build the connection to the backend for a specific chatroom
     * @param {*} joinCode The join code of the chatroom
     */
    async connectChatRoom(joinCode)
    {
        const connection = await SignalRChatRoom.getInstance();
        console.log("----> Connecting to chatroom");
        await connection.joinChatRoom(joinCode, "Second");
    }

    /**
     * Build the connection to the backend for direct messaging
     */
    async connectDirectMessaging()
    {
        const conn = await SignalRDirect.getInstance();
        conn.setReceiveDirectMessageCallback((msg) =>
        {
            console.log("----> Receive direct message callback", msg);
            AppInfo.addNewDirectMessage(msg);
        });
    }

    /**
     * Set all the call back functions for the SignalR
     */
    async buildCallBack(callback)
    {
        await SignalRDirect.getInstance().then(value => value.setReceiveDirectMessageCallback((msg) =>
        {
            console.log("----> Receive direct message callback", msg);
            callback(msg);
        }));
        await SignalRChatRoom.getInstance().then(async value => await value.setReceiveChatRoomMessageCallback((msg) =>
        {
            console.log("----> Receive chatroom message callback1", msg);
            callback(msg);
            console.log("----> Receive chatroom message callback2", msg);
        }));
        await SignalRChatRoom.getInstance().then(value => value.setReceiveChatRoomInfoCallback((info) =>
        {
            console.log("----> Receive chatroom info callback", info);
            callback(info);
        }));
    }
}