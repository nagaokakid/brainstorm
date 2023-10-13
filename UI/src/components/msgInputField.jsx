import { useState } from 'react';
import emailIcon from '../assets/email.png';
import '../styles/msgInputField.css';

function msgInputField()
{
    const [text, setText] = useState("");

    const handleSend = () =>
    {
        setText("");
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