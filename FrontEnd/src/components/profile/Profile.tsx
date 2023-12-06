import { MDBInput } from "mdb-react-ui-kit";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataContext } from "../../contexts/DataContext";
import { DisplayTypes, ErrorMessages } from "../../models/EnumObjects";
import { loginObject } from "../../models/TypesDefine";
import ApiService from "../../services/ApiService";
import SignalRChatRoom from "../../services/ChatRoomConnection";
import SignalRDirect from "../../services/DirectMessageConnection";
import UserInfo from "../../services/UserInfo";
import "../../styles/profile/Profile.css";

interface Props {
  display: { display: DisplayTypes };
}

function Profile(props: Props) {
  const navigate = useNavigate();
  const context = useDataContext();
  const updateNameFunction = context[13];
  const [style, setStyle] = useState(props.display);
  const [showError, setShowError] = useState(DisplayTypes.None);
  const [errorMsg, setErrorMsg] = useState(ErrorMessages.Empty);
  const [input, setInput] = useState({} as loginObject);

  /**
   * Prevent the child from being clicked
   * @param e
   */
  function handleChildClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  /**
   * Handle the cancel button
   */
  function handleCancel() {
    clearInput();
    setShowError(DisplayTypes.None);
    handleExit();
  }

  /**
   * Handle the delete button
   */
  async function handleDelete() {
    const result = await ApiService.DeleteUser();

    if (result) {
      UserInfo.clearAccount();
      await SignalRChatRoom.getInstance().then((value) => value.reset());
      await SignalRDirect.getInstance().then((value) => value.reset());
      sessionStorage.clear();
      navigate("/");
    } else {
      setErrorMsg(ErrorMessages.DeleteAccountFailed);
      setShowError(DisplayTypes.Flex);
    }
  }

  /**
   * Handle the save button
   */
  async function handleSaveProfile() {
    if (
      (input.Password || input.RePassword) &&
      input.Password !== input.RePassword
    ) {
      setErrorMsg(ErrorMessages.PasswordNotMatch);
      setShowError(DisplayTypes.Flex);
      return;
    } else if (input.FirstName === "" || input.LastName === "") {
      setErrorMsg(ErrorMessages.NameEmpty);
      setShowError(DisplayTypes.Flex);
      return;
    } else {
      const result = await ApiService.EditUser(
        input.Username,
        input.Password,
        input.FirstName ?? "",
        input.LastName ?? ""
      );

      if (result) {
        updateNameFunction(true);
        clearInput();
        handleExit();
        return;
      } else {
        setErrorMsg(ErrorMessages.EditAccountFailed);
        setShowError(DisplayTypes.Flex);
        return;
      }
    }
  }

  /**
   * This will keep track of the inputs and update the state
   * @param value
   */
  function handleChanged(value: React.ChangeEvent<HTMLInputElement>) {
    const id = value.target.id;
    const info = value.target.value;
    setInput((prev: typeof input) => {
      return { ...prev, [id]: info };
    });
    setShowError(DisplayTypes.None);
  }

  /**
   * This clear the input field.
   */
  function clearInput() {
    (document.getElementById("EditProfileForm") as HTMLFormElement).reset;
    Object.keys(input).forEach((key) => {
      setInput((prev: typeof input) => {
        return { ...prev, [key]: "" };
      });
    });
  }

  function handleExit() {
    setStyle({ display: DisplayTypes.None });
  }

  useEffect(() => {
    setInput({
      Username: "",
      Password: "",
      RePassword: "",
      FirstName: UserInfo.getUserInfo().firstName,
      LastName: UserInfo.getUserInfo().lastName,
    });
    setStyle(props.display);
  }, [props.display]);

  return (
    <div
      className="ProfileContainer"
      style={style}
      onClick={() => setStyle({ display: DisplayTypes.None })}
    >
      <div className="ProfileWindow" onClick={handleChildClick}>
        <div className="ProfileContainerTitle">
          <div className="ProfileTitle">Profile</div>
          <button className="DeleteProfileButton" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
        <form className="EditProfileForm" id="EditProfileForm">
          <MDBInput wrapperClass='mb-4' label='Username' id='Username' type='text' autoComplete='off' value={input.Username ?? ""} onChange={handleChanged} />
          <MDBInput wrapperClass='mb-4' label='FirstName' id='FirstName' type='text' autoComplete='off' value={input.FirstName ?? ""} onChange={handleChanged} />
          <MDBInput wrapperClass='mb-4' label='LastName' id='LastName' type='text' autoComplete='off' value={input.LastName ?? ""} onChange={handleChanged} />
          <MDBInput wrapperClass='mb-4' label='Password' id='Password' type='Password' autoComplete='off' value={input.Password ?? ""} onChange={handleChanged} />
          <MDBInput wrapperClass='mb-4' label='RePassword' id='RePassword' type='Password' autoComplete='off' value={input.RePassword ?? ""} onChange={handleChanged} />
        </form>
        <div className="ErrorMessage" style={{ display: showError }}>
          <div>{errorMsg}</div>
        </div>
        <div className="ProfileButtonsContainer">
          <button className="CancelProfileButton" onClick={handleCancel}>
            Cancel
          </button>
          <button className="SaveProfileButton" onClick={handleSaveProfile}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
