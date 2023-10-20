import { useEffect, useState } from "react";
import MessageBox from "./msgBox";
import AppInfo from "../services/appInfo";

function msgWindow(props)
{
    const [messages, setMessages] = useState( props.chatId === "No Selected Chat" ? [{}] : AppInfo.getList(props.chatId, props.chatType) );

    useEffect(() =>
    {
        setMessages(props.chatId === "No Selected Chat" ? [{}] : AppInfo.getList(props.chatId, props.chatType))
    }, [props.chatId])

    return (
        <div className="msgWindowContainer">
            {messages.map((e) => (
                <MessageBox message={e.message} key={e.id} />
            ))}
        </div>
    );
}

export default msgWindow;