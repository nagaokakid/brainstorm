/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDataContext } from "../contexts/DataContext";
import { TabTypes } from "../models/EnumObjects";
import { chatRoomMessageObject } from "../models/TypesDefine";
import UserInfo from "../services/UserInfo";
import "../styles/MessageWindow.css";
import MessageBox from "./MessageBox";
import MessageInput from "./MessageInput";

interface MessageWindowProps {
    chatId: string;
    chatType: TabTypes;
}

/**
 *  MessageWindow.tsx 
 * -------------------------
 *  This component is the message window of the chat room.
 *  It contains the messages of the chat room.
 * -----------------------------------------------------------------------
 *  Authors:  Mr. Yee Tsung (Jackson) Kao & Mr. Roland Fehr
 */
function MessageWindow(props: MessageWindowProps) {
    const context = useDataContext();
    const msg = context.updateMsg;
    const updateDeleteMsg = context.updateDeleteMsg;
    const [trigger, setTrigger] = useState(false); // Trigger to re-render the component
    const [messages, setMessages] = useState([] as (chatRoomMessageObject | { fromUserId: string, messageId: string, message: string, timestamp: string })[]); // Set the message to the display

    /**
     * Get the message history of the chat room
     */
    useEffect(() => {
        setMessages(UserInfo.getMessageHistory(props.chatId, props.chatType));
    }, [props.chatId, updateDeleteMsg]);

    /**
     * Add the new message to the message list
     */
    useEffect(() => {
        if (trigger) {
            if (msg === undefined) {
                setMessages(UserInfo.getMessageHistory(props.chatId, props.chatType));
            } else if ("chatRoomId" in msg && msg.chatRoomId === props.chatId) {
                setMessages(prev => [...prev, msg]);
            } else if ("fromUserId" in msg && props.chatType === TabTypes.DiretMessage) {
                setMessages(prev => [...prev, msg]);
            }
        }
    }, [msg]);

    useEffect(() => {
        setTrigger(true);
    }, []);

    useEffect(() => {
        const chatWindow = document.getElementById("MsgSection");
        if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="msg-window-container">
            <div className="msg-section" id="MsgSection">
                {messages.map((e, index) => (
                    'brainstorm' in e ?
                        <MessageBox message={e.message} key={index} user={[e.fromUserInfo.userId, e.fromUserInfo.firstName]} isBrainstorm={true} bsId={e.brainstorm?.sessionId} chatId={props.chatId} msgId={e.messageId} chatType={props.chatType} /> :
                        'fromUserInfo' in e ?
                            <MessageBox message={e.message} key={index} user={[e.fromUserInfo.userId, e.fromUserInfo.firstName]} isBrainstorm={false} chatId={props.chatId} msgId={e.messageId} chatType={props.chatType} /> :
                            <MessageBox message={e.message} key={index} user={[e.fromUserId]} isBrainstorm={false} chatId={props.chatId} msgId={e.messageId} chatType={props.chatType} />
                ))}
            </div>
            <div className='input-section'>
                <MessageInput chatType={props.chatType} chatId={props.chatId} />
            </div>
        </div>
    );
}

export default MessageWindow;
