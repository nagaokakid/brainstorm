import { useEffect, useState } from "react";
import { DisplayTypes, ErrorMessages } from "../models/EnumObjects";
import { chatRoomObject, directMessageObject } from "../models/TypesDefine";
import SignalRChatRoom from "../services/ChatRoomConnection";
import "../styles/CreateBrainStormCustomize.css";

/*
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

interface CreateBrainStormCustomizeProps {
  style: { display: DisplayTypes };
  chat: chatRoomObject | directMessageObject | null;
}

function CreateBrainStormCustomize(props: CreateBrainStormCustomizeProps) {
  const [style, setStyle] = useState(props.style); // Set the style of the component
  const [errorMsg, setErrorMsg] = useState(ErrorMessages.Empty); // Set the error message
  const [errorDisplay, setErrorDisplay] = useState({ display: DisplayTypes.None }); // Set the error display

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
    const name = (document.getElementById("BSname") as HTMLInputElement).value;
    const description = (
      document.getElementById("BSdescription") as HTMLInputElement
    ).value;
    const timer = (document.getElementById('BStimer') as HTMLInputElement).value;

    button.disabled = true;
    if (name === "" || description === "") {
      setErrorMsg(ErrorMessages.FormIncomplete);
      setErrorDisplay({ display: DisplayTypes.Block });
      button.disabled = false;
    } else {
      (document.getElementById("BSname") as HTMLInputElement).value = "";
      (document.getElementById("BSdescription") as HTMLInputElement).value = "";
      (document.getElementById("BStimer") as HTMLInputElement).value = "";

      await SignalRChatRoom.getInstance().then((value) => {
        value
          .createBrainstormSession(
            name,
            description,
            props.chat ? ("id" in props.chat ? props.chat.id : "") : "",
            timer
          )
          .then((value) => {
            if (value) {
              setStyle({ display: DisplayTypes.None });
            } else {
              setErrorMsg(ErrorMessages.FailedToCreateBSsession);
              setErrorDisplay({ display: DisplayTypes.Block });
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
    <div
      className="CreateBrainStormCustomizeWindow"
      style={style}
      onClick={() => setStyle({ display: DisplayTypes.None })}
    >
      <div className="BSinfoWindow" onClick={handleChildClick}>
        <h1>Create Brainstorm Session</h1>
        <input className="Input" type="text" id="BSname" placeholder="Name" />
        <input className="Input" type="text" id="BSdescription" placeholder="Description" />
        <input className="Input" type="text" id="BStimer" placeholder="Enter Time in Seconds" />
        <div>
          <button className="CancelBtn" onClick={() => {
            (document.getElementById("BSname") as HTMLInputElement).value = "";
            (document.getElementById("BSdescription") as HTMLInputElement).value = "";
            (document.getElementById("BStimer") as HTMLInputElement).value = "";
            setStyle({ display: DisplayTypes.None })
          }
          }>
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
