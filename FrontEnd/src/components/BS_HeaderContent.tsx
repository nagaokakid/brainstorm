import { useEffect } from 'react';
import '../styles/BS_HeaderContent.css';

interface BS_HeaderContentProps {
    roomTitle: string,
    roomDescription: string,
}

function BS_HeaderContent(props: BS_HeaderContentProps) {

    useEffect(() => {
        const iconButton = document.getElementById("InfoIcon");
        if (iconButton) {
            iconButton.addEventListener("mouseover", () => {
                const infoContent = document.getElementsByClassName("InfoContent")[0] as HTMLElement;
                infoContent.style.display = "flex";
            });
            iconButton.addEventListener("mouseout", () => {
                const infoContent = document.getElementsByClassName("InfoContent")[0] as HTMLElement;
                infoContent.style.display = "none";
            });
        }
    }, []);

    return (
        <div className="HeaderContent">
            <div className="HeaderContentTitle">
                <h1>{props.roomTitle}</h1>
                <i className="InfoIcon" id='InfoIcon'></i>
            </div>
            <div className='InfoContent'>
                <p>{props.roomDescription}</p>
            </div>
        </div>
    );
}

export default BS_HeaderContent;