import { useEffect, useState } from "react";
import UserInfo from "../../services/UserInfo";
import "../../styles/profile/Profile.css"
import ApiService from "../../services/ApiService";

interface Props {
  clickedExit: () => void;
}

const Profile = ({ clickedExit }: Props) => {
  const [first, setFirst] = useState<string>("");
  const [last, setLast] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");

  console.log("loaded profile");

  async function handleCancel(){
    clickedExit();
    clearInput();
  }

  async function handleDelete(){
    await ApiService.DeleteUser()
    clearInput();

    // navigate to login page
  }

  async function handleSaveProfile(){
    await ApiService.EditUser(username, password1, first, last)
    clickedExit()
    clearInput();
  }

  function clearInput(){
    (document.getElementById("EditProfileForm") as HTMLFormElement).reset
  }

  useEffect(() => {
    const result = UserInfo.getCurrentUser();
    setFirst(result.userInfo.firstName);
    setLast(result.userInfo.lastName);
    console.log("loaded profile");
  }, []);
  return (
    <div className="ProfileWindoww">
      <div>Profile</div>
      <form className="RegisterForm" id="EditProfileForm">
        <input
          className="Username"
          id="Username1"
          placeholder="Username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="FirstName"
          id="FirstName"
          placeholder="First Name"
          type="text"
          value={first}
          onChange={(e) => setFirst(e.target.value)}
          />
        <input
          className="LastName"
          id="LastName"
          placeholder="Last Name"
          type="text"
          value={last}
          onChange={(e) => setLast(e.target.value)}
          />
        <input
          className="Password"
          id="Password1"
          placeholder="Password"
          type="Password"
          onChange={(e) => setPassword1(e.target.value)}
          />
        <input
          className="RePassword"
          id="RePassword"
          placeholder="Re-Password"
          type="Password"
          onChange={(e) => setPassword2(e.target.value)}
        />
      </form>
      <div className="ProfileButtonsContainer">
        <button className="DeleteProfileButton" onClick={handleDelete}>Delete</button>
        <button className="CancelProfileButton" onClick={handleCancel}>Cancel</button>
        <button className="SaveProfileButton" onClick={handleSaveProfile}>Save</button>
      </div>
    </div>
  );
};

export default Profile;
