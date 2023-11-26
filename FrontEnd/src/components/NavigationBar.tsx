import React from 'react';
import "../styles/NavigationBar.css";
import SignalRChatRoom from "../services/ChatRoomConnection";
import SignalRDirect from "../services/DirectMessageConnection";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

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
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
            <button className="nav-button" onClick={() => props.selectFunction("ChatRoom List")}><FontAwesomeIcon icon={faUsers} /></button>
            <button className="nav-button" onClick={() => props.selectFunction("Direct Message List")}><FontAwesomeIcon icon={faEnvelope} /></button>
            {/* <button className="nav-button" onClick={() => alert("Not available at the moment")}>BrainStorm Session History</button>
            <button className="nav-button" onClick={() => alert("Not available at the moment")}>Settings</button> */}
            <button className="nav-button" onClick={() => logOut()}><FontAwesomeIcon icon={faSignOutAlt} /></button>
        </div>
    );
}

export default NavigationBar;
