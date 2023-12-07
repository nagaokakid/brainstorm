import { useEffect } from "react";
import "../styles/BS_HeaderContent.css";
import userIcon from "../assets/group-chat.png";
import hourGlassIcon from "../assets/whiteHourGlass.png";

interface BS_HeaderContentProps {
  roomTitle: string;
  roomDescription: string;
  timer: number;
  memberCount: number;
}

function BS_HeaderContent(props: BS_HeaderContentProps) {
  useEffect(() => {
    const iconButton = document.getElementById("InfoIcon");
    if (iconButton) {
      iconButton.addEventListener("mouseover", () => {
        const infoContent = document.getElementsByClassName(
          "InfoContent"
        )[0] as HTMLElement;
        infoContent.style.display = "flex";
      });
      iconButton.addEventListener("mouseout", () => {
        const infoContent = document.getElementsByClassName(
          "InfoContent"
        )[0] as HTMLElement;
        infoContent.style.display = "none";
      });
    }
  }, []);

  return (
    <div className="HeaderContent">
      <div className="BS_MemberCount">
        <img
          className="JoinedIcon_BS"
          src={userIcon}
          style={{ fontWeight: "bold" }}
        />
        <div>{props.memberCount}</div>
      </div>
      <div className="HeaderContentTitle">
        <div className="BS_Title">{props.roomTitle}</div>
        <div className="BS_Description">{props.roomDescription}</div>
      </div>
      <div className="BS_Timer">
        <img src={hourGlassIcon} width={30}/> {props.timer.toString()} sec
      </div>
      <div className="Note">
        <p>You Are The Host</p>
      </div>
    </div>
  );
}

export default BS_HeaderContent;
