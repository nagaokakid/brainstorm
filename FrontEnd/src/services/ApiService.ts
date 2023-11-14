import UserInfo from "./UserInfo";
import SignalRChatRoom from "./ChatRoomConnection";
import SignalRDirect from "./DirectMessageConnection";
import Idea from "../models/Idea";
import { loginObject, chatRoomObject } from "../models/TypesDefine";

class ApiService {
    /**
     * Do a Login API call to the backend and connect to all chatrooms and direct messaging
     * @param {*} loginInfo The login object that contains the username and password
     * @returns A json object that contains the response from the backend
     */
    async Login(loginInfo: loginObject) {
        const resp = await fetch(UserInfo.BaseURL + "api/users/login",
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Username: loginInfo.Username, Password: loginInfo.Password }),
            })
            .then(async (response) => {
                if (response.ok) {
                    UserInfo.setCurrentUser(await response.json()); // set current user
                    UserInfo.updateUser(true); // update user info to session storage
                    UserInfo.setToken(); // set token to session storage
                    await this.connectChatRooms();
                    return true;
                } else {
                    return false;
                }
            })
            .catch((error) => {
                console.log(error);
                return null;
            });

        return resp;
    }

    /**
     * Do a Register API call to the backend and connect to direct messaging
     * @param {*} registerInfo The register object that contains the username, password, first name and last name
     * @returns A json object that contains the response from the backend
     */
    async Register(registerInfo: loginObject) {
        const resp = await fetch(UserInfo.BaseURL + "api/users",
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Username: registerInfo.Username, Password: registerInfo.Password, FirstName: registerInfo.FirstName, LastName: registerInfo.LastName }),

            })
            .then(async (response) => {
                if (response.ok) {
                    UserInfo.setCurrentUser(await response.json()); // set current user
                    UserInfo.updateUser(true); // update user info to session storage
                    UserInfo.setToken(); // set token to session storage
                    return true;
                } else {
                    return false;
                }
            })
            .catch((error) => {
                console.log(error);
                return null;
            });

        return resp;
    }

    /**
     * Do a GetChatRooms API call to the backend and build the connection to the chat room
     * @param {*} title The chat room name or title
     * @param {*} description The chat room description
     * @returns A json object that contains the response from the backend
     */
    async CreateChatRoom(title: string, description: string | null | undefined) {
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
     * 
     * @param joinCode The join code of the chatroom
     * @returns 
     */
    async IsJoinCodeValid(joinCode: string) {
        const resp = await fetch(UserInfo.BaseURL + "api/chatroom/" + joinCode, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (resp.ok) {
            return await resp.json();
        }
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
     * Set all the call back functions for the SignalR
     * @param {*} callback A function that will be called when a message is received
     */
    async buildCallBack(Callback: (type: number, bsid?: string) => void) {
        await SignalRDirect.getInstance().then((value) =>
            value.setReceiveDirectMessageCallback(() => {
                console.log("----> Receive direct message callback");
                Callback(2);
            })
        );
        await SignalRChatRoom.getInstance().then((value) =>
            value.setReceiveChatRoomMessageCallback((bsid?: string) => {
                console.log("----> Receive chatroom message callback");
                Callback(1, bsid);
            })
        );
        await SignalRChatRoom.getInstance().then((value) =>
            value.setReceiveChatRoomInfoCallback(() => {
                console.log("----> Receive chatroom info callback");
                Callback(4);
            })
        );
        await SignalRChatRoom.getInstance().then((value) =>
            value.setReceiveNewMemberCallback(() => {
                console.log("----> Receive chatroom member callback");
                Callback(3);
            })
        );
        await SignalRChatRoom.getInstance().then((value) =>
            value.setUserJoinedBrainstormSessionCallback((id) => {
                console.log("----> Receive BS Join Info message callback");
                Callback(5, id);
            })
        );
        await SignalRChatRoom.getInstance().then((value) =>
            value.setBrainstormSessionAlreadyStartedErrorCallback(() => {
                console.log("----> Receive BS unable to join message callback");
                Callback(6);
            })
        );
    }

    async buildBSCallBack(Callback: (type: number, ideas?: Idea[]) => void) {
        await SignalRChatRoom.getInstance().then((value) =>
            value.setBrainstormSessionStartedCallback(() => {
                console.log("----> Receive BS started message callback");
                Callback(1);
            })
        );

        await SignalRChatRoom.getInstance().then((value) =>
            value.setBrainstormSessionEndedCallback(() => {
                console.log("----> Receive BS ended message callback");
                Callback(2);
            })
        );

        await SignalRChatRoom.getInstance().then((value) =>
            value.setReceiveAllIdeasCallback((id: string, ideas: Idea[]) => {
                console.log("----> Receive BS idea receive message callback");
                Callback(3, ideas);
            })
        );

        await SignalRChatRoom.getInstance().then((value) =>
            value.setReceiveVoteResultsCallback((id: string, ideas: Idea[]) => {
                console.log("----> Receive BS vote results message callback");
                Callback(4, ideas);
            })
        );

        await SignalRChatRoom.getInstance().then((value) =>
            value.setSendVotesCallback(() => {
                console.log("----> Receive BS send vote message callback");
                Callback(5);
            })
        );
    }

    async leaveBSSession() {
        await SignalRChatRoom.getInstance().then((value) =>
            value.removeBSCallBack()
        );
    }
}

export default new ApiService();
