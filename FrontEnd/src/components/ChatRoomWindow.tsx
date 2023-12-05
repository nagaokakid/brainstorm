import '../styles/ChatRoomWindow.css';
import MessageWindow from './MessageWindow';
import MemberList from './MemberList';
import UserInfo from '../services/UserInfo';
import { useDataContext } from '../contexts/DataContext';
import { chatRoomObject, directMessageObject, userInfoObject } from '../models/TypesDefine';
import { useEffect, useState } from 'react';

interface ChatRoomWindowProps {
    chat: (chatRoomObject | directMessageObject),
    brainstormButton: () => void,
}

function ChatRoomWindow(props: ChatRoomWindowProps) {
    const context = useDataContext();
    const updateMemberList = context[0];
    const updateHeader = context[8];
    const [chatHeader, setChatHeader] = useState('title' in props.chat ? props.chat.title : (props.chat.user1.userId === UserInfo.getUserId() ? props.chat.user2.firstName : props.chat.user1.firstName));
    const type = 'id' in props.chat ? TabTypes.ChatRoom : TabTypes.DiretMessage;
    const chatId = 'id' in props.chat ? props.chat.id : (props.chat.user1.userId === UserInfo.getUserId() ? props.chat.user2.userId : props.chat.user1.userId);
    const joinCode = 'joinCode' in props.chat ? props.chat.joinCode : null;
    const [memberList, setMemberList] = useState([] as userInfoObject[]);

    useEffect(() => {
        if ('members' in props.chat) {
            setMemberList(UserInfo.getMemberList(props.chat.id));
        }
        setChatHeader('title' in props.chat ? (UserInfo.getChatRoomInfo(chatId)?.title ?? "") : (props.chat.user1.userId === UserInfo.getUserId() ? props.chat.user2.firstName : props.chat.user1.firstName));
    }, [props.chat, updateMemberList]);

    useEffect(() => {
        setChatHeader('title' in props.chat ? (UserInfo.getChatRoomInfo(chatId)?.title ?? "") : (props.chat.user1.userId === UserInfo.getUserId() ? props.chat.user2.firstName : props.chat.user1.firstName));
    }, [updateHeader]);

    return (
        <div className='WindowContainer'>
            <div className='MsgContainer' style={type === "Direct Message List" ? { width: "100%" } : {}}>
                <div className='ChatHeader'>
                    <h1 className='ChatTitle'>
                        {chatHeader}
                    </h1>
                    <h2 className='RoomCode' style={type === "Direct Message List" ? { display: "none" } : { display: "flex" }}>
                        Code: {joinCode}
                    </h2>
                    <a onClick={() => props.brainstormButton()} style={type === "Direct Message List" ? { display: "none" } : { display: "flex" }}>Create BrainStorm Session</a>
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