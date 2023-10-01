import { useState } from 'react';

function LogRes()
{

    const [justifyActive, setJustifyActive] = useState('tab1');

    const handleJustifyClick = (value) => {
        if (value === justifyActive) {
            return;
        }

        setJustifyActive(value);
    };

    return (
        <>
            <div className="logResContainer">
                <div className="selectionSection">
                    <ul>
                        <li>
                            <a className="loginBtn" onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
                                Login
                            </a>
                        </li>
                        <li>
                            <a className="resgisterBtn" onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
                                Register
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default LogRes