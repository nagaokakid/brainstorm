import { faEnvelope, faSignOutAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { TabTypes } from '../models/EnumObjects';
import SignalRChatRoom from "../services/ChatRoomConnection";
import SignalRDirect from "../services/DirectMessageConnection";
import "../styles/NavigationBar.css";

/* 
 * NavigationBar.tsx
    * -------------------------
    * This component is the navigation bar of the chat page.
    * It contains the navigation buttons for the user to navigate between the chat room list and direct message list.
    * ----------------------------------------------------------------------------------------------------------------
    * Authors:  Ravdeep Singh
    * Date Created:  01/12/2023
    * Last Modified: 01/12/2023
    * Version: 1.0
    */

interface NavigationBarProps {
    selectFunction: (tab: TabTypes) => void;
    activeTab: TabTypes;
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
        <div className="NavBar">
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
            <button
                className={`NavBtn ${props.activeTab === TabTypes.ChatRoom ? 'active' : ''}`}
                onClick={() => props.selectFunction(TabTypes.ChatRoom)}
                
            >
                <FontAwesomeIcon icon={faUsers} title="Group Chat" />
            </button>
            <button
                className={`NavBtn ${props.activeTab === TabTypes.DiretMessage ? 'active' : ''}`}
                onClick={() => props.selectFunction(TabTypes.DiretMessage)}
                
            >
                <FontAwesomeIcon icon={faEnvelope} title="Direct Message" />
            </button>
            <button className="NavBtn" onClick={() => logOut()}><FontAwesomeIcon icon={faSignOutAlt} title="Log Out" /></button>
        </div>
    );
}

export default NavigationBar;
