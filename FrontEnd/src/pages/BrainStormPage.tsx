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
    const [input, setInput] = useState(true);
    const Navigate = useNavigate();
    const location = useLocation().state as { bsid: string };
    const bs_Info = UserInfo.getBS_Session(location ? location.bsid : "");
    const sessionId = bs_Info ? bs_Info.sessionId : "";
    const sessionTitle = bs_Info ? bs_Info.title : "";
    const sessionDescription = bs_Info ? bs_Info.description : "";
    const creatorId = bs_Info ? bs_Info.creator.userId : "";

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
        if (!input) {
            SignalRChatRoom.getInstance().then((instance) => {
                instance.endSession(sessionId);
            });
        } else {
            alert("Session has already ended or has not started yet.");
        }
    }

    useEffect(() => {
        if (sessionStorage.getItem("bs_callBack") === null) {

            const callBackFunction = (type: number) => {
                if (type === 1) {
                    setInput(false);
                    alert("Session has started\nYou can now send messages");
                } else if (type === 2) {
                    setInput(true);
                    alert("Session has ended\nYou can no longer send messages\nAll the ideas have been saved to backend");
                } else if (type === 3) {

                }
            };
            ApiService.buildBSCallBack(callBackFunction);
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
                    <BS_SendPrompt sendFunction={handleSendClick} input={input} />
                </div>
                <div className='BS_RightSideContainer'>
                    <div className='BS_MemberContainer'>
                        <BS_MemberList />
                    </div>
                    <div className='BS_ButtonContainer' style={{ display: UserInfo.isHost(creatorId) ? "flex" : "none" }}>
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