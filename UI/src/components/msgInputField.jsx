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

    const handleSend = () =>
    {
        setText("");

        // create messabe object
        const msg = {
            fromUserInfo : AppInfo.getCurrentFriendlyUserInfo(),
            toUserInfo: toUserInfo ?? groupId,
            message : text,
            timestamp: Date.now().toString()
        }
        // send message
        if(toUserInfo){
            direct.sendMessage(msg)
        } else{
            chatRoom.sendChatRoomMessage(msg)
        }
    };

    const handleKey = (e) =>
    {
        if (e.code === "Enter" || e.code === "NumpadEnter")
        {
            handleSend();
        }
    };

    return (
        <div className="MsgInputContainer">
            <input
                type="text"
                name=""
                id=""
                placeholder="Enter Message..."
                onChange={(e) => setText(e.target.value)}
                value={text}
                onKeyDown={handleKey}
            />
            <div className="send">
                <button onClick={handleSend}>
                    <img src={emailIcon} alt="" />
                </button>
            </div>
        </div>
    );
}

export default msgInputField;