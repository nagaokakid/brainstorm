/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/MainPage.css";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import ChatList from "../components/ChatList";
import ApiService from "../services/ApiService";
import UserInfo from "../services/UserInfo";
import SignalRChatRoom from "../services/ChatRoomConnection";
import { useEffect, useState, useContext } from "react";
import { DataContext } from "../contexts/DataContext";
import { useNavigate } from "react-router";

function MainPage() {

    const context = useContext(DataContext);
    const navigate = useNavigate();

    // If the user is not logged in, redirect to the login page
    if (sessionStorage.getItem("token") === null || sessionStorage.getItem("token") !== UserInfo.getToken()) {
        //window.location.href = "/";
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
        if (sessionStorage.getItem("callBack") === null) {
            const render = (type: number, bsid?: string) => {
                if (context === undefined) {
                    throw new Error('useDataContext must be used within a DataContext');
                } else if (type === 1 || type === 2 || type === 4 || type === 3) {
                    const updateData = context[1];
                    updateData(true)
                } else if (type === 5) {
                    navigate("/BrainStorm", { state: { bsid } });
                } else if (type === 6) {
                    alert("The session has started.");
                }
                
                if (type === 1 && bsid) {
                    navigate("/BrainStorm", { state: { bsid } });
                }
            };

            // Set the flag in session storage to indicate that the effect has run
            sessionStorage.setItem("callBack", 'true');
            ApiService.buildCallBack(render);
            console.log("call back built");
        }

        if (UserInfo.loginRegisterResponse.userInfo.isGuest && sessionStorage.getItem('isGuest') === null) {
            SignalRChatRoom.getInstance().then((value) => {
                value.joinChatRoom(UserInfo.loginRegisterResponse.userInfo.firstRoom, "First");
                sessionStorage.setItem('isGuest', 'true');
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
