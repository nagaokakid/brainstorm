import "../styles/LoginPage.css"
import LogRes from "../components/LogRes"
import GuestJoin from "../components/GuestJoin"

function LoginPage() {
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