import '../styles/BrainStormPage.css';
import BS_MemberList from '../components/BS_MemberList';
import BS_HeaderContent from '../components/BS_HeaderContent';
import BS_SendPrompt from '../components/InputSendPrompt';
import BS_OnlineIdeaList from '../components/BS_OnlineIdeaList';
import BS_LocalIdeaList from '../components/BS_LocalIdeaList';
import LeaveBSPrompt from '../components/YesNoPrompt';
import ApiService from '../services/ApiService';
import UserInfo from '../services/UserInfo';
import SignalRChatRoom from '../services/ChatRoomConnection';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function BrainStormPage() {

    const [localIdeaList, setLocalIdeaList] = useState([] as string[]);
    const [leaveContainer, setLeaveContainer] = useState("none");
    const Navigate = useNavigate();
    const location = useLocation().state as { chatId: string };
    const bs_Info = UserInfo.getBS_Session(location ? location.chatId : "");
    const sessionId = bs_Info ? bs_Info.SessionId : "No Valid Id";
    const sessionTitle = bs_Info ? bs_Info.Title : "No Title";
    const sessionDescription = bs_Info ? bs_Info.Description : "No Description";
    const chatId = location ? location.chatId : "";

    /**
     * Prevent the user from going back to the previous page
     */
    window.history.pushState(null, "null", window.location.href);
    window.onpopstate = function () {
        window.history.go(1);
        setLeaveContainer("flex");
    };

    /**
     * Set the leave container to be displayed or not
     * @param e Set the leave container to be displayed or not
     */
    function callLeaveContainer(e: string) {
        setLeaveContainer(e);
    }

    /**
     * Leave the session
     */
    function handleLeaveClick() {
        ApiService.leaveBSSession();
        sessionStorage.removeItem("bs_callBack");
        sessionStorage.removeItem("bs_userSetup");
        Navigate("/main");
    }

    /**
     * Send the message
     * @param input The message to be added to the idea list
     */
    function handleSendClick(input: string) {
        setLocalIdeaList([...localIdeaList, input]);
        UserInfo.addNewIdea(input);
    }

    /**
     * Start the session
     */
    function handleStartSessionClick() {
        SignalRChatRoom.getInstance().then((instance) => {
            instance.startSession(sessionId);
        });
    }

    /**
     * End the session
     */
    function handleEndSessionClick() {
        SignalRChatRoom.getInstance().then((instance) => {
            instance.endSession(sessionId);
        });
    }

    useEffect(() => {
        if (sessionStorage.getItem("bs_callBack") === null) {
            ApiService.buildBSCallBack();
            sessionStorage.setItem("bs_callBack", "true");
            console.log("BS call back built");
        }
        UserInfo.bsUserSetup();
        console.log("BS user setup");
        setLocalIdeaList(UserInfo.getLocalIdeas());
    }, []);

    return (
        <div className='BS_PageContainer'>
            <div className='BS_HeaderContainer'>
                <button className='LeaveSessionButton' onClick={() => setLeaveContainer("flex")}></button>
                <BS_HeaderContent roomTitle={sessionTitle} roomDescription={sessionDescription} />
            </div>
            <div className='BS_BodyContainer'>
                <div className='BS_ContentContainer'>
                    <BS_OnlineIdeaList content={["hello"]} />
                    <BS_LocalIdeaList content={localIdeaList} />
                    <BS_SendPrompt sendFunction={handleSendClick} />
                </div>
                <div className='BS_RightSideContainer'>
                    <div className='BS_MemberContainer'>
                        <BS_MemberList />
                    </div>
                    <div className='BS_ButtonContainer' style={{ display: UserInfo.isHost(chatId) ? "flex" : "none" }}>
                        <button onClick={handleStartSessionClick}>Start Session</button>
                        <button onClick={handleEndSessionClick}>End Session</button>
                    </div>
                </div>
            </div>
            <LeaveBSPrompt content={"Leave the Session?"} display={leaveContainer} yesFunction={handleLeaveClick} displayFunction={callLeaveContainer} />
        </div>
    );
}

export default BrainStormPage;