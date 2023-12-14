import "../styles/UserProfile.css";
import { useEffect, useState } from 'react';
import UserInfo from '../services/UserInfo';
import { useDataContext } from '../contexts/DataContext';

function UserProfile() {
	const context = useDataContext();
	const updateName = context[12];
	const [userInfo, setUserInfo] = useState(UserInfo.getUserInfo()); // Set the user info

	useEffect(() => {
		setUserInfo(UserInfo.getUserInfo());
	}, [updateName]);

	return (
		<div className='user-profile-container'>
			<div className='user-profile-icon'>{userInfo.firstName[0] + userInfo.lastName[0]}</div>
			<div className='user-profile-name'>{userInfo.firstName + " " + userInfo.lastName}</div>
		</div>
	)
}

export default UserProfile