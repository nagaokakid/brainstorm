/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/MainPage.css";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import TabContent from "../components/ChatList";
import UserInfo from "../services/UserInfo";
import { useEffect, useState } from "react";

function MainPage() {
    const [currentTab, setCurrentTab] = useState("ChatRoom List"); // Set the default chat type to be "CharRoom List"
    const [display, setDisplay] = useState({ display: "none" }); // Set the default display to be none
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
        setDisplay({ display: "flex" });

        setTimeout(() => {
            setDisplay({ display: "none" });
        }, 2000);
    }

    /**
     * Switch the chat type based on the tab selected
     * @param tab The tab selected 
     * @returns 
     */
    function handleSelectedTab(tab: string) {
        if (tab === "Direct Message List" && UserInfo.getUserInfo().isGuest) { // If the user is a guest, they cannot use the direct message feature
            showNotice("Guest cannot use this feature");
            return;
        } else {
            setCurrentTab(tab); // Set the chat type to be the tab selected
        }
    }

    useEffect(() => {
        // Get user info from session storage
        UserInfo.updateUser();
        UserInfo.updateLocalIdea();
        UserInfo.updateIdeaList();
    }, []);

    return (
        <div className="App">
            <div className="headerNavContainer">
                <HeaderNavBar noticeFunction={showNotice} />
            </div>
            <div className="main-page-container">
                <NavigationBar selectFunction={handleSelectedTab} activeTab={currentTab}/>
                <TabContent displayTab={currentTab} noticeFunction={showNotice} />
            </div>
            <div className="NoticeClass" style={display}>
                <div><h1>{noticeMsg}</h1></div>
            </div>
        </div>
    );
}

export default MainPage;