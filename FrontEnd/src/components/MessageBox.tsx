import '../styles/MessageBox.css'
import UserInfo from "../services/UserInfo";
import SignalRChatRoom from '../services/ChatRoomConnection';

interface MsgBoxProps {
    message: string,
    user: string[],
    isBrainstorm?: boolean,
    bsId?: string,
}

/**
 * 
 * @param {*} message The message to be displayed 
 * @param {*} user The user that sent the message
 * @returns 
 */
function MsgBox(props: MsgBoxProps) {

    let position: string;

    if (props.user[0] === UserInfo.getUserId()) {
        position = "end";
    } else {
        position = "start";
    }

    function handleJoinBrainstorm() {
        console.log("Joining brainstorm session");
        
        SignalRChatRoom.getInstance().then((value) => {
            value.joinBrainstormSession(props.bsId ?? "");
        });
    }

    return (
        <div className="MessageContainer" style={{ justifyContent: position }}>
            {props.isBrainstorm ? <p>{props.user[1] + " Invite you to Join the brainstorm session"}<button onClick={handleJoinBrainstorm}>{props.message}</button></p> : <p>{props.user[1] ? props.user[1] : ""}{props.message}</p>}
        </div>
    );
}

export default MsgBox;