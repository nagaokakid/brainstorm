/* eslint-disable react/prop-types */
import '../styles/ChatRoomOption.css'
import icon1 from '../assets/chat-bubble.png'
import icon2 from '../assets/meeting.png'
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
                await x.joinChatRoom(input, "First")
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
