import "../styles/HeaderNavBar.css";
import SignalRChatRoom from "../services/ChatRoomConnection";
import { useState } from "react";
import UserInfo from "../services/UserInfo";

interface HeaderNavBarProps {
    noticeFunction: (msg: string) => void;
}

function HeaderNavBar(props: HeaderNavBarProps) {
    const [errorMsg, setErrorMsg] = useState("" as string);
    const [display, setDisplay] = useState("none" as string);

    /**
     * Join the chat room with the given code
     * @returns 
     */
    async function joinCode() {
        if (sessionStorage.getItem("isGuest") !== null) {
            props.noticeFunction("Guest cannot use this feature");
            return;
        }

        const code = document.getElementById("JoinCode") as HTMLInputElement;
        if (code.value === "") {
            setErrorMsg("Please enter a code");
            setDisplay("flex");
            return;
        }
        await SignalRChatRoom.getInstance().then(value => value.joinChatRoom(code.value, "First"));
        code.value = "";
    }

    return (
        <div className="header-nav-bar">
            <div className="user-name">BRAINSTORM</div>
            <div className="JoinCodeSection">
                <input className="JoinCodeInput" type="text" id="JoinCode" placeholder="Chat Room Join Code..." />
                <button className="JoinCodeButton" onClick={() => joinCode()}>Join</button>
                <h5 className="ErrorMsg" style={{ display: display }}>{errorMsg}</h5>
            </div>
            <div className="nav-icons">
                {/* <button className="new-message-button" onClick={() => alert("Not available at the moment")}>New Message</button>
                <button className="notifications-icon" onClick={() => alert("Not available at the moment")}>Notifications</button>
                <button className="picture-button" onClick={() => alert("Not available at the moment")}>User Picture</button> */}
            </div>
            <div className="UserProfile">Current User: {UserInfo.getUserName()}</div>
        </div>
    );
}

export default HeaderNavBar;
