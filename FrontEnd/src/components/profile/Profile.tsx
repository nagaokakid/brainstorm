import { useEffect, useState } from "react";
import UserInfo from "../../services/UserInfo";
import "../../styles/profile/Profile.css"

interface Props {
  clickedExit: () => void;
}

const Profile = ({ clickedExit }: Props) => {
  const [first, setFirst] = useState<string>();
  const [last, setLast] = useState<string>();
  console.log("loaded profile");

  useEffect(() => {
    const result = UserInfo.getCurrentUser();
    setFirst(result.userInfo.firstName);
    setLast(result.userInfo.lastName);
    console.log("loaded profile");
  }, []);
  return (
    <div className="ProfileWindoww">
      <div>Profile</div>
      <form className="RegisterForm" id="RegisterForm">
        <input
          className="Username"
          id="Username1"
          placeholder="Username"
          type="text"
        />
        <input
          className="FirstName"
          id="FirstName"
          placeholder="First Name"
          type="text"
          value={first}
        />
        <input
          className="LastName"
          id="LastName"
          placeholder="Last Name"
          type="text"
          value={last}
        />
        <input
          className="Password"
          id="Password1"
          placeholder="Password"
          type="Password"
        />
        <input
          className="RePassword"
          id="RePassword"
          placeholder="Re-Password"
          type="Password"
        />
      </form>
      <div className="ProfileButtonsContainer">
        <button className="DeleteProfileButton" onClick={clickedExit}>Delete</button>
        <button className="CancelProfileButton" onClick={clickedExit}>Cancel</button>
        <button className="SaveProfileButton" onClick={clickedExit}>Save</button>
      </div>
    </div>
  );
};

export default Profile;
