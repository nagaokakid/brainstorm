import { useState } from "react";
import {
  DisplayTypes,
  ErrorMessages,
  NoticeMessages,
} from "../models/EnumObjects";
import SignalRChatRoom from "../services/ChatRoomConnection";
import UserInfo from "../services/UserInfo";
import "../styles/HeaderNavBar.css";
import UserProfile from "./UserProfile";
import Profile from "./profile/Profile";

/*
 * HeaderNavBar.tsx
 * -------------------------
 * This component is the header navigation bar of the main page.
 * It contains the user name, join code input field, and the user profile.
 * -----------------------------------------------------------------------
 * Authors:  Mr. Yee Tsung (Jackson) Kao & Mr. Roland Fehr
 * Date:     2021-04-01
 * Version:  1.0
 */
interface HeaderNavBarProps {
  noticeFunction: (msg: NoticeMessages) => void;
  clickedUserProfile: () => void;
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
    await SignalRChatRoom.getInstance().then((value) =>
      value.joinChatRoom(code.value, "First")
    );
    code.value = ""; // Clear the input field
  }

    return (
        <div className="HeaderNavBar">
            <div className="HeaderTitle">BRAINSTORM</div>
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
