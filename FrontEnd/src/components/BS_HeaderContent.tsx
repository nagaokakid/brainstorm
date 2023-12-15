import { useEffect } from "react";
import "../styles/BS_HeaderContent.css";
import userIcon from "../assets/group-chat.png";
import hourGlassIcon from "../assets/whiteHourGlass.png";

interface BS_HeaderContentProps {
    roomTitle: string;
    roomDescription: string;
    timer: number;
    memberCount: number;
    creatorId: string;
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
        <div className="header-content">
            <div className="bs_member-count">
                <img
                    className="joined-icon-bs"
                    src={userIcon}
                    style={{ fontWeight: "bold" }}
                />
                <div>{props.memberCount}</div>
            </div>
            <div className="header-content-title">
                <div className="bs-title">{props.roomTitle}</div>
                <div className="bs-description">{props.roomDescription}</div>
            </div>
            <div className="bs-timer">
                <img src={hourGlassIcon} width={30} /> {props.timer.toString()} sec
            </div>
        </div>
    );
}

export default BS_HeaderContent;
