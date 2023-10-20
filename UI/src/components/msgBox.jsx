/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import '../styles/MsgBox.css'
import AppInfo from "../services/AppInfo";

/**
 * 
 * @param {*} message The message to be displayed 
 * @param {*} user The user that sent the message
 * @returns 
 */
function MsgBox(props)
{
    // Set the default position of the message box; either "right" or "left"
    const [position, setPosition] = useState("");

    // Scroll to the bottom of the message box
    const ref = useRef();

    // Scroll to the bottom of the message box when the message changes
    useEffect(() =>
    {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [props.message]);

    // Set the position of the message box
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