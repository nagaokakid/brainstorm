/* eslint-disable react/prop-types */
import '../styles/ChatRoomWindow.css';
import MessageWindow from './MsgWindow';
import MemberList from './MemberList';
import { useState, useEffect } from 'react';

/**
 * 
 * @param {*} chatType The type of chat list to be displayed; either "Direct Message List" or "ChatRoom List" 
 * @param {*} chat The chat object to be displayed 
 * @returns The chat room window of the application
 */
function ChatRoomWindow(props)
{
    // Set the default chat header to be empty string
    const [chatHeader, setChatHeader] = useState("");

    // Set the default chat id to be empty string
    const [chatId, setChatId] = useState("");

    // Set the default member list to be empty list
    const [memberList, setMemberList] = useState([]);

    // Set new state when the chat object changes
    useEffect(() =>
    {
        setMemberList(props.chat.members ?? null);
        setChatId(props.chat.id ?? props.chat.user2.userId);
        setChatHeader(props.chat.title ?? props.chat.user2.firstName+" "+props.chat.user2.lastName);
    }, [props.chat]);

    return (
        <div className='WindowContainer' style={props.chat === null ? {display:"none"} : {display:"flex"}}>
            <div className='MsgContainer' style={props.chatType === "Direct Message List" ? {width:"100%"} : {}}>
                <div className='ChatHeader'>
                    <h1 className='ChatTitle'>{chatHeader}</h1>
                </div>
                <div className='MsgSection'>
                    <MessageWindow chatId= {chatId} chatType= {props.chatType} />
                </div>
            </div>
            <div className='MemberListContainer' style={props.chatType === "Direct Message List" ? {display:"none"} : {display:"flex"}}>
                <MemberList memberList={memberList}/>
            </div>
        </div>
    );
}

export default ChatRoomWindow;