import MessageWindow from './msgWindow';
import MessageInput from './msgInputField';
import SignalRChatRoom from "../services/chatRoomConnection";
import SignalRDirect from '../services/directMessageConnection';
import '../styles/chatRoomWindow.css';

function chatRoomWindow(isChatRoom)
{
    // Create the connection object (return direct message connection if isChatRoom is false)
    const connection = isChatRoom ? new SignalRDirect(): new SignalRChatRoom();

    return (
        <div className='WindowContainer'>
            <div className='MsgContainer'>
                <div className='ChatHeader'>
                    <h1>Header</h1>
                </div>
                <div className='MsgSection'>
                    <MessageWindow connection= { connection }/>
                </div>
                <div className='InputSection'>
                    <MessageInput connection= { connection }/>
                </div>
            </div>
            <div className='MemberListContainer'></div>
        </div>
    );
}

export default chatRoomWindow;