import AppInfo from "./appInfo"
import SignalRChatRoom from "./chatRoomConnection"

export default class ApiService
{
    // Do a Login API call to the backend
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
        })

        // if response is okay, assign to appinfo for later use
        if (resp.ok)
        {
            AppInfo.loginRegisterResponse = await resp.json()
            AppInfo.setToken()
            await this.connectChatRooms()
        }

        return resp
    }

    async connectChatRooms(){
        const connection = await SignalRChatRoom.getInstance()
        for (let index = 0; index < AppInfo.loginRegisterResponse.chatRooms.length; index++) {
            const element = AppInfo.loginRegisterResponse.chatRooms[index];
            await connection.joinChatRoom(element.joinCode)
        }
    }

    async connectChatRoom(joinCode){
        const connection = await SignalRChatRoom.getInstance()
        await connection.joinChatRoom(joinCode)
    }

    // Do a Register API call to the backend
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

        })

        // if response is okay, assign to appinfo for later use
        if (resp.ok)
        {
            AppInfo.loginRegisterResponse = await resp.json()
            AppInfo.setToken()
            await this.connectChatRooms()
        }

        return resp
    }

    // Do a GetChatRooms API call to the backend
    async CreateChatRoom(userId, title, description)
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
                userId: userId,
                title: title,
                description: description
            }),

        })

        // if response is okay, assign to appinfo for later use
        if (resp.ok)
        {
            data = (await resp.json())["chatRoom"]
            AppInfo.addNewChatRoom(data)
            await connectChatRoom(data.joinCode)
        }

        return resp
    }

    async GuestJoin(code)
    {
        const resp = await fetch(AppInfo.BaseURL + "/api/chatroom/guest",
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code
            }),

        })

        // if response is okay, assign to appinfo for later use
        if (resp.ok)
        {
            AppInfo.loginRegisterResponse=await resp.json()
        }

        return resp
    }
}