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
  *  -----------------------------------------------------------------------
  * Authors:  Mr. Yee Tsung (Jackson) Kao & Mr. Roland Fehr
  * Date Created:  01/12/2023
  * Last Modified: 01/12/2023
  * Version: 1.0
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
  async function handleCreateClick() {
    setErrorDisplay({ display: DisplayTypes.None });
    const button = document.getElementById("createBs") as HTMLButtonElement;

    button.disabled = true;
    if (BSInfo.BSname === "" || BSInfo.BSdescription === "") {
      setErrorMsg(ErrorMessages.FormIncomplete);
      setErrorDisplay({ display: DisplayTypes.Block });
      button.disabled = false;
    } else {
      await SignalRChatRoom.getInstance().then((value) => {
        value
          .createBrainstormSession(
            BSInfo.BSname,
            BSInfo.BSdescription,
            props.chat ? ("id" in props.chat ? props.chat.id : "") : "",
            BSInfo.BStimer
          )
          .then((value) => {
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
  function handleChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setBSInfo(prev => ({ ...prev, [id]: value }));
  }

  function handleCancelButton() {
    Object.keys(BSInfo).forEach((key) => {
      setBSInfo(prev => ({ ...prev, [key]: "" }));
    });
    setStyle({ display: DisplayTypes.None });
  }


  useEffect(() => {
    setStyle(props.style);
  }, [props.style]);

  return (
    <div
      className="CreateBrainStormCustomizeWindow"
      style={style}
      onClick={() => setStyle({ display: DisplayTypes.None })}
    >
      <div className="BSinfoWindow" onClick={handleChildClick}>
        <h1>Create Brainstorm Session</h1>
        <form className="CreateBSForm">
          <MDBInput wrapperClass='mb-4' label='Title' id='BSname' type='text' autoComplete='off' value={BSInfo.BSname} onChange={handleChanged} />
          <MDBInput wrapperClass='mb-4' label='Description' id='BSdescription' type='text' autoComplete='off' value={BSInfo.BSdescription} onChange={handleChanged} />
          <MDBInput wrapperClass='mb-4' label='Enter Time in Seconds' id='BStimer' type='number' autoComplete='off' value={BSInfo.BStimer} onChange={handleChanged} />
        </form>
        <div>
          <button className="CancelBtn" onClick={handleCancelButton}>
            Cancel
          </button>
          <button className="CreateBtn" id="createBs" onClick={handleCreateClick}>
            Create
          </button>
        </div>
        <h5 className="ErrorMsg" style={errorDisplay}>
          {errorMsg}
        </h5>
      </div>
    </div>
  );
}

export default CreateBrainStormCustomize;
