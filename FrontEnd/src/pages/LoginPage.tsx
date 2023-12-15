import "../styles/LoginPage.css"
import LoginForm from "../components/LoginForm"
import GuestForm from "../components/GuestForm"

/**
 * LoginPage.tsx
 * -------------------------
 * This is the login page.
 * -----------------------------------------------------------------------
 * Author:  Mr. Yee Tsung (Jackson) Kao
*/
function LoginPage() {
    // Clear the session and local storage
    sessionStorage.clear();
    localStorage.clear();

    return (
        <div className="loginpage-container">
            <div className="content-container">
                <div className="title-container">
                    <h1 className="title">Welcome to Brainstorm</h1>
                </div>
                <div className="content">
                    <div className="member-form-container">
                        <div className="form-content">
                            <LoginForm />
                        </div>
                    </div>
                    <div className="vertical-line"></div>
                    <div className="guest-form-container">
                        <div className="form-content">
                            <GuestForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage