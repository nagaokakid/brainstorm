import { useEffect, useState } from "react";
import UserInfo from "../../services/UserInfo";

interface Props {
  display: boolean;
}

const Profile = ({ display }: Props) => {
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
    <div className="ProfileWindoww" style={{display: display ? "flex" : "none"}}>
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
    </div>
  );
};

export default Profile;
