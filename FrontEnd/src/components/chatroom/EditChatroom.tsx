/* eslint-disable react-hooks/exhaustive-deps */
import { MDBInput } from "mdb-react-ui-kit";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useEffect, useState } from "react";
import { useDataContext } from "../../contexts/DataContext";
import { DisplayTypes, ErrorMessages } from "../../models/EnumObjects";
import { chatRoomObject } from "../../models/TypesDefine";
import ApiService from "../../services/ApiService";
import "../../styles/chatroom/EditChatroom.css";

interface Props {
    chatRoom: chatRoomObject;
    display: { display: DisplayTypes };
}

/**
 *  EditChatroom.tsx 
 * -------------------------
 *  This component is the edit chatroom window of the chat page.
 * -----------------------------------------------------------------------
 *  Authors:  Mr. Yee Tsung (Jackson) Kao
 */
function EditChatroom(props: Props) {
    const context = useDataContext();
    const updateWindowFunction = context.updateWindowFunction; // This will update the chatroom window
    const [style, setStyle] = useState(props.display); // This will set the style of the edit chatroom window
    const [chatRoom, setChatRoom] = useState({ ChatRoomTitle: props.chatRoom.title, ChatRoomDescription: props.chatRoom.description });
    const [showError, setShowError] = useState(DisplayTypes.None); // This will display the error message
    const [errorMessage, setErrorMessage] = useState(ErrorMessages.Empty); // This will display the error message

    /**
     * Prevent the child from being clicked
     * @param e 
     */
    function handleChildClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    /**
     * This will handle the leave button
     */
    async function handleLeaveButton() {
        const result = await ApiService.LeaveChatRoom(props.chatRoom.id);
        if (result) {
            clearInput();
            setStyle({ display: DisplayTypes.None });
            updateWindowFunction(true);
        } else {
            setShowError(DisplayTypes.Block);
            setErrorMessage(ErrorMessages.DeleteChatRoomFailed);
        }
    }

    /**
     * This will handle the cancel button
     */
    function handleCancelButton() {
        clearInput();
        handleExit();
    }

    /**
     * This will handle the save button
     */
    async function handleSaveButton() {
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
    function handleInputChange(value: React.ChangeEvent<HTMLInputElement>) {
        const id = value.target.id;
        const info = value.target.value;
        setChatRoom((prev: typeof chatRoom) => { return { ...prev, [id]: info } }); // Update the state
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
    }

    useEffect(() => {
        setStyle(props.display);
        setChatRoom({ ChatRoomTitle: props.chatRoom.title, ChatRoomDescription: props.chatRoom.description });
    }, [props.display]);

    return (
        <div className="edit-chat-room-container" style={style} onClick={() => setStyle({ display: DisplayTypes.None })}>
            <div className="edit-chat-room-window" onClick={handleChildClick}>
                <div className="edit-chat-room-title">{chatRoom.ChatRoomTitle}</div>
                <form className="edit-chat-room-form" id="EditChatroomId">
                    <MDBInput wrapperClass="mb-4" label="Title" id="ChatRoomTitle" type="text" autoComplete="off" value={chatRoom.ChatRoomTitle ?? ""} onChange={handleInputChange} />
                    <MDBInput wrapperClass="mb-4" label="Description" id="ChatRoomDescription" type="text" autoComplete="off" value={chatRoom.ChatRoomDescription ?? ""} onChange={handleInputChange} />
                </form>
                <div className="error-msg" style={{ display: showError }}>
                    <div>{errorMessage}</div>
                </div>
                <div className="edit-chat-room-buttons-container">
                    <button className="leave-chat-room-button" onClick={handleLeaveButton}>
                        Leave
                    </button>
                    <button className="cancel-edit-chat-room-button" onClick={handleCancelButton}>
                        Cancel
                    </button>
                    <button className="save-edit-chat-room-button" onClick={handleSaveButton}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditChatroom;
