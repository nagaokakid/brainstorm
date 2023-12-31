/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/BrainStormPage.css";
import BS_HeaderContent from "../components/BS_HeaderContent";
import BS_SendPrompt from "../components/InputSendPrompt";
import BS_OnlineIdeaList from "../components/BS_OnlineIdeaList";
import BS_LocalIdeaList from "../components/BS_LocalIdeaList";
import LeaveBSPrompt from "../components/YesNoPrompt";
import ApiService from "../services/ApiService";
import UserInfo from "../services/UserInfo";
import Idea from "../models/Idea";
import SignalRChatRoom from "../services/ChatRoomConnection";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../contexts/DataContext";
import exitIcon from "../assets/exitIcon.png"
import { BSCallBackTypes } from "../models/EnumObjects";

/**
* BrainStormPage.tsx
* -------------------------
*   This component is the brain storm page of the brain storm session.
*  It contains the list of ideas that the user has created.
* -----------------------------------------------------------------------
* Authors:  Mr. Yee Tsung (Jackson) Kao & Mr. Roland Fehr
*/
function BrainStormPage() {
    const Navigate = useNavigate();
    const [isVoting, setIsVoting] = useState(false);
    const [ideaList, setIdeaList] = useState([] as Idea[]);
    const [localIdeaList, setLocalIdeaList] = useState([] as string[]);
    const [leaveContainer, setLeaveContainer] = useState("none");
    const [input, setInput] = useState(true);
    const [hasStarted, setHasStarted] = useState(false);
    const [display, setDisplay] = useState({ display: "none" });
    const [noticeMsg, setNoticeMsg] = useState("" as string);
    const [displayBtn, setDisplayBtn] = useState([
        { display: "flex" },
        { display: "none" },
        { display: "none" },
        { display: "none" },
    ]);
    const location = useLocation().state as { bsid: string; timer?: string };
    const [timer, setTimer] = useState(Number(location.timer));
    const bs_Info = UserInfo.getBS_Session(location ? location.bsid : "");
    const sessionId = bs_Info ? bs_Info.sessionId : "";
    const sessionTitle = bs_Info ? bs_Info.title : "";
    const sessionDescription = bs_Info ? bs_Info.description : "";
    const creatorId = bs_Info ? bs_Info.creator.userId : "";
    const interval = useRef() as React.MutableRefObject<NodeJS.Timeout>;
    const [memberCount, setMemberCount] = useState(0); // Set the member count to be displayed
    const context = useContext(DataContext); // Get the data context

    function startTimer() {
        if (timer > 0) {
            interval.current = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
    }

    useEffect(() => {
        if (timer === 0) {
            clearInterval(interval.current);
            setTimer(Number(location.timer));

            if (!input) {
                handleEndSessionClick();
            } else if (isVoting) {
                handleVotingClick();
            }
        }
    }, [timer]);

    /**
     * Prevent the user from going back to the previous page
     */
    window.history.pushState(null, "null", window.location.href);
    window.onpopstate = function () {
        window.history.go(1);
        setLeaveContainer("flex");
    };

    /**
     * Show the notice with the given message
     * @param msg The message to be shown in the notice
     */
    function showNotice(msg: string) {
        setNoticeMsg(msg);
        setDisplay({ display: "flex" });

        setTimeout(() => {
            setDisplay({ display: "none" });
        }, 1000);
    }

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
    async function handleLeaveClick() {
        await ApiService.leaveBSSession(creatorId, sessionId, hasStarted);
        sessionStorage.removeItem("bs_callBack");
        sessionStorage.removeItem("localIdea");
        sessionStorage.removeItem("ideaList");
        UserInfo.clearIdea();
        UserInfo.clearIdeaList();
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
        setHasStarted(true);
        if (input) {
            setDisplayBtn([
                { display: "none" },
                { display: "flex" },
                { display: "none" },
                { display: "none" },
            ]);
            UserInfo.clearIdeaList();
            UserInfo.clearIdea();

            SignalRChatRoom.getInstance().then((instance) => {
                instance.startSession(sessionId, timer, sessionStorage.getItem("currentChatRoom") as string);
            });
        }
    }

    /**
     * End the session
     */
    function handleEndSessionClick() {
        if (!input) {
            setDisplayBtn([
                { display: "none" },
                { display: "none" },
                { display: "flex" },
                { display: "none" },
            ]);
            clearInterval(interval.current);
            SignalRChatRoom.getInstance().then((instance) => {
                instance.endSession(sessionId);
            });
        } else {
            showNotice("Session has not started yet");
        }
    }

    /**
     * End the voting
     */
    function handleVotingClick() {
        if (isVoting) {
            setDisplayBtn([
                { display: "none" },
                { display: "none" },
                { display: "none" },
                { display: "flex" },
            ]);
            SignalRChatRoom.getInstance().then((instance) => {
                instance.clientsShouldSendAllVotes(sessionId);
            });
        } else {
            showNotice("Voting has already ended or has not started yet.");
        }
    }
    /**
     * To vote another round
     */
    function handleAnotherVotingRoundClick() {
        if (!isVoting) {
            setDisplayBtn([
                { display: "none" },
                { display: "none" },
                { display: "flex" },
                { display: "none" },
            ]);
            SignalRChatRoom.getInstance().then((instance) => {
                instance.voteAnotherRound(sessionId);
            });
        } else {
            showNotice("Voting is already in session.");
        }
    }

    function handleWarningClick() {
        if (input && !isVoting) {
            handleLeaveClick();
        } else {
            setLeaveContainer("flex");
        }
    }

    useEffect(() => {
        if (context === undefined) {
            throw new Error("useDataContext must be used within a DataContext");
        } else {
            setMemberCount(context.updateCount);
        }
    }, [context]);

    useEffect(() => {
        if (sessionStorage.getItem("bs_callBack") === null) {
            const callBackFunction = (type: BSCallBackTypes, ideas?: Idea[]) => {
                if (type === BSCallBackTypes.ReceiveBSStart) {
                    startTimer();
                    setInput(false);
                    showNotice("Session has started");
                } else if (type === BSCallBackTypes.ReceiveBSEnd) {
                    setInput(true);
                    clearInterval(interval.current);
                    showNotice("Session has ended");
                    SignalRChatRoom.getInstance().then(async (instance) => {
                        await instance.sendAllIdeas(sessionId, UserInfo.getLocalIdeas());
                        UserInfo.clearIdea();
                        setLocalIdeaList(UserInfo.getLocalIdeas());
                    });
                } else if (type === BSCallBackTypes.ReceiveBSIdeas) {
                    sessionStorage.setItem("ideaList", JSON.stringify(ideas));
                    UserInfo.updateIdeaList();
                    setTimer(Number(location.timer));
                    startTimer();
                    setIdeaList(UserInfo.getIdeasList());
                    setIsVoting(true);
                    showNotice("Voting has started");
                } else if (type === BSCallBackTypes.ReceiveBSVoteResults) {
                    sessionStorage.setItem("ideaList", JSON.stringify(ideas));
                    UserInfo.updateIdeaList();
                    setIdeaList(UserInfo.getIdeasList());
                    showNotice("Here are the voting results");
                } else if (type === BSCallBackTypes.ReceiveBSVote) {
                    clearInterval(interval.current);
                    SignalRChatRoom.getInstance().then(async (instance) => {
                        await instance.sendVotes(sessionId, UserInfo.getIdeasList());
                        UserInfo.clearIdeaList();
                        setIsVoting(false);
                        setIdeaList(UserInfo.getIdeasList());
                    });
                    showNotice("Voting has ended");
                }
            };
            ApiService.buildBSCallBack(callBackFunction);
            sessionStorage.setItem("bs_callBack", "true");
        }
        UserInfo.updateLocalIdea();
        UserInfo.updateIdeaList();
        setLocalIdeaList(UserInfo.getLocalIdeas());
        setIdeaList(UserInfo.getIdeasList());
    }, []);

    return (
        <div className="bs-page-container">
            <div className="bs-header-container">
                <button
                    className="leave-session-button"
                    onClick={handleWarningClick}
                ><img className="exit-icon-bs" src={exitIcon} /></button>
                <BS_HeaderContent
                    roomTitle={sessionTitle}
                    roomDescription={sessionDescription}
                    timer={timer}
                    memberCount={memberCount}
                    creatorId={creatorId}
                />
            </div>
            <div className="bs-body-container">
                <div className="bs-content-container">
                    <BS_OnlineIdeaList content={ideaList} voting={isVoting} />
                    <BS_LocalIdeaList content={localIdeaList} />
                    <div className="bs-bottom-row">
                        <BS_SendPrompt sendFunction={handleSendClick} input={input} />
                        <div
                            className="bs-button-container"
                            style={{ display: UserInfo.isHost(creatorId) ? "flex" : "none" }}
                        >
                            <button
                                className="start-session-button"
                                onClick={handleStartSessionClick}
                                style={displayBtn[0]}
                            >
                                Start
                            </button>
                            <button
                                className="end-session-button"
                                onClick={handleEndSessionClick}
                                style={displayBtn[1]}
                            >
                                End Round
                            </button>
                            <button
                                className="end-vote-button"
                                onClick={handleVotingClick}
                                style={displayBtn[2]}
                            >
                                End Voting
                            </button>
                            <button
                                className="end-vote-button"
                                onClick={handleAnotherVotingRoundClick}
                                style={displayBtn[3]}
                            >
                                Vote Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <LeaveBSPrompt
                display={leaveContainer}
                yesFunction={handleLeaveClick}
                displayFunction={callLeaveContainer}
            />
            <div className="notice-class" style={display}>
                <div>
                    <h1>{noticeMsg}</h1>
                </div>
            </div>
        </div>
    );
}

export default BrainStormPage;
