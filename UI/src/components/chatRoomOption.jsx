/* eslint-disable react/prop-types */
import '../styles/ChatRoomOption.css'
import icon1 from '../assets/chat-bubble.png'
import icon2 from '../assets/meeting.png'
import AppInfo from '../services/AppInfo'
import ApiService from '../services/ApiService'
import SignalRChatRoom from '../services/ChatRoomConnection'

/**
 * 
 * @param {*} callBackFunction The function to be called when an option is selected
 * @param {*} style The style of the component
 * @returns 
 */
function ChatRoomOption(props)
{
    // Set the component to be hidden and pass back the selected option
    function handleOptionClick(e)
    {
        props.callBackFunction(e)
    }

    // Prevent the child from being clicked
    function handleChildClick(e)
    {
        e.stopPropagation();
    }

    async function handleCreateRoomButton()
    {
        var chatRoomName = prompt("Please enter the Chat room name");

        if (chatRoomName)
        {
            handleOptionClick("none")
            const apiService = new ApiService();
            await apiService.CreateChatRoom(chatRoomName, "description")
        }
    }

    // // 
    // async function buttonHandler(selected) {
    //     if (selected === 1) {
            
    //         if (chatRoomName) {
    //             console.log("Created a chat room")
    //             AppInfo.addNewChatRoom({
    //                 "id": "00120",
    //                 "title": chatRoomName,
    //                 "description": "AppInfo is Chat Room 1 lalalalallalalalalalallalal",
    //                 "joinCode": "string",
    //                 "messages": [
    //                     {
    //                         "fromUserInfo":
    //                         {
    //                             "userId": "string",
    //                             "firstName": "string",
    //                             "lastName": "string"
    //                         },
    //                         "toUserInfo":
    //                         {
    //                             "userId": "string",
    //                             "firstName": "string",
    //                             "lastName": "string"
    //                         },
    //                         "chatRoomId": "string",
    //                         "message": "hello",
    //                         "timestamp": "2023-10-13T23:35:59.786Z"
    //                     }
    //                 ],
    //                 "members": [
    //                     {
    //                         "userId": "string",
    //                         "firstName": "string",
    //                         "lastName": "string"
    //                     }
    //                 ]
    //             })
    //             handleOptionClick("none")
    //             const apiService = new ApiService();
    //             await apiService.CreateChatRoom(chatRoomName, "description")
                
    //         }
    //     }
    // }

    /**
     * Join a chat room
     */
    async function handleJoinChatRoom()
    {
        var input = prompt("Enter the chat room code");

        if (input)
        {
            SignalRChatRoom.getInstance().then(async x =>
            {
                await x.joinChatRoom(input)
                await x.setReceiveChatRoomInfoCallback((msg) => console.log("----> Received chat room info: ", msg))
            })
        }
    }

    return (
        <div className='OptionContainer' style={{ display: props.style }} onClick={() => handleOptionClick("none")}>
            <div className="btn-group" role="group" aria-label="Basic example" onClick={handleChildClick}>
                <button type="button" className="btn btn-primary" onClick={() => handleCreateRoomButton()}>
                    <img className='btn-icon' src={icon1} alt="" />
                    Create Chat Room
                </button>
                <button type="button" className="btn btn-primary" onClick={() => handleJoinChatRoom()}>
                    <img className='btn-icon' src={icon2} alt="" />
                    Join a Chat Room
                </button>
            </div>
        </div>
    );
}

export default ChatRoomOption;
