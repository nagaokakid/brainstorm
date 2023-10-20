export default class AppInfo
{
    static BaseURL = "https://localhost:32770/"

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
                "id": "0001",
                "title": "string",
                "description": "AppInfo is Chat Room 1 lalalalallalalalalalallalal",
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
                        "message": "hello",
                        "timestamp": "2023-10-13T23:35:59.786Z"
                    },
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
                        "message": "bye",
                        "timestamp": "2023-10-13T23:35:59.786Z"
                    },
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
                        "message": "really?",
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
            },
            {
                "id": "0002",
                "title": "string2",
                "description": "AppInfo is Chat Room 2",
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
                        "message": "I'm here",
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
        ],
        "directMessages": [
            {
                "User1":
                        {
                            "userId": "string",
                            "firstName": "string",
                            "lastName": "string"
                        },
                "User2":
                        {
                            "userId": "string",
                            "firstName": "string",
                            "lastName": "string"
                        },

                "messages": [
                    {
                        "message": "11AppInfo is DM 1 lalalalalalalalalalaalal",
                        "timestamp": "2023-10-13T23:35:59.786Z"
                    },
                    {
                        "message": "22AppInfo is DM 1 lalalalalalalalalalaalal",
                        "timestamp": "2023-10-13T23:35:59.786Z"
                    }
                ],
            }
        ]
    }

    static setToken()
    {
        localStorage.setItem("token", AppInfo.loginRegisterResponse.token)
    }

    static getToken()
    {
        return localStorage.getItem("token")
    }

    static getUserId()
    {
        return AppInfo.loginRegisterResponse.userInfo.userId
    }

    static getUserName()
    {
        return AppInfo.loginRegisterResponse.userInfo.firstName + " " + AppInfo.loginRegisterResponse.userInfo.lastName
    }

    static getDirectMessagesList()
    {
        return AppInfo.loginRegisterResponse.directMessages ?? []
    }

    static getChatRoomsList()
    {
        return  AppInfo.loginRegisterResponse.chatRooms ?? []
    }

    static addNewChatRoom(chatRoom)
    {
        AppInfo.loginRegisterResponse.chatRooms.push(chatRoom)
    }

    static getCurrentFriendlyUserInfo()
    {
        return AppInfo.loginRegisterResponse.userInfo
    }

    static addMessage(message)
    {
        if (message === null)
        {
            // Direct Message
        }
        else
        {
            AppInfo.loginRegisterResponse.chatRooms.forEach(chatRoom => {if (chatRoom.id === message.chatRoomId) chatRoom.messages.push(message)})
        }
    }

    static getList(chatId, chatType)
    {
        if (chatType === "Direct Message List")
        {
            var temp = AppInfo.loginRegisterResponse.directMessages.find(chat => chat.id === chatId)
            return temp ? temp.messages : []
        }
        else
        {
            var temp1 = AppInfo.loginRegisterResponse.chatRooms.find(chat => chat.id === chatId)
            return temp1 ? temp1.messages : []
        }
    }
}