import { useContext, useEffect, useRef } from "react";

function Message({ message, id })
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

    return (
        <div className="messageContent">
            <p>{message}</p>
        </div>
    );
}

export default Message;