import "../styles/LoginPage.css"
import LogRes from "../components/LogRes"
import GuestJoin from "../components/GuestJoin"

/**
 * 
 * @returns The login page of the application
 */
function LoginPage()
{
    return (
        <>
            <div className="PageContainer">
                <div className="InfoContainer">
                    <div className="MemberContainer">
                        <div className="FormContainer">
                            <LogRes />
                        </div>
                    </div>
                    <div className="VerticalLine"></div>
                    <div className="GuestContainer">
                        <div className="GuestFormContainer">
                            <GuestJoin />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage