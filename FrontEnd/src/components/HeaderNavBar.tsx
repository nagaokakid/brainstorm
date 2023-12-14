import {
	MDBInput
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
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

interface HeaderNavBarProps {
	noticeFunction: (msg: NoticeMessages) => void;
	clickedUserProfile: () => void;
}

/**
 * HeaderNavBar.tsx
 * -------------------------
 * This component is the header navigation bar of the main page.
 * It contains the user name, join code input field, and the user profile.
 * -----------------------------------------------------------------------
 * Authors:  Mr. Yee Tsung (Jackson) Kao & Mr. Roland Fehr
 */
function HeaderNavBar(props: HeaderNavBarProps) {
	const [joinChatCode, setJoinChatCode] = useState(""); // Set the join chat code
	const [errorMsg, setErrorMsg] = useState<ErrorMessages | NoticeMessages>(ErrorMessages.Empty); // Set the error message
	const [display, setDisplay] = useState(DisplayTypes.None); // Set the display of the error message

	/**
	 * Join the chat room with the given code
	 * @returns
	 */
	async function joinCode() {
		setDisplay(DisplayTypes.None);
		if (sessionStorage.getItem("isGuest") !== null) {
			props.noticeFunction(NoticeMessages.FeatureRestricted);
			return;
		}

		const button = document.getElementsByClassName("join-code-button")[0] as HTMLButtonElement;
		button.disabled = true; // Disable the button to prevent spamming
		if (joinChatCode === "") { // Check if the input is empty
			setErrorMsg(ErrorMessages.FormIncomplete);
			setDisplay(DisplayTypes.Flex);
			button.disabled = false;
		} else if (UserInfo.getChatRoomByCode(joinChatCode)) { // Check if the user is already in the chat room
			setErrorMsg(NoticeMessages.AlreadyInChatRoom);
			setDisplay(DisplayTypes.Flex);
			button.disabled = false;
		} else {
			await SignalRChatRoom.getInstance().then(async (value) => {
				await value.joinChatRoom(joinChatCode, "First")
			});
			button.disabled = false;
		}
		setJoinChatCode("");
		(document.getElementById("JoinCodeForm") as HTMLFormElement).reset(); // Reset the form
		return;
	}

	/**
	 * Handle the enter key press
	 * @param value
	 */
	function handleKey(value: React.KeyboardEvent<HTMLInputElement>) {
		if (value.key === "Enter" || value.key === "NumpadEnter") {
			joinCode();
		}
	}

	return (
		<div className="header-navbar" >
			<div className="header-title">BRAINSTORM</div>
			<div className="code-input-section">
				<form id='JoinCodeForm' onSubmit={(e) => e.preventDefault()}>
					<MDBInput wrapperClass='mb-4' label='Chat Room Join Code...' id='JoinCode' type='text' autoComplete='off' value={joinChatCode} onChange={(e) => setJoinChatCode(e.target.value)} onKeyDown={handleKey} />
				</form>
				<button className="join-code-button" onClick={joinCode}>Join</button>
				<h5 className="error-msg" style={{ display: display }}>{errorMsg}</h5>
			</div>
			<div className="user-profile" onClick={props.clickedUserProfile}>
				<UserProfile />
			</div>
		</div>
	);
}

export default HeaderNavBar;
