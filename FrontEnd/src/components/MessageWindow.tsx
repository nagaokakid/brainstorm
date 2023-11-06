/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/MessageWindow.css";
import MessageBox from "./MessageBox";
import UserInfo from "../services/UserInfo";
import MessageInput from "./MessageInput";
import { useDataContext } from "../contexts/DataContext";
import { useEffect, useState } from "react";
import { chatRoomMessageObject } from "../services/TypesDefine";

interface MessageWindowProps {
    chatId: string;
    chatType: string;
}

/**
 * 
 * @param {*} chatId The message's id history to be displayed
 * @param {*} chatType The type of chat list to be displayed; either "Direct Message List" or "ChatRoom List"
 * @returns 
 */
function MessageWindow(props: MessageWindowProps) {

    const context = useDataContext();
    const msg = context[0];

    // Set the message to the display
    const [messages, setMessages] = useState<[] | chatRoomMessageObject[] | { message: string, timestamp: string }[]>([]);

    useEffect(() => {
        setMessages(UserInfo.getListHistory(props.chatId, props.chatType));
    }, [props.chatId, msg]);

    return (
        <div className="MsgWindowContainer">
            <div className="MsgSection">
                {messages.map((e, index) => (
                    <MessageBox message={e.message} key={index} user={'fromUserInfo' in e ? e.fromUserInfo.userId : null} />
                ))}
            </div>
            <div className='InputSection'>
                <MessageInput chatType={props.chatType} chatId={props.chatId} />
            </div>
        </div>
    );
}

export default MessageWindow;
