/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/MessageWindow.css";
import MessageBox from "./MessageBox";
import UserInfo from "../services/UserInfo";
import MessageInput from "./MessageInput";
import { brainstormDTO, chatRoomMessageObject } from "../models/TypesDefine";
import { useDataContext } from "../contexts/DataContext";
import { useEffect, useState } from "react";

interface MessageWindowProps {
    chatId: string;
    chatType: string;
}

function MessageWindow(props: MessageWindowProps) {
    const context = useDataContext();
    const msg = context[0];
    const [messages, setMessages] = useState([] as (chatRoomMessageObject | { message: string, timestamp: string, brainstormDTO?: brainstormDTO })[]); // Set the message to the display

    useEffect(() => {
        setMessages(UserInfo.getMessageHistory(props.chatId, props.chatType));
    }, [props.chatId, msg]);

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
