/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/MainPage.css";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import ChatList from "../components/ChatList";
import ApiService from "../services/ApiService";
import UserInfo from "../services/UserInfo";
import SignalRChatRoom from "../services/ChatRoomConnection";
import { DataContext } from "../contexts/DataContext";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
    const navigate = useNavigate();
    const context = useContext(DataContext);
    const [currentTab, setCurrentTab] = useState("ChatRoom List"); // Set the default chat type to be "CharRoom List"
    const [display, setDisplay] = useState("none" as string); // Set the default display to be none
    const [noticeMsg, setNoticeMsg] = useState("" as string); // Set the default notice message to be empty

    // If the user is not logged in, redirect to the login page
    if (sessionStorage.getItem("token") === null || sessionStorage.getItem("token") !== UserInfo.getToken()) {
        //window.location.href = "/";
    }

    /**
     * Show the notice with the given message
     * @param msg The message to be shown in the notice
     */
    function showNotice(msg: string) {
        setNoticeMsg(msg);
        setDisplay("block");

        setTimeout(() => {
            setDisplay("none");
        }, 2000);
    }

    /**
     * Switch the chat type based on the tab selected
     * @param tab The tab selected 
     * @returns 
     */
    function handleSelectedTab(tab: string) {
        if (UserInfo.getUserInfo().isGuest && tab === "Direct Message List") { // If the user is a guest, they cannot use the direct message feature
            showNotice("Guest cannot use this feature");
            return;
        } else {
            setCurrentTab(tab); // Set the chat type to be the tab selected
        }
    }

    useEffect(() => {
        if (sessionStorage.getItem("callBack") === null) {
            const render = (type: number, bsid?: string) => {
                if (context === undefined) {
                    throw new Error('useDataContext must be used within a DataContext');
                } else if (type === 1 || type === 2 || type === 3 || type === 4) {
                    const updateData = context[1];
                    updateData(true)
                } else if (type === 5) {
                    navigate("/BrainStorm", { state: { bsid } });
                } else if (type === 6) {
                    showNotice("The session has ended.");
                }

                if (type === 1 && bsid) {
                    navigate("/BrainStorm", { state: { bsid } });
                }
            };

            ApiService.buildCallBack(render); // Build the callback function
            sessionStorage.setItem("callBack", 'true'); // Set the flag in session storage to indicate that the effect has run
        }

        if ((UserInfo.getUserInfo().isGuest ?? false) && sessionStorage.getItem('isGuest') === null) {
            SignalRChatRoom.getInstance().then(async (value) => {
                await value.joinChatRoom(UserInfo.getUserInfo().firstRoom ?? "", "First"); // Join the first chat room
                sessionStorage.setItem('isGuest', 'true'); // Set the flag in session storage to indicate that current user is a guest
            });
        }

        // Get user info from session storage
        UserInfo.updateUser();
        UserInfo.updateLocalIdea();
        UserInfo.updateIdeaList();
    }, []);

    return (
        <div className="App">
            <div className="headerNavContainer">
                <HeaderNavBar noticeFunction={setNoticeMsg} />
            </div>
            <div className="main-page-container">
                <NavigationBar selectFunction={handleSelectedTab} />
                <ChatList displayTab={currentTab} />
            </div>
            <div className="NoticeClass" style={{ display: display }}>
                <div><h1>{noticeMsg}</h1></div>
            </div>
        </div>
    );
}

export default MainPage;