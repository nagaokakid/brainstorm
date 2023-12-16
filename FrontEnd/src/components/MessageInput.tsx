import React, { useEffect, useState } from "react";
import emailIcon from "../assets/email.png";
import { KeyDown, TabTypes } from "../models/EnumObjects";
import SignalRChatRoom from "../services/ChatRoomConnection";
import SignalRDirect from "../services/DirectMessageConnection";
import UserInfo from "../services/UserInfo";
import "../styles/MessageInput.css";

interface MsgInputFieldProps {
    chatType: TabTypes;
    chatId: string;
}

/**
 * MessageInput.tsx
 * -------------------------
 * This component is the message input field of the chat room.
 * -----------------------------------------------------------------------
 * Author:  Mr. Yee Tsung (Jackson) Kao
 */
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
            if (props.chatType === TabTypes.DiretMessage) {
                const msg = {
                    user1: UserInfo.getUserInfo(),
                    user2: { userId: props.chatId, firstName: "", lastName: "" },
                    message: text,
                };
                SignalRDirect.getInstance().then(async (value) => {
                    await value.sendMessage(msg);
                });
            }
            else if (props.chatType === TabTypes.ChatRoom) {
                const msg = {
                    messageId: "",
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
        if (e.code === KeyDown.Enter || e.code === KeyDown.NumpadEnter) {
            handleSend();
        }
    }

    /**
     * Clear the text when the chat room is changed
     */
    useEffect(() => {
        setText("");
    }, [props.chatId]);

    return (
        <div className="msg-input-container">
            <input
                type="text"
                id=""
                placeholder="Enter Message here..."
                onChange={(e) => setText(e.target.value)}
                value={text}
                onKeyDown={handleKey}
            />
            <div className="msg-input-send">
                <button onClick={handleSend}>
                    <img src={emailIcon} alt="Send" />
                </button>
            </div>
        </div>
    );
}

export default MsgInputField;
