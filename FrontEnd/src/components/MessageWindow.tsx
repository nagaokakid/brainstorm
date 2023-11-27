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
    const render = context[4];
    const [messages, setMessages] = useState([] as (chatRoomMessageObject | { messageId:string, message: string, timestamp: string })[]); // Set the message to the display
   
    
    useEffect(() => {
        if(msg === undefined){
            setMessages(UserInfo.getMessageHistory(props.chatId, props.chatType));
            
        }
        else if ("chatRoomId" in msg && msg.chatRoomId === props.chatId) {
            setMessages(prev => [...prev, msg]);
        } else if ("toUserInfo" in msg && msg.toUserInfo) {
            const check1 = msg.toUserInfo.userId === UserInfo.getUserId() && msg.fromUserInfo.userId === props.chatId;
            const check2 = msg.toUserInfo.userId === props.chatId && msg.fromUserInfo.userId === UserInfo.getUserId();
            if (check1 || check2) {
                setMessages(prev => [...prev, msg]);
            }
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
                        <MessageBox message={e.message} key={index} user={'fromUserInfo' in e ? [e.fromUserInfo.userId, e.fromUserInfo.firstName] : []} isBrainstorm={true} bsId={e.brainstorm?.sessionId} chatId={props.chatId} msgId={'messageId' in e ? e.messageId:''} chatType={props.chatType}/> :
                        <MessageBox message={e.message} key={index} user={'fromUserInfo' in e ? [e.fromUserInfo.userId, e.fromUserInfo.firstName] : []} isBrainstorm={false} chatId={props.chatId} msgId={'messageId' in e ? e.messageId:''} chatType={props.chatType}/>
                ))}
            </div>
            <div className='InputSection'>
                <MessageInput chatType={props.chatType} chatId={props.chatId} />
            </div>
        </div>
    );
}

export default MessageWindow;
