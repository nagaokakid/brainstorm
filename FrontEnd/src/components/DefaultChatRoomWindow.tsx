import "../styles/DefaultChatRoomLayout.css";

interface DefaultChatRoomProps {
    displayTab: string;
    handleFunction: () => void
}

function DefaultChatRoomWindow(props: DefaultChatRoomProps) {
  return (
    <div >
        <img className="brainstormIcon" src="/src/assets/icon.svg"/>
        <h3>Welcome to Brainstorm</h3>
        <p>Discuss and Vote ideas with your team</p>
        <div className="CreateChatRoomButton" style={props.displayTab === "Direct Message List" ? { display: "none" } : { display: "flex" }}>
            <button onClick={props.handleFunction}>Create Chat Room</button>
        </div>
    </div>
  );
}

export default DefaultChatRoomWindow;
