import React from 'react'
import FriendlyUser from '../models/FriendlyUser';
import "../styles/UserProfile.css";

interface Props {
    user: FriendlyUser;
}

const UserProfile = ({user}: Props) => {
  return (
    <div className='UserProfileContainer'>
        <div className='UserProfileIcon'>{user.firstName[0]}{user.lastName[0]}</div>
        <div className='UserProfileName'>{user.firstName} {user.lastName}</div>
    </div>
  )
}

export default UserProfile