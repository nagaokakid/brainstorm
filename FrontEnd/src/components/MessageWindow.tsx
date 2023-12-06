/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDataContext } from "../contexts/DataContext";
import { TabTypes } from "../models/EnumObjects";
import { chatRoomMessageObject } from "../models/TypesDefine";
import UserInfo from "../services/UserInfo";
import "../styles/MessageWindow.css";
import MessageBox from "./MessageBox";
import MessageInput from "./MessageInput";

/* 
    *  MessageWindow.tsx 
    * -------------------------
    *  This component is the message window of the chat room.
    *  It contains the messages of the chat room.
    *  -----------------------------------------------------------------------
    * Authors:  Mr. Yee Tsung (Jackson) Kao & Mr. Roland Fehr
    * Date Created:  01/12/2023
    * Last Modified: 01/12/2023
    * Version: 1.0
    */
interface MessageWindowProps {
    chatId: string;
    chatType: TabTypes;
}

function MessageWindow(props: MessageWindowProps) {
    const context = useDataContext();
    const msg = context[1];
    const render = context[4];
    const [messages, setMessages] = useState([] as (chatRoomMessageObject | { fromUserId: string, messageId: string, message: string, timestamp: string })[]); // Set the message to the display


    useEffect(() => {
        if (msg === undefined) {
            setMessages(UserInfo.getMessageHistory(props.chatId, props.chatType));
        } else if ("chatRoomId" in msg && msg.chatRoomId === props.chatId) {
            setMessages(prev => [...prev, msg]);
        } else if ("fromUserId" in msg) {
            setMessages(prev => [...prev, msg]);
        }
    }, [msg]);

    useEffect(() => {
        setMessages(UserInfo.getMessageHistory(props.chatId, props.chatType));
    }, [props.chatId, render]);

    return (
        <div className="MsgWindowContainer">
            <div className="MsgSection">
                {messages.map((e, index) => (
                    'brainstorm' in e ?
                        <MessageBox message={e.message} key={index} user={'fromUserInfo' in e ? [e.fromUserInfo.userId, e.fromUserInfo.firstName] : []} isBrainstorm={true} bsId={e.brainstorm?.sessionId} chatId={props.chatId} msgId={'messageId' in e ? e.messageId : ''} chatType={props.chatType} /> :
                        'fromUserInfo' in e ?
                            <MessageBox message={e.message} key={index} user={[e.fromUserInfo.userId, e.fromUserInfo.firstName]} isBrainstorm={false} chatId={props.chatId} msgId={'messageId' in e ? e.messageId : ''} chatType={props.chatType} /> :
                            <MessageBox message={e.message} key={index} user={[e.fromUserId]} isBrainstorm={false} chatId={props.chatId} msgId={'messageId' in e ? e.messageId : ''} chatType={props.chatType} />
                ))}
            </div>
            <div className='InputSection'>
                <MessageInput chatType={props.chatType} chatId={props.chatId} />
            </div>
        </div>
    );
}

export default MessageWindow;
