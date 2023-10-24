import '../styles/MessageBox.css'
import UserInfo from "../services/UserInfo";

interface MsgBoxProps {
    message: string;
    user: string | null;
}

/**
 * 
 * @param {*} message The message to be displayed 
 * @param {*} user The user that sent the message
 * @returns 
 */
function MsgBox(props: MsgBoxProps) {

    let position: string;

    if (props.user === UserInfo.getUserId()) {
        position = "end";
    }
    else {
        position = "start";
    }

    return (
        <div className="MessageContainer" style={{ justifyContent: position }}>
            <p>{props.message}</p>
        </div>
    );
}

export default MsgBox;