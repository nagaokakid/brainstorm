/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/MessageWindow.css";
import MessageBox from "./MessageBox";
import UserInfo from "../services/UserInfo";
import MessageInput from "./MessageInput";
import { chatRoomMessageObject } from "../models/TypesDefine";
import { useDataContext } from "../contexts/DataContext";
import { useEffect, useState } from "react";

interface MessageWindowProps {
    chatId: string;
    chatType: string;
}

function MessageWindow(props: MessageWindowProps) {
    const context = useDataContext();
    const msg = context[1];
    const [messages, setMessages] = useState([] as (chatRoomMessageObject | { message: string, timestamp: string })[]); // Set the message to the display

    useEffect(() => {
        if ("chatRoomId" in msg && msg.chatRoomId === props.chatId) {
            setMessages(prev => [...prev, msg]);
        } else if ("toUserInfo" in msg && msg.toUserInfo && msg.toUserInfo?.userId === props.chatId) {
            setMessages(prev => [...prev, msg]);
        }
    }, [msg]);

    useEffect(() => {
        setMessages(UserInfo.getMessageHistory(props.chatId, props.chatType));
    }, [props.chatId]);

    return (
        <div className="MsgWindowContainer">
            <div className="MsgSection">
                {messages.map((e, index) => (
                    'brainstorm' in e ?
                        <MessageBox message={e.message} key={index} user={'fromUserInfo' in e ? [e.fromUserInfo.userId, e.fromUserInfo.firstName] : []} isBrainstorm={true} bsId={e.brainstorm?.sessionId} /> :
                        <MessageBox message={e.message} key={index} user={'fromUserInfo' in e ? [e.fromUserInfo.userId, e.fromUserInfo.firstName] : []} isBrainstorm={false} />
                ))}
            </div>
            <div className='InputSection'>
                <MessageInput chatType={props.chatType} chatId={props.chatId} />
            </div>
        </div>
    );
}

export default MessageWindow;
