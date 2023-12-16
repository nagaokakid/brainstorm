/* eslint-disable react-hooks/exhaustive-deps */
import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "../assets/AddButton.png";
import { useDataContext } from "../contexts/DataContext";
import { CallBackTypes, DisplayTypes, NoticeMessages, TabTypes } from "../models/EnumObjects";
import {
    chatRoomMessageObject,
    chatRoomObject,
    directMessageObject,
} from "../models/TypesDefine";
import ApiService from "../services/ApiService";
import SignalRChatRoom from "../services/ChatRoomConnection";
import SignalRDirect from "../services/DirectMessageConnection";
import UserInfo from "../services/UserInfo";
import "../styles/NavBarTabContent.css";
import editChatRoomIcon from "./../assets/editIcon.png";
import CreateBrainStormCustomize from "./CreateBrainStormCustomize";
import CreateRoomCustomize from "./CreateRoomCustomize";
import DefaultChatRoomWindow from "./DefaultChatRoomWindow";
import EditChatroom from "./chatroom/EditChatroom";

interface ChatListProps {
    displayTab: TabTypes;
    noticeFunction: (msg: NoticeMessages) => void;
}

/**
 *  NavBarTabContent.tsx 
 * -------------------------
 *  This component contain the chat list as well as the content.
 * -----------------------------------------------------------------------
 *  Authors:  Mr. Yee Tsung (Jackson) Kao & Ravdeep Singh
 */
function NavBarTabContent(props: ChatListProps) {
    const navigate = useNavigate();
    const context = useDataContext();
    const updateWindow = context.updateWindow; // Get trigger when the user leave the chat room
    const updateList = context.updateList; // Get trigger when the chat list is updated
    const ChatRoomWindow = lazy(() => import("./ChatRoomWindow")); // Lazy load the chat room window component
    const [chatList, setChatList] = useState([] as (chatRoomObject | directMessageObject)[]); // Set the type of chat list to be displayed
    const [selectedChat, setSelectedChat] = useState({} as chatRoomObject | directMessageObject); // Track the current selected chat
    const [showCreateChatRoom, setShowCreateChatRoom] = useState({ display: DisplayTypes.None }); // Set the default display of the create chat room option to be hidden
    const [showCreateBrainstorm, setShowCreateBrainstorm] = useState({ display: DisplayTypes.None }); // Set the default display of the create brainstorm option to be hidden
    const [showEditChatRoom, setShowEditChatRoom] = useState({ display: DisplayTypes.None, });

    /**
     * Set the chat id and chat title when a chat is selected
     * @param chat The chat room or direct message selected
     */
    function handleSelectedChat(chat: chatRoomObject | directMessageObject) {
        sessionStorage.setItem("currentChatRoom", "title" in chat ? chat.id : "-1"); // Set the current chat room id in the session storage
        setSelectedChat(chat);
    }

    /**
     * Set the display of the create chat room option
     */
    function handleCreateChatRoomButton() {
        if (UserInfo.getUserInfo().isGuest) {
            props.noticeFunction(NoticeMessages.FeatureRestricted);
        } else {
            setShowCreateChatRoom((prevState) => {
                return { ...prevState, display: DisplayTypes.Flex };
            });
        }
    }

    /**
     * Set the display of the create brainstorm option
     */
    function handleCreateBrainstormButton() {
        if (UserInfo.getUserInfo().isGuest) {
            props.noticeFunction(NoticeMessages.FeatureRestricted);
        } else {
            setShowCreateBrainstorm((prevState) => {
                return { ...prevState, display: DisplayTypes.Flex };
            });
        }
    }

    /**
     * Set the display of the create brainstorm option
     */
    function handleEditChatRoomButton() {
        if (UserInfo.getUserInfo().isGuest) {
            props.noticeFunction(NoticeMessages.FeatureRestricted);
        } else {
            setShowEditChatRoom((prevState) => {
                return { ...prevState, display: DisplayTypes.Flex };
            });
        }
    }

    useEffect(() => {
        if (sessionStorage.getItem("callBack") === null) {
            const render = (
                type: CallBackTypes,
                bsid?: string,
                msgObject?: chatRoomMessageObject | { fromUserId: string, messageId: string, message: string, timestamp: string },
                userId?: string,
                count?: number,
                timer?: number,
            ) => {
                if (context === undefined) {
                    throw new Error("useDataContext must be used within a DataContext");
                } else if (
                    type === CallBackTypes.ReceiveChatRoomMsg ||
                    type === CallBackTypes.ReceiveDM ||
                    type === CallBackTypes.ReceiveChatRoomNewMember ||
                    type === CallBackTypes.ReceiveChatRoomInfo ||
                    type === CallBackTypes.ReceiveDMRemoved ||
                    type === CallBackTypes.ReceiveChatRoomMsgRemoved ||
                    type === CallBackTypes.ReceiveChatRoomEdit ||
                    type === CallBackTypes.ReceiveBSMsgRemoved
                ) {
                    if (type === CallBackTypes.ReceiveChatRoomMsg || type === CallBackTypes.ReceiveDM || type === CallBackTypes.ReceiveDMRemoved) {
                        if (type === CallBackTypes.ReceiveChatRoomMsg || type === CallBackTypes.ReceiveDM) {
                            const updateMsgFunction = context.updateMsgFunction;
                            updateMsgFunction(msgObject!);
                            if (type === CallBackTypes.ReceiveDM) {
                                const updateListFunction = context.updateListFunction;
                                updateListFunction(true);
                            }
                        } else if (type === CallBackTypes.ReceiveDMRemoved || CallBackTypes.ReceiveChatRoomMsgRemoved || CallBackTypes.ReceiveBSMsgRemoved) {
                            const updateDeleteMsgFunction = context.updateDeleteMsgFunction;
                            updateDeleteMsgFunction(true);
                        }
                    } else if (type === CallBackTypes.ReceiveChatRoomInfo || type === 8) {
                        if (type === CallBackTypes.ReceiveChatRoomEdit) {
                            const updateHeader = context.updateHeaderFunction;
                            updateHeader(true);
                        }
                        const updateListFunction = context.updateListFunction;
                        updateListFunction(true);
                    } else if (type === CallBackTypes.ReceiveChatRoomNewMember) {
                        const updateMemberFunction = context.updateMemberFunction;
                        updateMemberFunction(true);
                    }
                } else if (type === CallBackTypes.ReceiveBSJoin) {
                    const updateCountFunction = context.updateCountFunction;
                    updateCountFunction(count!);
                    if (userId === UserInfo.getUserId()) {
                        navigate("/BrainStorm", { state: { bsid, timer } });
                        sessionStorage.setItem("brainstorm", "true");
                    }
                } else if (type === CallBackTypes.ReceiveBSStarted) {
                    props.noticeFunction(NoticeMessages.SessionEnded);
                }

                if (type === CallBackTypes.ReceiveChatRoomMsg && bsid) {
                    navigate("/BrainStorm", { state: { bsid, timer } });
                    sessionStorage.setItem("brainstorm", "true");
                }
            };

            ApiService.buildCallBack(render); // Build the callback function
            sessionStorage.setItem("callBack", "true"); // Set the flag in session storage to indicate that the effect has run

            if ((UserInfo.getUserInfo().isGuest ?? false) && sessionStorage.getItem("isGuest") === null) {
                SignalRChatRoom.getInstance().then(async (value) => {
                    await value.joinChatRoom(
                        UserInfo.getUserInfo().firstRoom ?? "",
                        "First"
                    ); // Join the first chat room
                    sessionStorage.setItem("isGuest", "true"); // Set the flag in session storage to indicate that current user is a guest
                });
            }
        }
    }, []);

    /**
     * Set the selected chat to be empty when the tab is changed
     */
    useEffect(() => {
        setSelectedChat({} as chatRoomObject | directMessageObject);
    }, [props.displayTab, updateWindow]);

    /**
     * Get the chat list based on the tab selected
     */
    useEffect(() => {
        if (props.displayTab === TabTypes.DiretMessage) {
            setChatList(UserInfo.getDirectMessagesList());
        } else if (props.displayTab === TabTypes.ChatRoom) {
            setChatList(UserInfo.getChatRoomsList());
        }
    }, [props.displayTab, updateList, updateWindow]);

    /**
     * Build the SignalR connection
     */
    useEffect(() => {
        const chatRoomConnectionId = sessionStorage.getItem("chatRoomConnectionId");
        const directConnectionId = sessionStorage.getItem("directConnectionId");

        if (chatRoomConnectionId || directConnectionId) {

            if (SignalRDirect.getConnectionId() === directConnectionId && SignalRChatRoom.getConnectionId() === chatRoomConnectionId) {
                return;
            } else {
                sessionStorage.removeItem("callBack");
                const reconnect = async () => {
                    await ApiService.connectChatRooms();
                };
                reconnect();
            }
        }
    }, []);

    /**
     * Set the selected chat room when the user is redirected from the brainstorm page
     */
    useEffect(() => {
        const brainstorm = sessionStorage.getItem("brainstorm");
        const chatRoomId = sessionStorage.getItem("currentChatRoom");
        if (brainstorm && chatRoomId != null && chatRoomId !== "-1") {
            const chatRoom = UserInfo.getChatRoomInfo(chatRoomId);
            if (chatRoom != null) {
                setSelectedChat(chatRoom);
                sessionStorage.removeItem("brainstorm");
            }
        }
    }, []);

    return (
        <div className="navbar-tab-content-container">
            <div className="content-list-container">
                <div className="list-header">
                    {props.displayTab === TabTypes.ChatRoom && (
                        <div className="chat-room-header">
                            Chat Rooms
                            <button
                                className="create-chat-room-icon"
                                onClick={handleCreateChatRoomButton}
                            >
                                <img src={AddIcon} width={20} />
                            </button>
                        </div>
                    )}
                    {props.displayTab === TabTypes.DiretMessage && (
                        <div className="direct-message-header">Direct Messages</div>
                    )}
                </div>
                <div className="list-container">
                    {chatList.map((chat, index) => (
                        <li
                            className="list-item"
                            key={index}
                            onClick={() => handleSelectedChat(chat)}
                            style={{ backgroundColor: JSON.stringify(selectedChat) === JSON.stringify(chat) ? "#FFC436" : "", color: JSON.stringify(selectedChat) === JSON.stringify(chat) ? "black" : "", borderRadius: JSON.stringify(selectedChat) === JSON.stringify(chat) ? "5px" : "" }}
                        >
                            <div className="item-icon">
                                {("title" in chat
                                    ? chat.title
                                    : chat.user1.userId === UserInfo.getUserId()
                                        ? chat.user2.firstName
                                        : chat.user1.firstName
                                )
                                    .trim()[0]
                                    .toUpperCase()}
                            </div>
                            <div className="item-detail">
                                <div className="item-title">
                                    {"title" in chat
                                        ? chat.title
                                        : chat.user1.userId === UserInfo.getUserId()
                                            ? chat.user2.firstName + " " + chat.user2.lastName
                                            : chat.user1.firstName + " " + chat.user1.lastName}
                                </div>
                                <div className="last-message">
                                    {"description" in chat
                                        ? chat.description
                                        : chat.directMessages.length != 0
                                            ? chat.directMessages.slice(-1)[0].message
                                            : ""}
                                </div>
                            </div>
                            <div
                                style={
                                    props.displayTab == TabTypes.DiretMessage
                                        ? { display: DisplayTypes.None }
                                        : { display: DisplayTypes.Flex }
                                }
                            >
                                <img
                                    className="edit-chat-room-button"
                                    onClick={handleEditChatRoomButton}
                                    src={editChatRoomIcon}
                                />
                            </div>
                        </li>
                    ))}
                </div>
            </div>
            <div className="chat-window-container">
                {Object.keys(selectedChat).length !== 0 && (
                    <Suspense fallback={"Loading...."}>
                        <ChatRoomWindow
                            chat={selectedChat}
                            brainstormButton={handleCreateBrainstormButton}
                        />
                    </Suspense>
                )}
                {Object.keys(selectedChat).length === 0 && (
                    <div className="default-chat-room-layout">
                        <DefaultChatRoomWindow
                            handleFunction={handleCreateChatRoomButton}
                            displayTab={props.displayTab}
                        />
                    </div>
                )}
            </div>
            <CreateRoomCustomize style={showCreateChatRoom} />
            <CreateBrainStormCustomize style={showCreateBrainstorm} chat={selectedChat} />
            <EditChatroom chatRoom={selectedChat as chatRoomObject} display={showEditChatRoom} />
        </div>
    );
}

export default NavBarTabContent;
