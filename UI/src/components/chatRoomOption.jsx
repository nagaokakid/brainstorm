import '../styles/chatRoomOption.css'
import icon1 from '../assets/chat-bubble.png'
import icon2 from '../assets/meeting.png'
import GuestJoin from './guestJoin'
import AppInfo from '../services/appInfo'
import ApiService from '../services/apiService'
import SignalRChatRoom from '../services/chatRoomConnection'

function chatRoomOption(props)
{
    // Set the component to be hidden and pass back the selected option
    function handleOptionClick(e) {
        props.callBack(e)
    }

    // Prevent the child from being clicked
    function handleChildClick(e) {
        e.stopPropagation();
    }

    // 
    async function buttonHandler(selected) {
        if (selected === 1) {
            var chatRoomName = prompt("Please enter the Chat room name");
            if (chatRoomName) {
                console.log("Created a chat room")
                // AppInfo.addNewChatRoom({
                //     "id": "00120",
                //     "title": chatRoomName,
                //     "description": "AppInfo is Chat Room 1 lalalalallalalalalalallalal",
                //     "joinCode": "string",
                //     "messages": [
                //         {
                //             "fromUserInfo":
                //             {
                //                 "userId": "string",
                //                 "firstName": "string",
                //                 "lastName": "string"
                //             },
                //             "toUserInfo":
                //             {
                //                 "userId": "string",
                //                 "firstName": "string",
                //                 "lastName": "string"
                //             },
                //             "chatRoomId": "string",
                //             "message": "hello",
                //             "timestamp": "2023-10-13T23:35:59.786Z"
                //         }
                //     ],
                //     "members": [
                //         {
                //             "userId": "string",
                //             "firstName": "string",
                //             "lastName": "string"
                //         }
                //     ]
                // })
                handleOptionClick("none")
                const apiService = new ApiService();
                await apiService.CreateChatRoom(chatRoomName, "description")
                
            }
        }
    }
    return (
        <div className='OptionContainer' style={{ display: props.style }} onClick={() => handleOptionClick("none")}>
            <div className="btn-group" role="group" aria-label="Basic example" onClick={handleChildClick}>
                <button type="button" className="btn btn-primary" onClick={() => buttonHandler(1)}>
                    <img className='btn-icon' src={icon1} alt="" />
                    Create Chat Room
                </button>
                <button type="button" className="btn btn-primary" onClick={() => {
                    const input = prompt("Enter the chat room code")
                    SignalRChatRoom.getInstance().then(async x=> {
                        function test(msg){

                        }
                        x.receiveChatRoomInfoCallback(test)
                        await x.joinChatRoom(input)
                    })
                    }}>
                    <img className='btn-icon' src={icon2} alt="" />
                    {/* <GuestJoin /> */}
                </button>
            </div>
        </div>
    );
}

export default chatRoomOption;
