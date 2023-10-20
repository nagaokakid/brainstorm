/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import MessageBox from "./msgBox";
import AppInfo from "../services/appInfo";

function MsgWindow(props)
{
    // Set the message to the display
    const [messages, setMessages] = useState([]);

    useEffect(() =>
    {
        setMessages(props.chatId === "" ? [] : AppInfo.getList(props.chatId, props.chatType));
    }, [props.chatId, props.chatType]);

    return (
        <div className="msgWindowContainer">
            {messages.map((e, index) => (
                <MessageBox message={e.message} key={index} user={ e.fromUserInfo ? e.fromUserInfo.userId : null}/>
            ))}
        </div>
    );
}

export default MsgWindow;