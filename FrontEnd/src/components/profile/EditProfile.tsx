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
import "../../styles/profile/EditProfile.css";

interface EditProfileProps {
    display: { display: DisplayTypes };
}

/**
*  EditProfile.tsx 
* -------------------------
*  This component is the edit profile of the profile page.
* -----------------------------------------------------------------------
*  Authors:  Mr. Yee Tsung (Jackson) Kao & Roland Fehr
*/
function EditProfile(props: EditProfileProps) {
    const navigate = useNavigate();
    const context = useDataContext();
    const updateNameFunction = context[13]; // This is the function to update the user info UI
    const [style, setStyle] = useState(props.display); // Set the style of the component
    const [showError, setShowError] = useState(DisplayTypes.None); // Set the error display
    const [errorMsg, setErrorMsg] = useState(ErrorMessages.Empty); // Set the error message
    const [input, setInput] = useState({} as loginObject); // Set the input

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
    function handleCancelButton() {
        clearInput();
        setShowError(DisplayTypes.None);
        handleExitButton();
    }

    /**
     * Handle the delete button
     */
    async function handleDeleteButton() {
        const result = await ApiService.DeleteUser(); // Delete the user

        if (result) {
            UserInfo.clearAccount(); // Clear the user info
            await SignalRChatRoom.getInstance().then((value) => value.reset());
            await SignalRDirect.getInstance().then((value) => value.reset());
            sessionStorage.clear(); // Clear the session storage
            navigate("/"); // Redirect to the login page
        } else {
            setErrorMsg(ErrorMessages.DeleteAccountFailed);
            setShowError(DisplayTypes.Flex);
        }
    }

    /**
     * Handle the save button
     */
    async function handleSaveButton() {
        if ((input.password || input.rePassword) && input.password !== input.rePassword) {
            setErrorMsg(ErrorMessages.PasswordNotMatch);
            setShowError(DisplayTypes.Flex);
            return;
        } else if (input.firstName === "" || input.lastName === "") {
            setErrorMsg(ErrorMessages.NameEmpty);
            setShowError(DisplayTypes.Flex);
            return;
        } else {
            const result = await ApiService.EditUser(
                input.username,
                input.password,
                input.firstName ?? "",
                input.lastName ?? ""
            );

            if (result) {
                updateNameFunction(true); // Force the user info UI to update
                clearInput();
                handleExitButton();
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
    function handleInputChange(value: React.ChangeEvent<HTMLInputElement>) {
        const id = value.target.id;
        const info = value.target.value;
        setInput((prev: typeof input) => {
            return { ...prev, [id]: info };
        });
        setShowError(DisplayTypes.None);
    }

    /**
     * This will handle the exit button
     */
    function handleExitButton() {
        setStyle({ display: DisplayTypes.None });
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

    useEffect(() => {
        setInput({
            username: "",
            password: "",
            rePassword: "",
            firstName: UserInfo.getUserInfo().firstName,
            lastName: UserInfo.getUserInfo().lastName,
        });
        setStyle(props.display);
    }, [props.display]);

    return (
        <div className="edit-profile-container" style={style} onClick={() => setStyle({ display: DisplayTypes.None })}>
            <div className="edit-profile-window" onClick={handleChildClick}>
                <div className="edit-profile-title-container">
                    <div className="edit-profile-title">Profile</div>
                    <button className="delete-profile-button" onClick={handleDeleteButton}>
                        Delete Account
                    </button>
                </div>
                <form className="edit-profile-form" id="EditProfileForm">
                    <MDBInput wrapperClass='mb-4' label='Username' id='username' type='text' autoComplete='off' value={input.username ?? ""} onChange={handleInputChange} />
                    <MDBInput wrapperClass='mb-4' label='First name' id='firstName' type='text' autoComplete='off' value={input.firstName ?? ""} onChange={handleInputChange} />
                    <MDBInput wrapperClass='mb-4' label='Last name' id='lastName' type='text' autoComplete='off' value={input.lastName ?? ""} onChange={handleInputChange} />
                    <MDBInput wrapperClass='mb-4' label='Password' id='password' type='Password' autoComplete='off' value={input.password ?? ""} onChange={handleInputChange} />
                    <MDBInput wrapperClass='mb-4' label='Repeat Password' id='rePassword' type='Password' autoComplete='off' value={input.rePassword ?? ""} onChange={handleInputChange} />
                </form>
                <div className="error-msg" style={{ display: showError }}>
                    <div>{errorMsg}</div>
                </div>
                <div className="edit-profile-buttons-container">
                    <button className="cancel-profile-button" onClick={handleCancelButton}>
                        Cancel
                    </button>
                    <button className="save-profile-button" onClick={handleSaveButton}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
