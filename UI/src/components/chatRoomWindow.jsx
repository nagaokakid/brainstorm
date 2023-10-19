import MessageWindow from './MsgWindow';
import MessageInput from './msgInputField';
import MemberList from './MemberList';
import SignalRChatRoom from "../services/chatRoomConnection";
import SignalRDirect from '../services/directMessageConnection';
import '../styles/chatRoomWindow.css';

function chatRoomWindow(props)
{
    // Create the connection object (return direct message connection if isChatRoom is false)
    const connection = props.chatType === "Direct Message List" ? SignalRDirect.getInstance() : SignalRChatRoom.getInstance();

    return (
        <div className='WindowContainer' style={ props.chatId === "" ? {display:"none"} : {display:"flex"}}>
            <div className='MsgContainer' style={props.chatType === "Direct Message List" ? {width:"100%"} : {}}>
                <div className='ChatHeader'>
                    <h1 className='ChatTitle'>{props.headerTitle}</h1>
                </div>
                <div className='MsgSection'>
                    <MessageWindow title={props.headerTitle} chatId= {props.chatId} chatType= {props.chatType} />
                </div>
                <div className='InputSection'>
                    <MessageInput connection= { connection } chatId={props.chatId} />
                </div>
            </div>
            <div className='MemberListContainer' style={props.chatType === "Direct Message List" ? {display:"none"}:{display:"flex"} }>
                <MemberList />
            </div>
        </div>
    );
}

export default chatRoomWindow;