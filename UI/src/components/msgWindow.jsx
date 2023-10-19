/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import MessageBox from "./msgBox";
import AppInfo from "../services/appInfo";

function MsgWindow(props)
{
    // Set the message to the display
    const [messages, setMessages] = useState( props.chatId === "" ? [] : AppInfo.getList(props.chatId, props.chatType) );

    const [display, setDisplay] = useState("column")

    useEffect(() =>
    {
        setMessages(props.chatId === "" ? [] : AppInfo.getList(props.chatId, props.chatType))
        console.log("Message Window Updated")
    }, [props.chatId])

    return (
        <div className="msgWindowContainer">
            {messages.map((e, index) => (
                <MessageBox message={e.message} key={index}/>
            ))}
        </div>
    );
}

export default MsgWindow;