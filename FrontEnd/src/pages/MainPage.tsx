/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/MainPage.css";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import ChatList from "../components/ChatList";
import ApiService from "../services/ApiService";
import UserInfo from "../services/UserInfo";
import { useEffect, useState, useContext } from "react";
import { DataContext } from "../contexts/DataContext";
import SignalRChatRoom from "../services/ChatRoomConnection";

/**
 * 
 * @returns The main page of the application
 */
function MainPage() {
    const context = useContext(DataContext);

    // If the user is not logged in, redirect to the login page
    if (localStorage.getItem("token") === null || localStorage.getItem("token") !== UserInfo.getToken()) {
        // window.location.href = "/";
    }

    // Set the default chat type to be "Direct Message List"
    const [chatType, setChatType] = useState("ChatRoom List");

    // Handle the callback from the NavigationBar component
    function handleCallBack(childData: string) {
        if (UserInfo.loginRegisterResponse.userInfo.isGuest && childData === "Direct Message List") {
            alert("Guest cannot use Direct Message Features");
            return;
        } else {
            setChatType(childData);
        }
    }

    useEffect(() => {
        const hasEffectRunBefore = sessionStorage.getItem('hasEffectRunBefore');
        if (!hasEffectRunBefore) {
            console.log("----> Build callback");
            const render = (type: number) => {
                console.log("---->callback", type);
                if (context === undefined) {
                    throw new Error('useDataContext must be used within a DataContext');
                }
                else if (type === 1 || type === 2 || type === 4 || type === 3) {
                    const updateData = context[1];
                    updateData(true)
                }
            };

            const apiService = ApiService;
            apiService.buildCallBack(render);

            // Set the flag in local storage to indicate that the effect has run
            sessionStorage.setItem('hasEffectRunBefore', 'true');
        }

        if (UserInfo.loginRegisterResponse.userInfo.isGuest && sessionStorage.getItem('isGuest') === null) {
            SignalRChatRoom.getInstance().then((value) => {
                value.joinChatRoom(UserInfo.loginRegisterResponse.userInfo.firstRoom, "First");
                sessionStorage.setItem('isGuest', 'true');
            }).catch((error) => {
                console.log(error);
            });
        }

    }, []);

    return (
        <div className="App">
            <div className="headerNavContainer">
                <HeaderNavBar />
            </div>
            <div className="main-page-container">
                <NavigationBar callBackFunction={handleCallBack} />
                <ChatList chatType={chatType} />
            </div>
        </div>
    );
}

export default MainPage;
