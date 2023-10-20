/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import MessageBox from "./msgBox";
import AppInfo from "../services/appInfo";

function MsgWindow(props)
{
    // Set the message to the display
    const [messages, setMessages] = useState([]);
    const [count, setCount] = useState(AppInfo.loginRegisterResponse.chatRooms[0].messages.length);
    console.log(props.chatId);

    useEffect(() =>
    {
        setMessages(props.chatId === "" ? [] : AppInfo.getList(props.chatId, props.chatType));
    }, [props.chatId, props.chatType, count]);

    return (
        <div className="msgWindowContainer">
            {messages.map((e, index) => (
                <MessageBox message={e.message} key={index}/>
            ))}
        </div>
    );
}

export default MsgWindow;