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
        return this.loginRegisterResponse.directMesseges ? this.loginRegisterResponse.directMesseges : []
    }

    static getChatRoomsList()
    {
        return this.loginRegisterResponse.chatRooms ? [] :this.loginRegisterResponse.chatRooms
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