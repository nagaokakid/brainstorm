import AppInfo from "./appInfo";
import SignalRChatRoom from "./chatRoomConnection";
import SignalRDirect from "./directMessageConnection";

export default class ApiService
{
    // Do a Login API call to the backend and connect to all chatrooms and direct messaging
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
            AppInfo.setToken();
            console.log("----> Login success");
            await this.connectChatRooms();
            await this.connectDirectMessaging();
        }

        return resp;
    }
    
    // Do a Register API call to the backend and connect to direct messaging
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
            AppInfo.setToken();
            console.log("----> Register success");
            await this.connectDirectMessaging();
        }
        
        return resp;
    }

    // Do a GetChatRooms API call to the backend and build the connection to the chat room
    async CreateChatRoom(title, description)
    {
        const resp = await fetch(AppInfo.BaseURL + "api/chatroom",
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    "Authorization": 'Bearer ' + AppInfo.getToken()
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

    // Do a chatroom join API call to the backend without an account
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
            AppInfo.setToken();
            console.log("----> Guest join success");
            await this.connectChatRooms();
        }

        return resp;
    }

    // Build the connection to the backend for each chatroom
    async connectChatRooms()
    {
        const connection = await SignalRChatRoom.getInstance();
        const chatRooms = AppInfo.loginRegisterResponse.chatRooms;

        // Build connection only if there are chatrooms
        if (chatRooms)
        {
            console.log("----> Connecting to chatrooms");
            for (let index = 0; index < chatRooms.length; index++)
            {
                const element = chatRooms[index];
                await connection.joinChatRoom(element.joinCode);
            }
        }
    }

    // Build the connection to the backend for a specific chatroom
    async connectChatRoom(joinCode)
    {
        const connection = await SignalRChatRoom.getInstance();
        console.log("----> Connecting to chatroom");
        await connection.joinChatRoom(joinCode);
    }

    // Build the connection to the backend for direct messaging
    async connectDirectMessaging()
    {
        const conn = await SignalRDirect.getInstance();
        conn.setReceiveDirectMessageCallback((msg) => console.log("----> Receive direct message callback", msg));
        // const msg = {
        //     fromUserInfo: AppInfo.getCurrentFriendlyUserInfo(),
        //     toUserInfo: AppInfo.getCurrentFriendlyUserInfo(),
        //     message: "hello direct message",
        // }
        // await conn.sendMessage(msg)
    }

    async buildCallBack()
    {
        await SignalRDirect.getInstance().then(value => value.setReceiveDirectMessageCallback((msg) => console.log("----> Receive direct message callback", msg)));
        await SignalRChatRoom.getInstance().then(value => value.receiveMessageCallback((msg) => console.log("----> Receive chatroom message callback", msg)));
        await SignalRChatRoom.getInstance().then(value => value.receiveChatRoomInfoCallback((info) => console.log("----> Receive chatroom info callback", info)));
    }
}