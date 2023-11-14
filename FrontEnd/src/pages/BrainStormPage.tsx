/* eslint-disable react-hooks/exhaustive-deps */
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
import Idea from '../models/Idea';

function BrainStormPage() {

    const [isVoting, setIsVoting] = useState(false);
    const [ideaList, setIdeaList] = useState([] as Idea[]);
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
        sessionStorage.removeItem("bs_user");
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

    /**
     * End the voting
     */
    function handleVotingClick() {
        if (isVoting) {
            SignalRChatRoom.getInstance().then((instance) => {
                instance.clientsShouldSendAllVotes(sessionId);
            });
        } else {
            alert("Voting has already ended or has not started yet.");
        }
    }

    useEffect(() => {
        if (sessionStorage.getItem("bs_callBack") === null) {

            const callBackFunction = (type: number, ideas?: Idea[]) => {
                if (type === 1) {
                    setInput(false);
                    alert("Session has started\nYou can now send messages");
                } else if (type === 2) {
                    setInput(true);
                    SignalRChatRoom.getInstance().then((instance) => {
                        instance.sendAllIdeas(sessionId, UserInfo.getLocalIdeas());
                        UserInfo.clearIdea();
                    });
                    setLocalIdeaList([]);
                    alert("Session has ended\nYou can no longer send messages\nAll the ideas have been saved to backend");
                } else if (type === 3) {
                    sessionStorage.setItem("bs_ideaList", JSON.stringify(ideas));
                    setIsVoting(true);
                } else if (type === 4) {
                    setIdeaList(ideas ? ideas : []);
                    alert("Voting results have been updated");
                } else if (type === 5) {
                    SignalRChatRoom.getInstance().then((instance) => {
                        instance.sendVotes(sessionId, UserInfo.getIdeasList());
                        UserInfo.clearIdeaList();
                    });
                    setIsVoting(false);
                    setIdeaList([]);
                    alert("Voting has ended\nYou can no longer vote\nAll the votes have been saved to backend");
                }
            };
            ApiService.buildBSCallBack(callBackFunction);
            sessionStorage.setItem("bs_callBack", "true");
            console.log("BS call back built");
        }
        UserInfo.bsUserSetup();
        console.log("BS user setup");
        setLocalIdeaList(UserInfo.getLocalIdeas());
        setIdeaList(UserInfo.getIdeasList());
    }, []);

    return (
        <div className='BS_PageContainer'>
            <div className='BS_HeaderContainer'>
                <button className='LeaveSessionButton' onClick={() => setLeaveContainer("flex")}></button>
                <BS_HeaderContent roomTitle={sessionTitle} roomDescription={sessionDescription} />
            </div>
            <div className='BS_BodyContainer'>
                <div className='BS_ContentContainer'>
                    <BS_OnlineIdeaList content={ideaList} voting={isVoting}/>
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
                        <button onClick={handleVotingClick}>End Voting</button>
                    </div>
                </div>
            </div>
            <LeaveBSPrompt content={"Leave the Session?"} display={leaveContainer} yesFunction={handleLeaveClick} displayFunction={callLeaveContainer} />
        </div>
    );
}

export default BrainStormPage;