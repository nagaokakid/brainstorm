import UserInfo from "./UserInfo";
import SignalRChatRoom from "./ChatRoomConnection";
import SignalRDirect from "./DirectMessageConnection";

type chatRoomObject = {
    id: string,
    title: string,
    description: string,
    joinCode: string,
    messages: [],
    members: []
}

class ApiService {
    /**
     * Do a Login API call to the backend and connect to all chatrooms and direct messaging
     * @param {*} username The username of the user
     * @param {*} password The password of the user
     * @returns A json object that contains the response from the backend
     */
    async Login(username: string, password: string) {
        const resp = await fetch(UserInfo.BaseURL + "api/users/login",
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
            UserInfo.loginRegisterResponse = await resp.json();
            localStorage.setItem("token", UserInfo.getToken());
            console.log("----> Login success");
            await this.connectChatRooms();
            // await this.connectDirectMessaging();
            console.log("----> Connected to chatrooms and direct messaging");
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
    async Register(username: string, password: string, firstName: string, lastName: string) {
        const resp = await fetch(UserInfo.BaseURL + "api/users",
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Username: username, Password: password, FirstName: firstName, LastName: lastName }),

            });

        // if response is okay, assign to appinfo for later use
        if (resp.ok) {
            UserInfo.loginRegisterResponse = await resp.json();
            localStorage.setItem("token", UserInfo.getToken());
            console.log("----> Register success");
            // await this.connectDirectMessaging();
            console.log("----> Connected to direct messaging");
        }

        return resp;
    }

    /**
     * Do a GetChatRooms API call to the backend and build the connection to the chat room
     * @param {*} title The chat room name or title
     * @param {*} description The chat room description
     * @returns A json object that contains the response from the backend
     */
    async CreateChatRoom(title: string, description: string) {
        const resp = await fetch(UserInfo.BaseURL + "api/chatroom",
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    "Authorization": 'Bearer ' + UserInfo.getToken(),
                },
                body: JSON.stringify({
                    userId: UserInfo.getUserId(),
                    title: title,
                    description: description
                }),

            });

        // if response is okay, assign to appinfo for later use
        if (resp.ok) {
            const data: chatRoomObject = (await resp.json())["chatRoom"];
            UserInfo.addNewChatRoom(data);
            console.log("----> Create chatroom success");
            await this.connectChatRoom(data.joinCode);
            console.log("----> Connected to chatroom");
        }

        return resp;
    }

    /**
     * Do a chatroom join API call to the backend without an account
     * @param {*} code The join code of the chatroom
     * @returns A json object that contains the response from the backend
     */
    async GuestJoin(code: string) {
        const resp = await fetch(UserInfo.BaseURL + "api/chatroom/guest",
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + UserInfo.getToken()
                },
                body: JSON.stringify({
                    code: code
                }),

            });

        // if response is okay, assign to appinfo for later use
        if (resp.ok) {
            UserInfo.loginRegisterResponse = await resp.json();
            localStorage.setItem("token", UserInfo.getToken());
            console.log("----> Guest join success");
            await this.connectChatRooms();
            console.log("----> Connected to chatrooms");
        }

        return resp;
    }

    /**
     * 
     * @param code The join code of the chatroom
     */
    async joinChatRoom(code: string) {
        const resp = await fetch(UserInfo.BaseURL + "api/chatroom/join",
            {
                method: 'POST',
                headers:
                {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + UserInfo.getToken()
                },
                body: JSON.stringify({
                    code: code
                }),

            });

        if (resp.ok) {
            const data: chatRoomObject = (await resp.json())["chatRoom"];
            UserInfo.addNewChatRoom(data);
            console.log("----> Join chatroom success");
            await this.connectChatRoom(data.joinCode);
            console.log("----> Connected to chatroom");
        }

        return resp;
    }

    /**
     * Build the connection to the backend for each chatroom
     */
    async connectChatRooms() {
        const connection = await SignalRChatRoom.getInstance();
        const chatRooms = UserInfo.getChatRoomsList();

        // Build connection only if there are chatrooms
        if (chatRooms) {
            console.log("----> Connecting to chatrooms");
            for (let index = 0; index < chatRooms.length; index++) {
                const element = chatRooms[index];
                await connection.joinChatRoom(element.joinCode, "Second");
            }
        }
    }

    /**
     * Build the connection to the backend for a specific chatroom
     * @param {*} joinCode The join code of the chatroom
     */
    async connectChatRoom(joinCode: string) {
        const connection = await SignalRChatRoom.getInstance();
        console.log("----> Connecting to chatroom");
        await connection.joinChatRoom(joinCode, "Second");
    }

    /**
     * Build the connection to the backend for direct messaging
     */
    // async connectDirectMessaging() {
    //     const conn = await SignalRDirect.getInstance();
    //     conn.setReceiveDirectMessageCallback((msg) => {
    //         console.log("----> Receive direct message callback");
    //     });
    // }

    /**
     * Set all the call back functions for the SignalR
     * @param {*} callback A function that will be called when a message is received
     */
    async buildCallBack(Callback: (type: number) => void) {
        await SignalRDirect.getInstance().then(value =>
            value.setReceiveDirectMessageCallback(() => {
                console.log("----> Receive direct message callback");
                Callback(2);
            }));
        await SignalRChatRoom.getInstance().then(value =>
            value.setReceiveChatRoomMessageCallback(() => {
                console.log("----> Receive chatroom message callback");
                Callback(1);
            }));
        await SignalRChatRoom.getInstance().then(value =>
            value.setReceiveChatRoomInfoCallback(() => {
                console.log("----> Receive chatroom info callback");
                Callback(4);
            }));
        await SignalRChatRoom.getInstance().then(value =>
            value.setReceiveNewMemberCallback(() => {
                console.log("----> Receive chatroom member callback");
                Callback(3);
            }));
    }
}

export default new ApiService();