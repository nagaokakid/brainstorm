/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import '../styles/MsgBox.css'
import AppInfo from "../services/appInfo";

function MsgBox(props)
{
    // const ref = useRef();

    // useEffect(() => {
    //     ref.current?.scrollIntoView({ behavior: "smooth" });
    // }, [message]);

    // const toHoursAndMinutes = (totalSeconds) => {
    //     const totalMinutes = Math.floor(totalSeconds / 60);
    //     const seconds = Math.floor(totalSeconds % 60);
    //     const hours = Math.floor(totalMinutes / 60);
    //     const minutes = Math.floor(totalMinutes % 60);
    //     if (hours !== 0) {
    //         return `${hours} Hours Ago`;
    //     } else if (hours === 0 && minutes !== 0) {
    //         return `${minutes} Minutes Ago`;
    //     } else if (hours === 0 && minutes === 0 && seconds !== 0) {
    //         return `${seconds} Seconds Ago`;
    //     } else if (hours === 0 && minutes === 0 && seconds === 0) {
    //         return "Just now";
    //     }
    // };

    const [position, setPosition] = useState("");

    useEffect(() => {
        if (props.user === AppInfo.getUserId())
        {
            setPosition("end");
        }
        else
        {
            setPosition("start");
        }
    }, [props.user]);

    return (
        <div className="MessageContainer" style={{justifyContent:position}}>
            <p>{props.message}</p>
        </div>
    );
}

export default MsgBox;