export default class AppInfo
{
    static receiveChatRoomMessage = 1;
    static receiveChatRoomInfoMessage = 1;

    static BaseURL = "http://localhost:5135/"

    static loginRegisterResponse =
    {
        "userInfo":
        {
            "userId": "3",
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
                            "userId": "1",
                            "firstName": "string",
                            "lastName": "string"
                        },
                        "toUserInfo":
                        {
                            "userId": "2",
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
                            "userId": "1",
                            "firstName": "string",
                            "lastName": "string"
                        },
                        "toUserInfo":
                        {
                            "userId": "2",
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
                            "userId": "3",
                            "firstName": "string",
                            "lastName": "string"
                        },
                        "toUserInfo":
                        {
                            "userId": "2",
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
                        "userId": "0001",
                        "firstName": "11111",
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
                        "userId": "00005",
                        "firstName": "22222",
                        "lastName": "string"
                    }
                ]
            }
        ],
        "directMessages": [
            {
                "user1":
                        {
                            "userId": "3",
                            "firstName": "string",
                            "lastName": "string"
                        },
                "user2":
                        {
                            "userId": "1",
                            "firstName": "string",
                            "lastName": "string"
                        },

                "directMessages": [
                    {
                        "message": "11AppInfo is DM 1 lalalalalalalalalalaalal",
                        "timestamp": "2023-10-13T23:35:59.786Z"
                    },
                    {
                        "message": "22AppInfo is DM 1 lalalalalalalalalalaalal",
                        "timestamp": "2023-10-13T23:35:59.786Z"
                    }
                ],
            },
        ]
    }

    static addOne()
    {
        this.receiveChatRoomMessage++;
    }

    static getCurrentFriendlyUserInfo()
    {
        return this.loginRegisterResponse.userInfo ?? {};
    }

    static getUserId()
    {
        return this.getCurrentFriendlyUserInfo().userId ?? {};
    }

    static getFirstName()
    {
        return this.getCurrentFriendlyUserInfo().firstName ?? {};
    }

    static getLastName()
    {
        return this.getCurrentFriendlyUserInfo().lastName ?? {};
    }

    static getUserName()
    {
        var temp = this.getCurrentFriendlyUserInfo();
        return temp.firstName + " " + temp.lastName;
    }

    static getToken()
    {
        return this.loginRegisterResponse.token ?? "";
    }

    static getChatRoomsList()
    {
        return  this.loginRegisterResponse.chatRooms ?? [];
    }

    static getDirectMessagesList()
    {
        return this.loginRegisterResponse.directMessages ?? [];
    }

    /**
     * 
     * @param {*} userInfo User information object
     * @param {*} chatId The chat room id
     */
    static addNewMember(userInfo, chatId)
    {
        this.getChatRoomsList().forEach(chatRoom =>
            {
                if (chatRoom.id === chatId)
                {
                    chatRoom.members.push(userInfo);
                }
            });
    }

    /**
     * 
     * @param {*} chatRoom An object that contains the chat room information
     * @returns 
     */
    static addNewChatRoom(chatRoom)
    {
        return this.getChatRoomsList().push(chatRoom);
    }

    /**
     * 
     * @param {*} newDirectMessage An object that contains the from_user, to_user and message information
     * @returns 
     */
    static addNewDirectMessage(newDirectMessage)
    {
        var result = null;
        this.getDirectMessagesList().map((current) =>
        {
            if (newDirectMessage.user2.userId === current.user2.userId)
            {
                console.log("----> Adding new direct message to existing direct message list");
                result = current.messages.push(newDirectMessage.messages[0]);
                console.log("----> Added new direct message", this.getDirectMessagesList());
            } 
        });
        
        if (result === null)
        {
            console.log("----> Create a new Direct Message List");
            return this.loginRegisterResponse.directMessages.push(newDirectMessage);
        }
        else
        {
            return result;
        }
    }

    /**
     * 
     * @param {*} message An object that contains the from_user, chat room id and message information
     * @returns 
     */
    static addChatRoomMessage(message)
    {
        var result = null;
        this.getChatRoomsList().forEach(chatRoom =>
            {
                if (chatRoom.id === message.chatRoomId)
                {
                    result = chatRoom.messages.push(message);
                }
            });

        return result;
    }

    /**
     * 
     * @param {*} chatId Can be the chat room id or the to_user_id
     * @param {*} chatType Can be either 'Direct Message List' or 'Chat Room List'
     * @returns 
     */
    static getListHistory(chatId, chatType)
    {
        if (chatType === "Direct Message List")
        {
            var temp = this.getDirectMessagesList().find(chat => chat.user2.userId === chatId);
            return temp ? temp.directMessages : [];
        }
        else
        {
            var temp1 = this.getChatRoomsList().find(chat => chat.id === chatId);
            return temp1 ? temp1.messages : [];
        }
    }
}