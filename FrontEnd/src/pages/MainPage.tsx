import "../styles/MainPage.css";
import { useEffect, useState } from "react";
import TabContent from "../components/NavBarTabContent";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import { DisplayTypes, NoticeMessages, TabTypes } from "../models/EnumObjects";
import UserInfo from "../services/UserInfo";
import EditProfile from "../components/profile/EditProfile";

/**
*  MainPage.tsx 
* -------------------------
*  This component is the main page of the application.
*  It contains the header navigation bar, the navigation bar, and the chat list.
*  -----------------------------------------------------------------------
* Authors:  Mr. Yee Tsung (Jackson) Kao & Ravdeep Singh
*/
function MainPage() {
    const [currentTab, setCurrentTab] = useState(TabTypes.ChatRoom); // Set the default chat type to be "CharRoom List"
    const [display, setDisplay] = useState(DisplayTypes.None); // Set the default display to be none
    const [noticeMsg, setNoticeMsg] = useState(NoticeMessages.Empty); // Set the default notice message to be empty
    const [showProfile, setShowProfile] = useState({ display: DisplayTypes.None }); // Set the default display of the profile to be none

    // If the user is not logged in, redirect to the login page
    if (sessionStorage.getItem("token") === null || sessionStorage.getItem("token") !== UserInfo.getToken()) {
        window.location.href = "/";
    }

    /**
     * Show the notice with the given message
     * @param msg The message to be shown in the notice
     */
    function showNotice(msg: NoticeMessages) {
        setNoticeMsg(msg);
        setDisplay(DisplayTypes.Flex);

        setTimeout(() => {
            setDisplay(DisplayTypes.None);
        }, 2000);
    }

    /**
     * Switch the chat type based on the tab selected
     * @param tab The tab selected 
     * @returns 
     */
    function handleSelectedTab(tab: TabTypes) {
        if (tab === TabTypes.DiretMessage && UserInfo.getUserInfo().isGuest) { // If the user is a guest, they cannot use the direct message feature
            showNotice(NoticeMessages.FeatureRestricted);
            return;
        } else {
            setCurrentTab(tab); // Set the chat type to be the tab selected
        }
    }

    // Get user info from session storage
    useEffect(() => {
        UserInfo.updateUser();
        UserInfo.updateLocalIdea();
        UserInfo.updateIdeaList();
    }, []);

    return (
        <div className="main-page">
            <div className="header-nav-container">
                <HeaderNavBar clickedUserProfile={() => setShowProfile((prevState) => { return { ...prevState, display: DisplayTypes.Flex } })} noticeFunction={showNotice} />
            </div>
            <div className="mainpage-body-container">
                <NavigationBar selectFunction={handleSelectedTab} activeTab={currentTab} />
                <TabContent displayTab={currentTab} noticeFunction={showNotice} />
            </div>
            <div className="notice-class" style={{ display: display }}>
                <div><h1>{noticeMsg}</h1></div>
            </div>
            <EditProfile display={showProfile} />
        </div>
    );
}

export default MainPage;