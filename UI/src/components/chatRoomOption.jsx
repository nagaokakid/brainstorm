import '../styles/chatRoomOption.css'
import icon1 from '../assets/chat-bubble.png'
import icon2 from '../assets/meeting.png'
import GuestJoin from './guestJoin'
import AppInfo from '../services/appInfo'
import ApiService from '../services/apiService'

function chatRoomOption(props) {
    const buttonHandler = (selected) =>
    {
        if (selected === 1)
        {
            var chatRoomName, description = prompt("Please enter the Chat room name", "Description");
            if (chatRoomName != null && description != null)
            {
                var userId = AppInfo.getUserId();
                const apiService = new ApiService();
                apiService.createChatRoom(userId, chatRoomName, description);
            }
        }
    }
    return (
        <div className='OptionContainer' style={ {display : props.style}}>
            <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-primary" onClick={() => buttonHandler(1)}>
                    <img className='btn-icon' src={icon1} alt="" />
                    Create Chat Room
                </button>
                <button type="button" className="btn btn-primary" >
                    <img className='btn-icon' src={icon2} alt="" />
                    <GuestJoin />
                </button>
            </div>
        </div>
    );
}

export default chatRoomOption;
