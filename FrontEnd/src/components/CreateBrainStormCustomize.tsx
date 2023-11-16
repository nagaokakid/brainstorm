import '../styles/CreateBrainStormCustomize.css';
import SignalRChatRoom from '../services/ChatRoomConnection';
import { chatRoomObject, directMessageObject } from '../models/TypesDefine';
import { useEffect, useState } from 'react';

interface CreateBrainStormCustomizeProps {
    style: { display: string },
    chat: chatRoomObject | directMessageObject | null,
}

function CreateBrainStormCustomize(props: CreateBrainStormCustomizeProps) {
    const [style, setStyle] = useState(props.style); // Set the style of the component
    const [errorMsg, setErrorMsg] = useState("" as string); // Set the error message
    const [errorDisplay, setErrorDisplay] = useState({ display: "none" }); // Set the error display

    /**
     * Prevent the child from being clicked
     * @param e 
     */
    function handleChildClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    /**
     * Handle the create brainstorm button
     */
    async function handleCreateClick() {
        setErrorDisplay({ display: "none" });
        const button = document.getElementById('createBs') as HTMLButtonElement;
        const name = (document.getElementById('BSname') as HTMLInputElement).value;
        const description = (document.getElementById('BSdescription') as HTMLInputElement).value;
        const timer = (document.getElementById('BStimer') as HTMLInputElement).value;

        button.disabled = true;
        if (name === "" || description === "") {
            setErrorMsg("Please fill in all the fields");
            setErrorDisplay({ display: "block" });
            button.disabled = false;
        } else {
            (document.getElementById('BSname') as HTMLInputElement).value = "";
            (document.getElementById('BSdescription') as HTMLInputElement).value = "";
            (document.getElementById('BStimer') as HTMLInputElement).value = "";


            await SignalRChatRoom.getInstance().then((value) => {
                value.createBrainstormSession(name, description, timer , props.chat ? ("id" in props.chat ? props.chat.id : "") : "").then((value) => {
                    if (value) {
                        setStyle({ display: "none" });
                    } else {
                        setErrorMsg("Failed to create brainstorm");
                        setErrorDisplay({ display: "block" });
                    }
                });
            });
            button.disabled = false;
        }
    }

    useEffect(() => {
        setStyle(props.style);
    }, [props.style]);

    return (
        <div className='CreateBrainStormCustomizeWindow' style={style} onClick={() => setStyle({ display: "none" })}>
            <div className='BSinfoWindow' onClick={handleChildClick}>
                <h1>Create Brain Storm</h1>
                <input type="text" id='BSname' placeholder='Name' />
                <input type="text" id="BSdescription" placeholder='Description' />
                <input type="text" id="BStimer" placeholder='Enter Time in Minutes' />
                <button id='createBs' onClick={handleCreateClick}>Create</button>
                <h5 className='ErrorMsg' style={errorDisplay}>{errorMsg}</h5>
            </div>
        </div>
    );
}

export default CreateBrainStormCustomize;