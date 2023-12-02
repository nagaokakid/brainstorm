import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DisplayTypes, ErrorMessages } from "../../models/EnumObjects";
import { loginObject } from "../../models/TypesDefine";
import ApiService from "../../services/ApiService";
import UserInfo from "../../services/UserInfo";
import "../../styles/profile/Profile.css";

interface Props {
  display: { display: DisplayTypes };
  clickedExit: () => void;
}

function Profile(props: Props) {
  const navigate = useNavigate();
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
    props.clickedExit();
  }

  /**
   * Handle the delete button
   */
  async function handleDelete() {
    await ApiService.DeleteUser();
    navigate("/");
  }

  /**
   * Handle the save button
   */
  async function handleSaveProfile() {
    if ((input.Password || input.RePassword) && input.Password !== input.RePassword) {
      setErrorMsg(ErrorMessages.PasswordNotMatch);
      setShowError(DisplayTypes.Flex);
      return;
    } else {
      await ApiService.EditUser(input.Username, input.Password, input.FirstName ?? "", input.LastName ?? "");
      clearInput();
      props.clickedExit();
    }
  }

  /**
     * This will keep track of the inputs and update the state
     * @param value
     */
  function handleChanged(value: React.ChangeEvent<HTMLInputElement>) {
    const id = value.target.className;
    const info = value.target.value;
    setInput((prev: typeof input) => { return { ...prev, [id]: info } });
    setShowError(DisplayTypes.None);
  }

  /**
   * This clear the input field.
   */
  function clearInput() {
    (document.getElementById("EditProfileForm") as HTMLFormElement).reset;
    Object.keys(input).forEach((key) => {
      setInput((prev: typeof input) => { return { ...prev, [key]: "" } });
    });
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
    <div className="ProfileContainer" style={style} onClick={() => setStyle({ display: DisplayTypes.None })}>
      <div className="ProfileWindow" onClick={handleChildClick}>
        <div>Profile</div>
        <form className="EditProfileForm" id="EditProfileForm">
          <input
            className="Username"
            id="Username1"
            placeholder="Username"
            type="text"
            value={input.Username}
            onChange={handleChanged}
          />
          <input
            className="FirstName"
            id="FirstName"
            placeholder="First Name"
            type="text"
            value={input.FirstName}
            onChange={handleChanged}
          />
          <input
            className="LastName"
            id="LastName"
            placeholder="Last Name"
            type="text"
            value={input.LastName}
            onChange={handleChanged}
          />
          <input
            className="Password"
            id="Password"
            placeholder="Password"
            type="Password"
            onChange={handleChanged}
          />
          <input
            className="RePassword"
            id="RePassword"
            placeholder="Re-Password"
            type="Password"
            onChange={handleChanged}
          />
        </form>
        <div className="ErrorMessage" style={{ display: showError }}>
          <div>{errorMsg}</div>
        </div>
        <div className="ProfileButtonsContainer">
          <button className="DeleteProfileButton" onClick={handleDelete}>Delete</button>
          <button className="CancelProfileButton" onClick={handleCancel}>Cancel</button>
          <button className="SaveProfileButton" onClick={handleSaveProfile}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
