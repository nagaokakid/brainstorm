import "../styles/ChatList.css";
import UserInfo from "../services/UserInfo";
import CreateRoomCustomize from "./CreateRoomCustomize";
import CreateBrainStormCustomize from "./CreateBrainStormCustomize";
import { chatRoomObject, directMessageObject } from "../models/TypesDefine";
import { lazy, useState, Suspense, useEffect } from "react";

interface ChatListProps {
    chatType: string;
}

/**
 * 
 * @param {*} chatType The type of chat list to be displayed; either "Direct Message List" or "ChatRoom List"
 * @returns The chat list of the application
 */
function ChatList(props: ChatListProps) {

    // Set the type of chat list to be displayed
    const [chatList, setChatList] = useState<(chatRoomObject | directMessageObject)[]>([]);

    // Track the current selected chat
    const [selectedChat, setSelectedChat] = useState<chatRoomObject | directMessageObject | null>(null);

    // Set the default display of the create chat room option to be hidden
    const [display, setDisplay] = useState("none");

    // Set the default display of the create brainstorm option to be hidden
    const [displayBrainstorm, setDisplayBrainstorm] = useState("none");

    // Lazy load the chat room window component
    const ChatRoomWindow = lazy(() => import("./ChatRoomWindow"));

    // Set the chat id and chat title when a chat is selected
    const handleChatOnClick = (chat: (chatRoomObject | directMessageObject)) => {
        console.log("Selected a chat");
        setSelectedChat(chat);
    }

    // Set the display of the create chat room option
    const handleCreateRoomButton = (e: string) => {
        if (UserInfo.loginRegisterResponse.userInfo.isGuest) {
            alert("Guest cannot create chat room");
            return;
        } else {
            setDisplay(e)
        }
    }

    // Set the display of the create brainstorm option
    const handleCreateBrainstormButton = (e: string) => {
        setDisplayBrainstorm(e)
    }

    useEffect(() => {
        if (props.chatType === "Direct Message List") {
            console.log("----> Displaying direct messages list");
            setChatList(UserInfo.getDirectMessagesList());
        } else if (props.chatType === "ChatRoom List") {
            console.log("----> Displaying chat rooms list");
            setChatList(UserInfo.getChatRoomsList());
        }
    }, [props.chatType, display]);

    return (
        <div className="ChatListContainer">
            <div className="chat-list">
                <h3 className="ChatListTitle">{props.chatType}</h3>
                <div className="search-bar">
                    {/* <input type="text" placeholder="Search Chats" /> */}
                </div>
                <div className="chats">
                    {chatList.map((chat, index) => (
                        <div className="chat-item" key={index} onClick={() => handleChatOnClick(chat)}>
                            <div className="chat-details">
                                <div className="chat-title">
                                    {'title' in chat ? chat.title : chat.user2?.firstName + " " + chat.user2?.lastName}
                                </div>
                                <div className="last-message">
                                    {'description' in chat ? chat.description : chat.directMessages.slice(-1)[0].message}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="CreateChatRoomButton" style={props.chatType === "Direct Message List" ? { display: "none" } : { display: "flex" }}>
                    <button onClick={() => handleCreateRoomButton("flex")}>Create Chat Room</button>
                </div>
            </div>
            <div className="ChatWindowContainer">
                {selectedChat && (
                    <Suspense fallback={"Loading...."}>
                        <ChatRoomWindow chat={selectedChat} callBackFunction={handleCreateBrainstormButton} />
                    </Suspense>
                )}
            </div>
            <CreateRoomCustomize style={display} callBackFunction={handleCreateRoomButton} />
            <CreateBrainStormCustomize style={displayBrainstorm} chat={selectedChat} callBackFunction={handleCreateBrainstormButton} />
        </div>
    );
}

export default ChatList;
