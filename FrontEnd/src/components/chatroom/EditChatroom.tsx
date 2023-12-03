import { useEffect, useState } from "react";
import { DisplayTypes, ErrorMessages } from "../../models/EnumObjects";
import { chatRoomObject } from "../../models/TypesDefine";
import ApiService from "../../services/ApiService";
import "../../styles/chatroom/Chatroom.css";

interface Props {
  chatRoom: chatRoomObject;
  display: { display: DisplayTypes };
  render: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditChatroom(props: Props) {
  const [style, setStyle] = useState(props.display);
  const [chatRoom, setChatRoom] = useState({ ChatRoomTitle: props.chatRoom.title, ChatRoomDescription: props.chatRoom.description });
  const [showError, setShowError] = useState(DisplayTypes.None);
  const [errorMessage, setErrorMessage] = useState(ErrorMessages.Empty);

  /**
   * Prevent the child from being clicked
   * @param e 
   */
  function handleChildClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  async function handleDeleteChatRoom() {
    const result = await ApiService.DeleteChatRoom(props.chatRoom.id);
    if (result) {
      clearInput();
      handleExit();
    } else {
      setShowError(DisplayTypes.Block);
      setErrorMessage(ErrorMessages.DeleteChatRoomFailed);
    }
  }

  /**
   * This will handle the cancel button
   */
  function handleCancelChatRoom() {
    clearInput();
    handleExit();
  }

  /**
   * This will handle the save button
   */
  async function handleSaveEditChatRoom() {
    if (chatRoom.ChatRoomTitle === "") {
      setShowError(DisplayTypes.Block);
      setErrorMessage(ErrorMessages.TitleEmpty);
      return;
    } else {
      const result = await ApiService.EditChatRoom(props.chatRoom.id, chatRoom.ChatRoomTitle, chatRoom.ChatRoomDescription);

      if (result) {
        clearInput();
        handleExit();
      } else {
        setShowError(DisplayTypes.Block);
        setErrorMessage(ErrorMessages.EditChatRoomFailed);
      }
    }
  }

  /**
     * This will keep track of the inputs and update the state
     * @param value
     */
  function handleChanged(value: React.ChangeEvent<HTMLInputElement>) {
    const id = value.target.className;
    const info = value.target.value;
    setChatRoom((prev: typeof chatRoom) => { return { ...prev, [id]: info } });
    setShowError(DisplayTypes.None);
  }

  /**
   * This will clear the input fields
   */
  function clearInput() {
    (document.getElementById("EditChatroomId") as HTMLFormElement).reset();
    Object.keys(chatRoom).forEach((key) => {
      setChatRoom((prev: typeof chatRoom) => { return { ...prev, [key]: "" } });
    });
  }

  /**
   * This will handle the exit of the edit chatroom window
   */
  function handleExit() {
    setStyle({ display: DisplayTypes.None });
    props.render(prev => !prev);
  }

  useEffect(() => {
    setStyle(props.display);
    setChatRoom({ ChatRoomTitle: props.chatRoom.title, ChatRoomDescription: props.chatRoom.description });
  }, [props.display]);

  return (
    <div className="EditChatRoomContainer" style={style} onClick={() => setStyle({ display: DisplayTypes.None })}>
      <div className="EditChatRoomWindow" onClick={handleChildClick}>
        <div>{chatRoom.ChatRoomTitle}</div>
        <form className="EditChatRoomForm" id="EditChatroomId">
          <input
            className="ChatRoomTitle"
            id="ChatRoomTitle"
            placeholder="ChatRoom Title"
            type="text"
            value={chatRoom.ChatRoomTitle}
            onChange={handleChanged}
          />
          <input
            className="ChatRoomDescription"
            id="ChatRoomDescription"
            placeholder="Description"
            type="text"
            value={chatRoom.ChatRoomDescription}
            onChange={handleChanged}
          />
        </form>
        <div className="ErrorMessage" style={{ display: showError }}>
          <div>{errorMessage}</div>
        </div>
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
    </div>
  );
}

export default EditChatroom;
