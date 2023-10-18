import { useEffect, useState } from "react";
import MessageBox from "./msgBox";
import AppInfo from "../services/appInfo";

function msgWindow(props)
{
    // Set the message to the display
    const [messages, setMessages] = useState( props.chatId === "No Selected Chat" ? [] : AppInfo.getList(props.chatId, props.chatType) );

    useEffect(() =>
    {
        setMessages(props.chatId === "No Selected Chat" ? [] : AppInfo.getList(props.chatId, props.chatType))
        console.log("Message Window Updated")
    }, [props.chatId, AppInfo.loginRegisterResponse.chatRooms])

    return (
        <div className="msgWindowContainer">
            {messages.map((e, index) => (
                <MessageBox message={e.message} key={index} />
            ))}
        </div>
    );
}

export default msgWindow;