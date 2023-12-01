import "../styles/LoginPage.css"
import LoginForm from "../components/LoginForm"
import GuestForm from "../components/GuestForm"

/*
 * LoginPage.tsx
 * -------------------------
 * This is the login page.
 * -----------------------------------------------------------------------
 * Author:  Mr. Yee Tsung (Jackson) Kao
 * Date Created:  01/12/2023
 * Last Modified: 01/12/2023
 * Version: 1.0
*/
function LoginPage() {
    // Clear the session and local storage
    sessionStorage.clear();
    localStorage.clear();

    return (
        <>
            <div className="PageContainer">
                <div className="ContentContainer">
                    <div className="TitleContainer">
                        <h1 className="Title">Welcome to <span className="TitleSpan">Brainstorm</span></h1>
                    </div>
                    <div className="Content">
                        <div className="MemberContainer">
                            <div className="FormContainer">
                                <LoginForm />
                            </div>
                        </div>
                        <div className="VerticalLine"></div>
                        <div className="GuestContainer">
                            <div className="GuestFormContainer">
                                <GuestForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage