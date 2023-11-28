import "../styles/NavigationBar.css";
import SignalRChatRoom from "../services/ChatRoomConnection";
import SignalRDirect from "../services/DirectMessageConnection";
import { useNavigate } from 'react-router-dom';

interface NavigationBarProps {
    selectFunction: (tab: string) => void;
}

function NavigationBar(props: NavigationBarProps) {
    const navigate = useNavigate();

    /**
     * Logs the user out of the application and remove the token from the local storage
     */
    async function logOut() {
        await SignalRChatRoom.getInstance().then((value) => value.reset());
        await SignalRDirect.getInstance().then((value) => value.reset());
        sessionStorage.clear();
        navigate("/");
    }

    return (
        <div className="navigation-bar">
            <button className="nav-button" onClick={() => props.selectFunction("ChatRoom List")}>Chat Rooms</button>
            <button className="nav-button" onClick={() => props.selectFunction("Direct Message List")}>Direct Message</button>
            {/* <button className="nav-button" onClick={() => alert("Not available at the moment")}>BrainStorm Session History</button>
            <button className="nav-button" onClick={() => alert("Not available at the moment")}>Settings</button> */}
            <button className="nav-button" onClick={() => logOut()}>Logout</button>
        </div>
    );
}

export default NavigationBar;