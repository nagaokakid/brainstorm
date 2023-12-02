import delereImage from "../assets/delete.png";
import { TabTypes } from "../models/EnumObjects";
import SignalRChatRoom from "../services/ChatRoomConnection";
import SignalRDirect from "../services/DirectMessageConnection";
import UserInfo from "../services/UserInfo";
import "../styles/MessageBox.css";

/*
  * MessageBox.tsx
  * -------------------------
  * This component is the message box of the chat room.
  * -----------------------------------------------------------------------
  * Authors:  Mr. Yee Tsung (Jackson) Kao & Mr. Roland Fehr
  * Date Created:  01/12/2023
  * Last Modified: 01/12/2023
  * Version: 1.0
*/
interface MsgBoxProps {
  message: string;
  user: string[];
  isBrainstorm?: boolean;
  bsId?: string;
  msgId: string;
  chatId: string; // chatId is the id of the chatroom or the id of the user that the msg going to send to.
  chatType: TabTypes;
}

function MsgBox(props: MsgBoxProps) {
  let position: string;

  // Check if the message is sent by the current user
  if (props.user[0] === UserInfo.getUserId()) {
    position = "end";
  } else {
    position = "start";
  }

  function handleJoinBrainstorm() {
    SignalRChatRoom.getInstance().then((value) => {
      value.joinBrainstormSession(props.bsId ?? "");
    });
  }

  function handleRemoveMessage() {
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
    <div className="MessageContainer" style={{ justifyContent: position }}>
      <div className="MessageWrapper">
        <div className="MessageHeader">
          <div className="MessageUsername">{props.user[1]}</div>
          <img
            className="MessageImage"
            src={delereImage}
            onClick={() => {
              handleRemoveMessage();
            }}
          />
        </div>
        <div className="Message">
          {props.isBrainstorm ? (
            <p>
              <div className="MessageIsBrainstorm">
                {props.user[1] +
                  " invited you to join the brainstorm session ->"}
                <button
                  className="MessageJoinBS"
                  onClick={handleJoinBrainstorm}
                >
                  Click To Join
                </button>
              </div>
            </p>
          ) : (
            <p>{props.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MsgBox;
