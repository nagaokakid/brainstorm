import "../styles/MessageBox.css";
import UserInfo from "../services/UserInfo";
import SignalRChatRoom from "../services/ChatRoomConnection";

interface MsgBoxProps {
  message: string;
  user: string[];
  isBrainstorm?: boolean;
  bsId?: string;
  msgId: string;
  chatId: string;
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

  function handleRemoveChatRoom() {
    SignalRChatRoom.getInstance().then((value) => {
      console.log("handle" + props.chatId + props.msgId);
      
      value.removeChatRoomMessage(props.chatId, props.msgId);
    });
  }

  return (
    <div className="MessageContainer" style={{ justifyContent: position }}>
      <div className="MessageWrapper">
        <div className="MessageHeader">
          <div className="MessageUsername">{props.user[1]}</div>

          <img
            className="MessageImage"
            src="src\assets\delete.png"
            onClick={() => {
              console.log("Delete Message");
              handleRemoveChatRoom();
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
