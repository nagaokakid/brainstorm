import "../styles/loginPage.css"
import LogRes from "../components/logRes"

function loginPage() {
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

export default loginPage