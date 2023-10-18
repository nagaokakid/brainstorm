import '../styles/chatRoomOption.css'
import icon1 from '../assets/chat-bubble.png'
import icon2 from '../assets/meeting.png'
import GuestJoin from './guestJoin'
import AppInfo from '../services/appInfo'
import ApiService from '../services/apiService'

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
            var chatRoomName = prompt("Please enter the Chat room name", "Description");
            if (chatRoomName != null) {
                var userId = AppInfo.getUserId();
                const apiService = new ApiService();
                await apiService.CreateChatRoom(userId, chatRoomName, "description");
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
                <button type="button" className="btn btn-primary" onClick={() => {const input = prompt("Enter the chat room code")}}>
                    <img className='btn-icon' src={icon2} alt="" />
                    {/* <GuestJoin /> */}
                </button>
            </div>
        </div>
    );
}

export default chatRoomOption;
