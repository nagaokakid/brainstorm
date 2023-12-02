import FriendlyUser from '../models/FriendlyUser';
import "../styles/UserProfile.css";

interface Props {
  user: FriendlyUser;
}

function UserProfile(props: Props) {
  return (
    <div className='UserProfileContainer'>
      <div className='UserProfileIcon'>{props.user.firstName[0]}{props.user.lastName[0]}</div>
      <div className='UserProfileName'>{props.user.firstName}{props.user.lastName}</div>
    </div>
  )
}

export default UserProfile