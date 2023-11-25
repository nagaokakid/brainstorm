import { useEffect } from "react";
import "../styles/BS_HeaderContent.css";

interface BS_HeaderContentProps {
  roomTitle: string;
  roomDescription: string;
  timer: Number
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
      <div className="BS_MemberCount">Joined: 0</div>
      <div className="HeaderContentTitle">
        <div className="BS_Title">{props.roomTitle}</div>
        <div className="BS_Description">{props.roomDescription}</div>
      </div>
      <div className="BS_Timer">Time Left: {props.timer.toString()}</div>
    </div>
  );
}

export default BS_HeaderContent;
