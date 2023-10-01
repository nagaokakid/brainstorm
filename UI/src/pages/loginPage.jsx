import "../styles/LoginPage.css"
import LogRes from "../components/LogRes"

function LoginPage()
{
    return (
        <>
            <div className="pageContainer">
                <div className="memberContainer">
                    <LogRes/>
                </div>
                <div className="guestContainer">

                </div>
            </div>
        </>
    )
}

export default LoginPage