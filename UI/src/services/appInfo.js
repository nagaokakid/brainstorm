export default class AppInfo
{
    static BaseURL = "https://localhost:32768/"

    static loginRegisterResponse =
    {
        "userInfo":
        {
            "userId": "string",
            "firstName": "string",
            "lastName": "string"
        },
        "token": "string",
        "chatRooms": [
            {
                "id": "string",
                "title": "string",
                "description": "string",
                "joinCode": "string",
                "messages": [
                    {
                        "fromUserInfo":
                        {
                            "userId": "string",
                            "firstName": "string",
                            "lastName": "string"
                        },
                        "toUserInfo":
                        {
                            "userId": "string",
                            "firstName": "string",
                            "lastName": "string"
                        },
                        "chatRoomId": "string",
                        "message": "string",
                        "timestamp": "2023-10-13T23:35:59.786Z"
                    }
                ],
                "members": [
                    {
                        "userId": "string",
                        "firstName": "string",
                        "lastName": "string"
                    }
                ]
            }
        ]
    }

    static getUserId()
    {
        return this.loginRegisterResponse.userInfo.userId
    }

    static getUserName()
    {
        return this.loginRegisterResponse.userInfo.firstName + " " + this.loginRegisterResponse.userInfo.lastName
    }

    static getDirectMessagesList()
    {
        return this.loginRegisterResponse.directMesseges ? [{id:"DM_1", lastMsg:"This is left"}, {id:"DM_2", lastMsg:"This is left"}] : [{id:"DM_1", lastMsg:"This is right"}, {id:"DM_2", lastMsg:"This is right"}]
    }

    static getChatRoomsList()
    {
        return this.loginRegisterResponse.chatRooms ? [{id:"CR_1", lastMsg:"This is left"}] : [{id:"CR_1", lastMsg:"This is right"}]
    }

    static addNewChatRoom(chatRoom)
    {
        this.loginRegisterResponse.chatRooms.push(chatRoom)
    }

    static getCurrentFriendlyUserInfo()
    {
        return this.loginRegisterResponse.userInfo
    }
}