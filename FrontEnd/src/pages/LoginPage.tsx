import "../styles/LoginPage.css"
import LoginForm from "../components/LoginForm"
import GuestForm from "../components/GuestForm"

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