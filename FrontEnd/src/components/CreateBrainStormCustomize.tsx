import '../styles/CreateBrainStormCustomize.css';
import SignalRChatRoom from '../services/ChatRoomConnection';
import { chatRoomObject, directMessageObject } from '../services/TypesDefine';

interface CreateBrainStormCustomizeProps {
    style: string,
    chat: chatRoomObject | directMessageObject | null,
    callBackFunction: (e: string) => void
}

function CreateBrainStormCustomize(props: CreateBrainStormCustomizeProps) {

    // Set the component to be hidden and pass back the selected option
    function handleOptionClick(e: string) {
        props.callBackFunction(e)
    }

    function handleChildClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    async function handleCreateClick() {
        const button = document.getElementById('createBs') as HTMLButtonElement;
        const name = (document.getElementById('BSname') as HTMLInputElement).value;
        const description = (document.getElementById('BSdescription') as HTMLInputElement).value;
        const timer = (document.getElementById('BStimer') as HTMLInputElement).value;

        button.disabled = true;
        if (name === "" || description === "") {
            alert("Please fill in all the fields");
            button.disabled = false;
            return;
        } else {
            (document.getElementById('BSname') as HTMLInputElement).value = "";
            (document.getElementById('BSdescription') as HTMLInputElement).value = "";
            (document.getElementById('BStimer') as HTMLInputElement).value = "";


            await SignalRChatRoom.getInstance().then((value) => {
                value.createBrainstormSession(name, description, timer , props.chat ? ("id" in props.chat ? props.chat.id : "") : "").then((value) => {
                    if (value) {
                        handleOptionClick("none");
                    } else {
                        alert("Failed to create brainstorm session");
                    }
                });
            });
            button.disabled = false;
        }
    }

    return (
        <div className='CreateBrainStormCustomizeWindow' style={{ display: props.style }} onClick={() => handleOptionClick("none")}>
            <div className='BSinfoWindow' onClick={handleChildClick}>
                <h1>Create Brain Storm</h1>
                <input type="text" id='BSname' placeholder='Name' />
                <input type="text" id="BSdescription" placeholder='Description' />
                <input type="text" id="BStimer" placeholder='Enter Time in Minutes' />
                <button id='createBs' onClick={handleCreateClick}>Create</button>
            </div>
        </div>
    );
}

export default CreateBrainStormCustomize;