import { useContext, useState } from "react";
import MessageBox from "./msgBox";

function msgWindow(context)
{
    const [messages, setMessages] = useState([]);

    context.useSignalREffect (
        "event name", // Your Event Key
        (message) => {
            setMessages([...messages, message]);
        },
    );

    return (
        <div className="msgWindowContainer">
            {messages.map((msg) => (
                <MessageBox message={msg} key={msg.id} />
            ))}
        </div>
    );
}

export default msgWindow;