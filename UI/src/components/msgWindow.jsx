import { useEffect, useState } from "react";
import MessageBox from "./msgBox";

function msgWindow(props)
{
    const conn = props.connection
    var count = 1;
    const [messages, setMessages] = useState([{}]);

    useEffect(() => {
        setMessages([{msg:"Loading...", id:0}]);
        console.log("useEffect");
    }, [props.chatId]);
    
    return (
        <div className="msgWindowContainer">
            {messages.map((e) => (
                <MessageBox message={e.msg} key={e.id} />
            ))}
        </div>
    );
}

export default msgWindow;