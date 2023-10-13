import MessageWindow from './msgWindow';
import MessageInput from './msgInputField';
import '../styles/chatRoomWindow.css';

function chatRoomWindow()
{
    return (
        <div>
            <div className="ChatRoomWindowContainer">
                <div className='ChatRoomHeader'>
                    Chat Room Name
                </div>
                <MessageWindow />
                <MessageInput />
            </div>
        </div>
    );
}

export default chatRoomWindow;