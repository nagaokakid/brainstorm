import "../styles/DefaultChatRoomLayout.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

interface DefaultChatRoomProps {
    displayTab: string;
    handleFunction: () => void
}

function DefaultChatRoomWindow(props: DefaultChatRoomProps) {
  return (
    <div className="DefaultChatRoomLayout">
        <FontAwesomeIcon icon={faBolt} title="brainstorm icon" className="brainstormIcon"/>
        <h2>Welcome to Brainstorm</h2>
        <p>Discuss and Vote ideas with your team</p>
        <div className="CreateChatRoomButton" style={props.displayTab === "Direct Message List" ? { display: "none" } : { display: "flex" }}>
          <button onClick={props.handleFunction}>Create Chat Room</button>
        </div>
    </div>
  );
}

export default DefaultChatRoomWindow;
