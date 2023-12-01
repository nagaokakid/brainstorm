import { useState } from "react";
import { DisplayTypes, ErrorMessages, NoticeMessages } from "../models/EnumObjects";
import SignalRChatRoom from "../services/ChatRoomConnection";
import UserInfo from "../services/UserInfo";
import "../styles/HeaderNavBar.css";
import UserProfile from "./UserProfile";

interface HeaderNavBarProps {
    noticeFunction: (msg: NoticeMessages) => void;
}

function HeaderNavBar(props: HeaderNavBarProps) {
    const [errorMsg, setErrorMsg] = useState(ErrorMessages.Empty);
    const [display, setDisplay] = useState(DisplayTypes.None);

    /**
     * Join the chat room with the given code
     * @returns 
     */
    async function joinCode() {
        if (sessionStorage.getItem("isGuest") !== null) {
            props.noticeFunction(NoticeMessages.FeatureRestricted);
            return;
        }

        const code = document.getElementById("JoinCode") as HTMLInputElement;
        if (code.value === "") {
            setErrorMsg(ErrorMessages.FormIncomplete);
            setDisplay(DisplayTypes.Flex);
            return;
        }
        await SignalRChatRoom.getInstance().then(value => value.joinChatRoom(code.value, "First"));
        code.value = ""; // Clear the input field
    }

    return (
        <div className="header-nav-bar">
            <div className="user-name">BRAINSTORM</div>
            <div className="JoinCodeSection">
                <input className="JoinCodeInput" type="text" id="JoinCode" placeholder="Chat Room Join Code..." />
                <button className="JoinCodeButton" onClick={() => joinCode()}>Join</button>
                <h5 className="ErrorMsg" style={{ display: display }}>{errorMsg}</h5>
            </div>
            <div className="UserProfile">
                <UserProfile user={UserInfo.getUserInfo()} />
            </div>
        </div>
    );
}

export default HeaderNavBar;
