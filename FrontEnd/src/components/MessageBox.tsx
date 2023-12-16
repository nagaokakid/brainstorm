import delereImage from "../assets/delete.png";
import { TabTypes } from "../models/EnumObjects";
import SignalRChatRoom from "../services/ChatRoomConnection";
import SignalRDirect from "../services/DirectMessageConnection";
import UserInfo from "../services/UserInfo";
import "../styles/MessageBox.css";

interface MsgBoxProps {
    message: string;
    user: string[];
    isBrainstorm?: boolean;
    bsId?: string;
    msgId: string;
    chatId: string; // chatId is the id of the chatroom or the id of the user that the msg going to send to.
    chatType: TabTypes;
}

/**
 * MessageBox.tsx
 * -------------------------
 * This component is the message box of the chat room.
 * -----------------------------------------------------------------------
 * Authors:  Mr. Yee Tsung (Jackson) Kao & Mr. Roland Fehr
 */
function MsgBox(props: MsgBoxProps) {
    let position: string;

    // Check if the message is sent by the current user
    if (props.user[0] === UserInfo.getUserId()) {
        position = "end";
    } else {
        position = "start";
    }

    /**
     * This function is to handle the join brainstorm session button.
     */
    function handleJoinBrainstormButton() {
        SignalRChatRoom.getInstance().then((value) => {
            value.joinBrainstormSession(props.bsId ?? "");
        });
    }

    /**
     * This function is to handle the remove message button.
     */
    function handleRemoveMessageButton() {
        if (props.user[0] === UserInfo.getUserId()) {
            if (props.chatType === TabTypes.ChatRoom) {
                SignalRChatRoom.getInstance().then((value) => {
                    value.removeChatRoomMessage(props.chatId, props.msgId);
                });
            } else {
                SignalRDirect.getInstance().then((value) => {
                    value.removeDirectMessage(props.chatId, props.msgId);
                });
            }
        }
    }

    return (
        <div className="message-box-container" style={{ justifyContent: position }}>
            <div className="message-box-wrapper">
                <div className="message-box-header">
                    <div className="message-box-username">{props.user[1]}</div>
                    <img
                        className="message-box-image"
                        src={delereImage}
                        onClick={() => {
                            handleRemoveMessageButton();
                        }}
                    />
                </div>
                <div className="message-box">
                    {props.isBrainstorm ? (
                        <div className="message-box-bs">
                            <div className="message-isbrainstorm">
                                {props.user[1] +
                                    " invited you to join the brainstorm session"}
                                <button
                                    className="message-join-bs-button"
                                    onClick={handleJoinBrainstormButton}
                                >
                                    Join
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>{props.message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MsgBox;
