import '../styles/ChatRoomWindow.css';
import MessageWindow from './MessageWindow';
import MemberList from './MemberList';
import { useDataContext } from '../context/DataContext';
import { chatRoomObject, directMessageObject } from '../services/TypesDefine';

interface ChatRoomWindowProps {
    chat: (chatRoomObject | directMessageObject);
}

/**
 * 
 * @param {*} chat The chat object to be displayed 
 * @returns The chat room window of the application
 */
function ChatRoomWindow(props: ChatRoomWindowProps) {

    const { chatType } = useDataContext();
    const type = chatType;
    const chatId = 'id' in props.chat ? props.chat.id : props.chat.user2.userId;
    const chatHeader = 'title' in props.chat ? props.chat.title : props.chat.user2.firstName + " " + props.chat.user2.lastName;
    const joinCode = 'joinCode' in props.chat ? props.chat.joinCode : null;
    const memberList = 'members' in props.chat ? props.chat.members : null;

    return (
        <div className='WindowContainer' style={props.chat === null ? { display: "none" } : { display: "flex" }}>
            <div className='MsgContainer' style={type === "Direct Message List" ? { width: "100%" } : {}}>
                <div className='ChatHeader'>
                    <h1 className='ChatTitle'>
                        {chatHeader + "  " + joinCode}
                    </h1>
                </div>
                <div className='MsgSection'>
                    <MessageWindow chatId={chatId} chatType={type} />
                </div>
            </div>
            <div className='MemberListContainer' style={type === "Direct Message List" ? { display: "none" } : { display: "flex" }}>
                <MemberList memberList={memberList} />
            </div>
        </div>
    );
}

export default ChatRoomWindow;