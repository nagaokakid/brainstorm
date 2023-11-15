import "../styles/MessageInput.css";
import UserInfo from "../services/UserInfo";
import emailIcon from "../assets/email.png";
import SignalRDirect from "../services/DirectMessageConnection";
import SignalRChatRoom from "../services/ChatRoomConnection";
import React, { useEffect, useState } from "react";

interface MsgInputFieldProps {
    chatType: string;
    chatId: string;
}

function MsgInputField(props: MsgInputFieldProps) {
    const [text, setText] = useState("" as string); // Set the default state of the text

    /**
     * Handle the send button click event
     * @returns 
     */
    function handleSend() {

        if (!text) {
            return;
        } else {
            if (props.chatType === "Direct Message List") {
                const msg = {
                    user1: UserInfo.getUserInfo(),
                    user2: { userId: props.chatId, firstName: "", lastName: "" },
                    message: text,
                };
                SignalRDirect.getInstance().then(async (value) => {
                    await value.sendMessage(msg);
                });
            }
            else if (props.chatType === "ChatRoom List") {
                const msg = {
                    fromUserInfo: UserInfo.getUserInfo(),
                    chatRoomId: props.chatId,
                    message: text,
                    timestamp: new Date().toUTCString(),
                };
                SignalRChatRoom.getInstance().then(async (value) => {
                    await value.sendChatRoomMessage(msg);
                });
            }
            setText("");
        }
    }

    /**
     * Handle the key down event
     * @param e 
     */
    function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.code === "Enter" || e.code === "NumpadEnter") {
            handleSend();
        }
    }

    useEffect(() => {
        setText("");
    }, [props.chatId]);

    return (
        <div className="MsgInputContainer">
            <input
                type="text"
                id=""
                placeholder="Enter Message here..."
                onChange={(e) => setText(e.target.value)}
                value={text}
                onKeyDown={handleKey}
            />
            <div className="send">
                <button onClick={handleSend}>
                    <img src={emailIcon} alt="Send" />
                </button>
            </div>
        </div>
    );
}

export default MsgInputField;
