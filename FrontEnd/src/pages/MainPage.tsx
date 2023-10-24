import "../styles/MainPage.css";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import ChatList from "../components/ChatList";
import ApiService from "../services/ApiService";
import UserInfo from "../services/UserInfo";
import { useEffect, useState, useContext } from "react";
import { DataContext, useDataContext } from "../contexts/DataContext";

/**
 * 
 * @returns The main page of the application
 */
function MainPage() {

    
    console.log("----> MainPage");
    
    console.log("----> MainPage1");
    
    // If the user is not logged in, redirect to the login page
    if (localStorage.getItem("token") === null || localStorage.getItem("token") !== UserInfo.getToken()) {
        // window.location.href = "/";
    }

    // Set the default chat type to be "Direct Message List"
    const [chatType, setChatType] = useState("ChatRoom List");

    // Handle the callback from the NavigationBar component
    function handleCallBack(childData: string) {
        setChatType(childData);
    }

    function Render(type: number) {
        console.log("---->callback", type);
        const context = useContext(DataContext);
        if (context === undefined) {
            throw new Error('useDataContext must be used within a DataContext');
        }
        const updateData = context[1];
        updateData(type)
    }

    useEffect(() => {
        // Get a user info and store locally
        // To-do: Get the user info from the server
        console.log("----> Build callback");
        const apiService = ApiService;
        apiService.buildCallBack(Render);
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
