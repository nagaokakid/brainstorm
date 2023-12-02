import { useEffect, useState } from "react";
import "../../styles/chatroom/Chatroom.css";

interface Props {
  title: string;
  description: string;
  clickedExit: () => void;
}
const EditChatroom = (props: Props) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    setTitle(props.title);
    setDescription(props.description);
  }, []);

  return (
    <div className="EditChatRoomWindoww">
      <div>{title}</div>
      <form className="RegisterForm" id="RegisterForm">
        <input
          className="Username"
          id="Username1"
          placeholder="ChatRoom Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="FirstName"
          id="FirstName"
          placeholder="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </form>
      <div className="EditChatRoomButtonsContainer">
        <button
          className="DeleteEditChatRoomButton"
          onClick={props.clickedExit}
        >
          Delete
        </button>
        <button
          className="CancelEditChatRoomButton"
          onClick={props.clickedExit}
        >
          Cancel
        </button>
        <button className="SaveEditChatRoomButton" onClick={props.clickedExit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditChatroom;
