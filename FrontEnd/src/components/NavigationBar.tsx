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

    function handleHover(event: React.MouseEvent<HTMLButtonElement>) {
        const hoverText = document.createElement('div');
        hoverText.classList.add('hover-text');
        hoverText.textContent = (event.target as HTMLButtonElement).getAttribute('title');
        document.body.appendChild(hoverText);

        function updatePosition(event: MouseEvent) {
            hoverText.style.top = `${event.clientY}px`;
            hoverText.style.left = `${event.clientX}px`;
        }

        function removeHoverText() {
            document.body.removeChild(hoverText);
        }

        document.addEventListener('mousemove', updatePosition);
        document.addEventListener('mouseout', removeHoverText);
    }

    return (
        <div className="navigation-bar">
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
            <button className="nav-button" onClick={() => props.selectFunction("ChatRoom List")} onMouseOver={handleHover}><FontAwesomeIcon icon={faUsers} title="Group Chat" /></button>
            <button className="nav-button" onClick={() => props.selectFunction("Direct Message List" )}onMouseOver={handleHover}><FontAwesomeIcon icon={faEnvelope} title="Direct Message"  /></button>
            {/* <button className="nav-button" onClick={() => alert("Not available at the moment")}>BrainStorm Session History</button>
            <button className="nav-button" onClick={() => alert("Not available at the moment")}>Settings</button> */}
            <button className="nav-button" onClick={() => logOut()} onMouseOver={handleHover}><FontAwesomeIcon icon={faSignOutAlt} title="Log Out" /></button>
        </div>
    );
}

export default NavigationBar;
