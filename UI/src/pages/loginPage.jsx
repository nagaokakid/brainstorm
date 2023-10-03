import "../styles/LoginPage.css"
import LogRes from "../components/LogRes"

function LoginPage()
{
    return (
        <>
            <div className="PageContainer">
                <div className="MemberContainer">
                    <div className="FormContainer">
                        <LogRes/>
                    </div>
                </div>
                <div className="GuestContainer">

                </div>
            </div>
        </>
    )
}

export default LoginPage