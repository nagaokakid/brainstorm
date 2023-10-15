import { useState } from 'react';
import emailIcon from '../assets/email.png';
import '../styles/msgInputField.css';
import SignalRDirect from '../services/directMessageConnection';
import SignalRChatRoom from '../services/chatRoomConnection';
import AppInfo from '../services/appInfo';

function msgInputField(toUserInfo, groupId)
{
    const direct = SignalRDirect.getInstance()
    const chatRoom = SignalRChatRoom.getInstance()
    const [text, setText] = useState("");

    // Send message
    const handleSend = () =>
    {
        // check if text is empty
        if (!text) return;

        // create message object
        const msg = {
            fromUserInfo : AppInfo.getCurrentFriendlyUserInfo(),
            toUserInfo: toUserInfo ? toUserInfo : groupId,
            message : text,
            timestamp: Date.now().toString()
        }

        // send message
        if(toUserInfo){
            direct.sendMessage(msg)
        } else{
            chatRoom.sendChatRoomMessage(msg)
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