import ApiService from "../services/ApiService";
import SignalRChatRoom from "../services/ChatRoomConnection";
import "../styles/HeaderNavBar.css";

/**
 * 
 * @returns The header navigation bar of the application
 */
function HeaderNavBar() {

    async function joinCode() {
        const code = document.getElementById("JoinCode") as HTMLInputElement;
        await SignalRChatRoom.getInstance().then(value => value.joinChatRoom(code.value, "First"));
    }

    return (
        <div className="header-nav-bar">
            {/* To-do: Add refresh function in the website name*/}
            <div className="user-name">BRAINSTORM</div>
            <div className="JoinCodeSection">
                <input className="JoinCodeInput" type="text" id="JoinCode" />
                <button className="JoinCodeButton" onClick={() => joinCode()}>Join</button>
            </div>
            <div className="nav-icons">
                <button className="new-message-button" onClick={() => alert("Not available at the moment")}>New Message</button>
                <button className="notifications-icon" onClick={() => alert("Not available at the moment")}>Notifications</button>
                <button className="picture-button" onClick={() => alert("Not available at the moment")}>User Picture</button>
            </div>
        </div>
    );
}

export default HeaderNavBar;
