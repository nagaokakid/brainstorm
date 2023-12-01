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

function BrainStormPage() {
  const Navigate = useNavigate();
  const [isVoting, setIsVoting] = useState(false);
  const [ideaList, setIdeaList] = useState([] as Idea[]);
  const [localIdeaList, setLocalIdeaList] = useState([] as string[]);
  const [leaveContainer, setLeaveContainer] = useState("none");
  const [input, setInput] = useState(true);
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

  // useEffect(() => {
  //   if (timer) {
  //     console.log("number", timer);

  //     setTimer(Number(location.timer));
  //   }
  // }, []);

  useEffect(() => {
    if (timer === 0 && !input) {
      clearInterval(interval.current);
      setTimer(Number(location.timer));

      handleEndSessionClick();
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
    await ApiService.leaveBSSession(creatorId, sessionId);
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
        instance.startSession(sessionId, timer);
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

  useEffect(() => {
    if (context === undefined) {
      throw new Error("useDataContext must be used within a DataContext");
    } else {
      setMemberCount(context[6]);
    }
  }, [context]);

  useEffect(() => {
    if (sessionStorage.getItem("bs_callBack") === null) {
      const callBackFunction = (type: number, ideas?: Idea[]) => {
        if (type === 1) {
          startTimer();
          setInput(false);
          showNotice("Session has started");
        } else if (type === 2) {
          setInput(true);
          showNotice("Session has ended");
          SignalRChatRoom.getInstance().then(async (instance) => {
            await instance.sendAllIdeas(sessionId, UserInfo.getLocalIdeas());
            UserInfo.clearIdea();
            setLocalIdeaList(UserInfo.getLocalIdeas());
          });
        } else if (type === 3) {
          sessionStorage.setItem("ideaList", JSON.stringify(ideas));
          UserInfo.updateIdeaList();
          setIdeaList(UserInfo.getIdeasList());
          setIsVoting(true);
          showNotice("Voting has started");
        } else if (type === 4) {
          sessionStorage.setItem("ideaList", JSON.stringify(ideas));
          UserInfo.updateIdeaList();
          setIdeaList(UserInfo.getIdeasList());
          showNotice("Here are the voting results");
        } else if (type === 5) {
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
    <div className="BS_PageContainer">
      <div className="BS_HeaderContainer">
        <button
          className="LeaveSessionButton"
          onClick={() => setLeaveContainer("flex")}
        ></button>
        <BS_HeaderContent
          roomTitle={sessionTitle}
          roomDescription={sessionDescription}
          timer={timer}
          memberCount={memberCount}
        />
      </div>
      <div className="BS_BodyContainer">
        <div className="BS_ContentContainer">
          <BS_OnlineIdeaList content={ideaList} voting={isVoting} />
          <BS_LocalIdeaList content={localIdeaList} />
          <div className="BS_BottomRow">
            <BS_SendPrompt sendFunction={handleSendClick} input={input} />
            <div
              className="BS_ButtonContainer"
              style={{ display: UserInfo.isHost(creatorId) ? "flex" : "none" }}
            >
              <button
                className="StartSessionButton"
                onClick={handleStartSessionClick}
                style={displayBtn[0]}
              >
                Start
              </button>
              <button
                className="EndSessionButton"
                onClick={handleEndSessionClick}
                style={displayBtn[1]}
              >
                End Round
              </button>
              <button
                className="EndVoteButton"
                onClick={handleVotingClick}
                style={displayBtn[2]}
              >
                End Voting
              </button>
              <button
                className="EndVoteButton"
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
        content={"Leave the Session?"}
        display={leaveContainer}
        yesFunction={handleLeaveClick}
        displayFunction={callLeaveContainer}
      />
      <div className="NoticeClass" style={display}>
        <div>
          <h1>{noticeMsg}</h1>
        </div>
      </div>
    </div>
  );
}

export default BrainStormPage;
