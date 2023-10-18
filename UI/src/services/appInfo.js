export default class AppInfo
{
    static BaseURL = "https://localhost:32772/"

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
                "description": "This is Chat Room 1 lalalalallalalalalalallalal",
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
                "title": "string",
                "description": "This is Chat Room 2",
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
                "id": "0011",
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
                        "chatRoomId": "DirectMessage",
                        "message": "This is DM 1 lalalalalalalalalalaalal",
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

    static setToken()
    {
        localStorage.setItem("token", this.loginRegisterResponse.token)
    }

    static getToken()
    {
        return localStorage.getItem("token")
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
        return this.loginRegisterResponse.directMesseges ? this.loginRegisterResponse.directMesseges : [{}]
    }

    static getChatRoomsList()
    {
        const data = this.loginRegisterResponse.chatRooms
        console.log("from service "+ data);
        return  this.loginRegisterResponse.chatRooms ?? [{}]
    }

    static addNewChatRoom(chatRoom)
    {
        this.loginRegisterResponse.chatRooms.push(chatRoom)
    }

    static getCurrentFriendlyUserInfo()
    {
        return this.loginRegisterResponse.userInfo
    }

    static addMessage(message)
    {
        if (message.toUserInfo && message.toUserInfo != null)
        {
            // Direct Message
        }
        else
        {
            this.loginRegisterResponse.chatRooms.forEach(chatRoom => {if (chatRoom.id === message.chatRoomId) chatRoom.messages.push(message)})
        }
    }

    static getList(chatId, chatType)
    {
        if (chatType === "Direct Message List")
        {
            var temp = this.loginRegisterResponse.directMesseges.find(chat => chat.id === chatId)
            return temp ? temp.messages : [{}]
        }
        else
        {
            var temp1 = this.loginRegisterResponse.chatRooms.find(chat => chat.id === chatId)
            return temp1 ? temp1.messages : [{}]
        }
    }
}