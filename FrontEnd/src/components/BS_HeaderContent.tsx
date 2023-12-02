import { useEffect } from "react";
import "../styles/BS_HeaderContent.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClock } from '@fortawesome/free-solid-svg-icons';
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
      <div className="BS_MemberCount"><FontAwesomeIcon icon={faUsers} title="Total People Joined" />  {props.memberCount}</div>
      <div className="HeaderContentTitle">
        <div className="BS_Title">{props.roomTitle}</div>
        <div className="BS_Description">{props.roomDescription}</div>
      </div>
      <div className="BS_Timer"><FontAwesomeIcon icon={faClock} title="Timer" /> {props.timer.toString()}</div>
    </div>
  );
}

export default BS_HeaderContent;
