/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDataContext } from '../contexts/DataContext';
import { DisplayTypes, TabTypes } from '../models/EnumObjects';
import { chatRoomObject, directMessageObject, userInfoObject } from '../models/TypesDefine';
import UserInfo from '../services/UserInfo';
import '../styles/ChatRoomWindow.css';
import MemberList from './MemberList';
import MessageWindow from './MessageWindow';

interface ChatRoomWindowProps {
    chat: (chatRoomObject | directMessageObject),
    brainstormButton: () => void,
}

/**
 *  ChatRoomWindow.tsx 
 * -------------------------
 *  This component is the chat room window of the chat page.
 *  It contains the message window and the member list of the chat room.
 * -----------------------------------------------------------------------
 *  Authors:  Mr. Yee Tsung (Jackson) Kao & Mr. Roland Fehr
 */
function ChatRoomWindow(props: ChatRoomWindowProps) {
    const context = useDataContext();
    const updateMember = context.updateMember;
    const updateHeader = context.updateHeader;
    const [chatHeader, setChatHeader] = useState('title' in props.chat ? props.chat.title : (props.chat.user1.userId === UserInfo.getUserId() ? props.chat.user2.firstName : props.chat.user1.firstName));
    const type = 'id' in props.chat ? TabTypes.ChatRoom : TabTypes.DiretMessage;
    const chatId = 'id' in props.chat ? props.chat.id : (props.chat.user1.userId === UserInfo.getUserId() ? props.chat.user2.userId : props.chat.user1.userId);
    const joinCode = 'joinCode' in props.chat ? props.chat.joinCode : null;
    const [memberList, setMemberList] = useState([] as userInfoObject[]);

    /**
     * Update the member list
     */
    useEffect(() => {
        if ('members' in props.chat) {
            setMemberList(UserInfo.getMemberList(props.chat.id));
        }
        setChatHeader('title' in props.chat ? (UserInfo.getChatRoomInfo(chatId)?.title ?? "") : (props.chat.user1.userId === UserInfo.getUserId() ? props.chat.user2.firstName : props.chat.user1.firstName));
    }, [props.chat, updateMember]);

    /**
     * Update the chat header
     */
    useEffect(() => {
        setChatHeader('title' in props.chat ? (UserInfo.getChatRoomInfo(chatId)?.title ?? "") : (props.chat.user1.userId === UserInfo.getUserId() ? props.chat.user2.firstName : props.chat.user1.firstName));
    }, [updateHeader]);

    return (
        <div className='chat-window-container'>
            <div className='chat-window-msg-container' style={type === TabTypes.DiretMessage ? { width: "100%" } : {}}>
                <div className='chat-header'>
                    <h1 className='chat-title'>
                        {chatHeader}
                    </h1>
                    <h2 className='room-code' style={type === TabTypes.DiretMessage ? { display: DisplayTypes.None } : { display: DisplayTypes.Flex }}>
                        Code: {joinCode}
                    </h2>
                    <a onClick={() => props.brainstormButton()} style={type === TabTypes.DiretMessage ? { display: DisplayTypes.None } : { display: DisplayTypes.Flex }}>Create Brainstorm Session</a>
                </div>
                <div className='msg-section'>
                    <MessageWindow chatId={chatId} chatType={type} />
                </div>
            </div>
            <div className='member-list-container' style={type === TabTypes.DiretMessage ? { display: DisplayTypes.None } : { display: DisplayTypes.Flex }}>
                <MemberList memberList={memberList} />
            </div>
        </div>
    );
}

export default ChatRoomWindow;