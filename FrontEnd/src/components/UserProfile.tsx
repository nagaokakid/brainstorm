import "../styles/UserProfile.css";
import { useEffect, useState } from 'react';
import UserInfo from '../services/UserInfo';
import { useDataContext } from '../contexts/DataContext';
import { userInfoObject } from "../models/TypesDefine";

interface UserProfileProps {
	user?: userInfoObject;
}

function UserProfile(props: UserProfileProps) {
	const context = useDataContext();
	const updateName = context.updateName; // Trigger re-render when name is updated
	const [userInfo, setUserInfo] = useState(props.user ?? UserInfo.getUserInfo()); // Set the user info

	useEffect(() => {
		setUserInfo(props.user ?? UserInfo.getUserInfo());
	}, [props.user, updateName]);

	return (
		<div className='user-profile-container'>
			<div className='user-profile-icon'>{userInfo.firstName[0] + userInfo.lastName[0]}</div>
			<div className='user-profile-name'>{userInfo.firstName + " " + userInfo.lastName}</div>
		</div>
	)
}

export default UserProfile