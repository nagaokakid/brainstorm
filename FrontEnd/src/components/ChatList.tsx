/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/ChatList.css";
import UserInfo from "../services/UserInfo";
import ApiService from "../services/ApiService";
import SignalRChatRoom from "../services/ChatRoomConnection";
import CreateRoomCustomize from "./CreateRoomCustomize";
import CreateBrainStormCustomize from "./CreateBrainStormCustomize";
import DefaultChatRoomWindow from "./DefaultChatRoomWindow";
import {
  chatRoomMessageObject,
  chatRoomObject,
  directMessageObject,
  newDirectMessageObject,
} from "../models/TypesDefine";
import { DataContext } from "../contexts/DataContext";
import { lazy, useState, Suspense, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { handleHover } from "./handleIconHover";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

/*
  *  ChatList.tsx 
  * -------------------------
  *  This component is the chat list of the chat page.
  *  It contains the list of chat rooms and direct messages that the user has created.
  *  -----------------------------------------------------------------------
  * Author:  Mr. Yee Tsung (Jackson) Kao
  * Date Created:  01/12/2023
  * Last Modified: 01/12/2023
  * Version: 1.0
*/
interface ChatListProps {
  displayTab: string;
  noticeFunction: (msg: string) => void;
}

function ChatList(props: ChatListProps) {
  const navigate = useNavigate(); // Get the navigate function
  const context = useContext(DataContext); // Get the data context
  const [chatList, setChatList] = useState(
    [] as (chatRoomObject | directMessageObject)[]
  ); // Set the type of chat list to be displayed
  const [selectedChat, setSelectedChat] = useState(
    {} as chatRoomObject | directMessageObject
  ); // Track the current selected chat
  const [showCreateChatRoom, setShowCreateChatRoom] = useState({
    display: "none",
  }); // Set the default display of the create chat room option to be hidden
  const [showCreateBrainstorm, setShowCreateBrainstorm] = useState({
    display: "none",
  }); // Set the default display of the create brainstorm option to be hidden
  const [forceRender, setForceRender] = useState(false); // Force the component to re-render
  const ChatRoomWindow = lazy(() => import("./ChatRoomWindow")); // Lazy load the chat room window component

  /**
   * Set the chat id and chat title when a chat is selected
   * @param chat The chat room or direct message selected
   */
  function handleChatOnClick(chat: chatRoomObject | directMessageObject) {
    setSelectedChat(chat);
  }

  /**
   * Set the display of the create chat room option
   */
  function handleCreateChatRoomButton() {
    if (UserInfo.getUserInfo().isGuest) {
      props.noticeFunction("Guest cannot create chat room");
    } else {
      setShowCreateChatRoom((prev) => {
        return { ...prev, display: "flex" };
      });
    }
  }

  /**
   * Set the display of the create brainstorm option
   */
  function handleCreateBrainstormButton() {
    if (UserInfo.getUserInfo().isGuest) {
      props.noticeFunction("Guest cannot create brainstorm");
    } else {
      setShowCreateBrainstorm((prev) => {
        return { ...prev, display: "flex" };
      });
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem("callBack") === null) {
      const render = (
        type: number,
        bsid?: string,
        msgObject?: chatRoomMessageObject | newDirectMessageObject,
        userId?: string,
        count?: number,
        timer?: number
      ) => {
        if (context === undefined) {
          throw new Error("useDataContext must be used within a DataContext");
        } else if (
          type === 1 ||
          type === 2 ||
          type === 3 ||
          type === 4 ||
          type === 7
        ) {
          if (type === 1 || type === 2 || type === 7) {
            if (type === 1 || type === 2) {
              const updateMsg = context[3];
              updateMsg(msgObject!);
            } else if (type === 7) {
              const updateMsg = context[5];
              updateMsg(true);
            }
          } else if (type === 4) {
            setForceRender((prev) => !prev);
          } else if (type === 3) {
            const updateData = context[2];
            updateData(true);
          }
        } else if (type === 5) {
          const updateCount = context[7];
          updateCount(count!);
          if (userId === UserInfo.getUserId()) {
            navigate("/BrainStorm", { state: { bsid, timer } });
          }
        } else if (type === 6) {
          console.log("The session has ended.");

          props.noticeFunction("The session has ended.");
        }

        if (type === 1 && bsid) {
          navigate("/BrainStorm", { state: { bsid, timer } });
        }
      };

      ApiService.buildCallBack(render); // Build the callback function
      sessionStorage.setItem("callBack", "true"); // Set the flag in session storage to indicate that the effect has run

      if (
        (UserInfo.getUserInfo().isGuest ?? false) &&
        sessionStorage.getItem("isGuest") === null
      ) {
        SignalRChatRoom.getInstance().then(async (value) => {
          await value.joinChatRoom(
            UserInfo.getUserInfo().firstRoom ?? "",
            "First"
          ); // Join the first chat room
          sessionStorage.setItem("isGuest", "true"); // Set the flag in session storage to indicate that current user is a guest
        });
      }
    }

    if (props.displayTab === "Direct Message List") {
      setChatList(UserInfo.getDirectMessagesList());
    } else if (props.displayTab === "ChatRoom List") {
      setChatList(UserInfo.getChatRoomsList());
    }
  }, [props.displayTab, context, forceRender]);

  return (
    <div className="ChatListContainer">
      <div className="chat-list">
        <div className="ChatListHeader">
          {props.displayTab === "ChatRoom List" && (
            <div className="ChatRoomHeader">
              Chat Rooms
              <button 
                className="CreateChatRoomIcon" 
                onClick={handleCreateChatRoomButton} 
                onMouseOver={handleHover}
              >
                <FontAwesomeIcon icon={faPenToSquare} title="Create Chat Room" />
              </button>
            </div>
          )}
          {props.displayTab === "Direct Message List" && (<>Direct Messages</>)}
        </div>
        <div className="chats">
          {chatList.map((chat, index) => (
            <div
              className="chat-item"
              key={index}
              onClick={() => handleChatOnClick(chat)}
            >
              <div className="UserProfileIcon">
                {("title" in chat
                  ? chat.title
                  : chat.user1.userId === UserInfo.getUserId()
                  ? chat.user2.firstName
                  : chat.user1.firstName
                )
                  .trim()[0]
                  .toUpperCase()}
              </div>
              <div className="chat-details">
                <div className="chat-title">
                  {"title" in chat
                    ? chat.title
                    : chat.user1.userId === UserInfo.getUserId()
                    ? chat.user2.firstName
                    : chat.user1.firstName}
                </div>
                <div className="last-message">
                  {"description" in chat
                    ? chat.description
                    : chat.directMessages.length != 0 ? chat.directMessages.slice(-1)[0].message : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="ChatWindowContainer">
        {Object.keys(selectedChat).length !== 0 && (
          <Suspense fallback={"Loading...."}>
            <ChatRoomWindow
              chat={selectedChat}
              brainstormButton={handleCreateBrainstormButton}
            />
          </Suspense>
        )}
        {Object.keys(selectedChat).length === 0 && (
          <div className="DefaultChatRoomLayout">
            <DefaultChatRoomWindow handleFunction={handleCreateChatRoomButton} displayTab={props.displayTab}/>
          </div>
          )}
      </div>
      <CreateRoomCustomize style={showCreateChatRoom} render={setForceRender} />
      <CreateBrainStormCustomize
        style={showCreateBrainstorm}
        chat={selectedChat}
      />
    </div>
  );
}

export default ChatList;
