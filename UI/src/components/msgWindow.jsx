import { useState } from "react";
import MessageBox from "./msgBox";

function msgWindow(connection)
{
    const conn = connection
    const [messages, setMessages] = useState([{id: "1", msg: "Hello World!"}, {id: "2", msg: "Hello World!"}, {id: "3", msg: "Hello World!"}, {id: "4", msg: "Hello World!"}, {id: "5", msg: "Hello World!"}, {id: "6", msg: "Hello World!"}, {id: "7", msg: "Hello World!"}, {id: "8", msg: "Hello World!"}, {id: "9", msg: "Hello World!"}, {id: "10", msg: "Hello World!"}, {id: "11", msg: "Hello World!"}, {id: "12", msg: "Hello World!"}, {id: "13", msg: "Hello World!"}, {id: "14", msg: "Hello World!"}, {id: "15", msg: "Hello World!"}, {id: "16", msg: "Hello World!"}, {id: "17", msg: "Hello World!"}, {id: "18", msg: "Hello World!"}, {id: "19", msg: "Hello World!"}, {id: "20", msg: "Hello World!"}, {id: "21", msg: "Hello World!"}, {id: "22", msg: "Hello World!"}, {id: "23", msg: "Hello World!"}, {id: "24", msg: "Hello World!"}, {id: "25", msg: "Hello World!"}, {id: "26", msg: "Hello World!"}, {id: "27", msg: "Hello World!"}, {id: "28", msg: "Hello World!"}, {id: "29", msg: "Hello World!"}, {id: "30", msg: "Hello World!"}]);

    return (
        <div className="msgWindowContainer">
            {messages.map((e) => (
                <MessageBox message={e.msg} key={e.id} />
            ))}
        </div>
    );
}

export default msgWindow;