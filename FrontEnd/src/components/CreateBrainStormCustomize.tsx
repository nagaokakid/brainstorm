import { MDBInput } from "mdb-react-ui-kit";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useEffect, useState } from "react";
import { DisplayTypes, ErrorMessages } from "../models/EnumObjects";
import { chatRoomObject, directMessageObject } from "../models/TypesDefine";
import SignalRChatRoom from "../services/ChatRoomConnection";
import "../styles/CreateBrainStormCustomize.css";

interface CreateBrainStormCustomizeProps {
    style: { display: DisplayTypes };
    chat: chatRoomObject | directMessageObject | null;
}

/**
 *  CreateBrainStormCustomize.tsx 
 * -------------------------
 *  This component is the create brainstorm customize window of the chat page.
 *  It contains the input fields for the user to enter the brainstorm session name and description.
 * -----------------------------------------------------------------------
 *  Authors:  Mr. Yee Tsung (Jackson) Kao & Mr. Roland Fehr
 */
function CreateBrainStormCustomize(props: CreateBrainStormCustomizeProps) {
    const [style, setStyle] = useState(props.style); // Set the style of the component
    const [errorMsg, setErrorMsg] = useState(ErrorMessages.Empty); // Set the error message
    const [errorDisplay, setErrorDisplay] = useState({ display: DisplayTypes.None }); // Set the error display
    const [BSInfo, setBSInfo] = useState({ BSname: "", BSdescription: "", BStimer: "" }); // Set the brainstorm session info

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
    async function handleCreateButton() {
        setErrorDisplay({ display: DisplayTypes.None });
        const button = document.getElementById("createBs") as HTMLButtonElement;

        button.disabled = true;
        if (!BSInfo.BSname || !BSInfo.BSdescription) {
            setErrorMsg(ErrorMessages.FormIncomplete);
            setErrorDisplay({ display: DisplayTypes.Block });
            button.disabled = false;
        } else {
            await SignalRChatRoom.getInstance().then(async (value) => {
                await value.createBrainstormSession(
                    BSInfo.BSname,
                    BSInfo.BSdescription,
                    props.chat ? ("id" in props.chat ? props.chat.id : "") : "",
                    BSInfo.BStimer
                ).then((value) => {
                    if (value) {
                        handleCancelButton();
                    } else {
                        setErrorMsg(ErrorMessages.FailedToCreateBSsession);
                        setErrorDisplay({ display: DisplayTypes.Block });
                    }
                });
            });
            button.disabled = false;
        }
    }

    /**
       * Handle the changed event
       * @param e 
       */
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = e.target;
        setBSInfo(prev => ({ ...prev, [id]: value }));
    }

    /**
     * Clear the input fields and close the window
     */
    function handleCancelButton() {
        (document.getElementById("BSForm") as HTMLFormElement).reset();
        Object.keys(BSInfo).forEach((key) => {
            setBSInfo(prev => ({ ...prev, [key]: "" }));
        });
        setStyle({ display: DisplayTypes.None });
    }

    useEffect(() => {
        setStyle(props.style);
    }, [props.style]);

    return (
        <div className="create-brainstorm-window" style={style} onClick={() => setStyle({ display: DisplayTypes.None })}>
            <div className="bs-info-window" onClick={handleChildClick}>
                <h1>Create Brainstorm Session</h1>
                <form className="create-bs-form" id="BSForm">
                    <MDBInput wrapperClass='mb-4' label='Title' id='BSname' type='text' autoComplete='off' value={BSInfo.BSname} onChange={handleInputChange} />
                    <MDBInput wrapperClass='mb-4' label='Description' id='BSdescription' type='text' autoComplete='off' value={BSInfo.BSdescription} onChange={handleInputChange} />
                    <MDBInput wrapperClass='mb-4' label='Enter Time in Seconds' id='BStimer' type='number' autoComplete='off' value={BSInfo.BStimer} onChange={handleInputChange} />
                </form>
                <div>
                    <button className="cancel-btn" onClick={handleCancelButton}>
                        Cancel
                    </button>
                    <button className="create-btn" id="createBs" onClick={handleCreateButton}>
                        Create
                    </button>
                </div>
                <h5 className="error-msg" style={errorDisplay}>
                    {errorMsg}
                </h5>
            </div>
        </div>
    );
}

export default CreateBrainStormCustomize;
