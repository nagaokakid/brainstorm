import { useEffect, useState } from "react";
import "../../styles/chatroom/Chatroom.css";
import ApiService from "../../services/ApiService";

interface Props {
  chatRoomId: string;
  title: string;
  description: string;
  clickedExit: () => void;
}

const EditChatroom = (props: Props) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  async function handleDeleteChatRoom() {
    await ApiService.DeleteChatRoom(props.chatRoomId);
    props.clickedExit();
    clearInput();
  }

  function handleCancelChatRoom() {
    props.clickedExit();
    clearInput();
  }

  async function handleSaveEditChatRoom() {
    await ApiService.EditChatRoom(props.chatRoomId, title, description);
    props.clickedExit();
    clearInput();
  }

  function clearInput() {
    (document.getElementById("EditChatroomId") as HTMLFormElement).reset();
  }

  useEffect(() => {
    setTitle(props.title);
    setDescription(props.description);
  }, []);

  return (
    <div className="EditChatRoomWindoww">
      <div>{title}</div>
      <form className="RegisterForm" id="EditChatroomId">
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
          onClick={handleDeleteChatRoom}
        >
          Delete
        </button>
        <button
          className="CancelEditChatRoomButton"
          onClick={handleCancelChatRoom}
        >
          Cancel
        </button>
        <button
          className="SaveEditChatRoomButton"
          onClick={handleSaveEditChatRoom}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditChatroom;
