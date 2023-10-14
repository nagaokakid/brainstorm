class AppInfo {
    static BaseURL = "https://localhost:11111/"
    
    static loginRegisterResponse = {
        "userInfo": {
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
                        "fromUserInfo": {
                            "userId": "string",
                            "firstName": "string",
                            "lastName": "string"
                        },
                        "toUserInfo": {
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

    static getUserId(){
        return loginRegisterResponse.userInfo.userId
    }

    static addNewChatRoom(chatRoom){
        this.loginRegisterResponse.chatRooms.push(chatRoom)
    }

    static getCurrentFriendlyUserInfo(){
        return this.loginRegisterResponse.userInfo
    }
}