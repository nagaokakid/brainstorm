import { useEffect, useState } from 'react';
import emailIcon from '../assets/email.png';
import '../styles/msgInputField.css';
import AppInfo from '../services/appInfo';

function msgInputField(props)
{
    const connection = props.connection.getInstance()
    const [text, setText] = useState("");

    // Send message
    const handleSend = () =>
    {
        // check if text is empty
        if (!text) return;

        // create message object
        const msg = {
            fromUserInfo : AppInfo.getCurrentFriendlyUserInfo(),
            toUserInfo: [props.chatId],
            message : text,
            timestamp: Date.now().toString()
        }

        // send message
        if(toUserInfo){
            connection.sendMessage(msg)
        } else{
            connection.sendChatRoomMessage(msg)
        }

        setText("");
    };

    // Send message on enter key
    const handleKey = (e) =>
    {
        if (e.code === "Enter" || e.code === "NumpadEnter")
        {
            handleSend();
        }
    };

    useEffect(() => {
        setText("");
    }, [props.chatId, props.connection])

    return (
        <div className="MsgInputContainer">
            <input type="text" id="" placeholder="Enter Message here..." onChange={(e) => setText(e.target.value)} value={text} onKeyDown={handleKey}/>
            <div className="send">
                <button onClick={handleSend}>
                    <img src={emailIcon} alt="Send" />
                </button>
            </div>
        </div>
    );
}

export default msgInputField;