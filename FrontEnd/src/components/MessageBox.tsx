import "../styles/MessageBox.css";
import UserInfo from "../services/UserInfo";
import SignalRChatRoom from "../services/ChatRoomConnection";

interface MsgBoxProps {
  message: string;
  user: string[];
  isBrainstorm?: boolean;
  bsId?: string;
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

  return (
    <div className="MessageContainer" style={{ justifyContent: position }}>
      <div className="MessageWrapper">
        <div className="MessageUsername">{props.user[1]}</div>
        <div className="Message">
          {props.isBrainstorm ? (
            <p>
              {props.user[1] + " invited you to join the brainstorm session ->"}
              <button className="MessageJoinBS" onClick={handleJoinBrainstorm}>Click To Join</button>
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
