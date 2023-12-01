import '../styles/BS_LocalIdeaList.css';
import UserInfo from '../services/UserInfo';
import { useEffect, useState } from 'react';

/*
 *  BS_LocalIdeaList.tsx 
 * -------------------------
 *  This component is the local idea list of the brain storm page.
 *  It contains the list of ideas that the user has created.
 *  -----------------------------------------------------------------------
 * Author:  Mr. Yee Tsung (Jackson) Kao
 * Date Created:  01/12/2023
 * Last Modified: 01/12/2023
 * Version: 1.0
 */
interface BS_LocalIdeaListProps {
    content: string[];
    handleFunction: (arg0:string) => void;
}

function BS_LocalIdeaList(props: BS_LocalIdeaListProps) {

    const [display, setDisplay] = useState("none");
    const [forceUpdate, setForceUpdate] = useState(false);

    function handleDeleteClick(position: number, idea: string) {
        props.handleFunction(idea)
        UserInfo.deleteIdea(position);
        props.content.splice(position, 1);
        setForceUpdate(!forceUpdate);
    }

    useEffect(() => {
        if (props.content.length <= 0) {
            setDisplay("none");
        } else {
            setDisplay("block");
        }

    }, [props.content, forceUpdate]);

    return (
        <div className="LocalIdeasContainer" style={{ display: display }}>
            <h1>Current Ideas:</h1>
            {props.content.map((idea, id) => {
                return (
                    <div className="Idea" key={id}>
                        {idea}
                        <button className='DeleteButton' onClick={() => handleDeleteClick(id, idea)}>
                            <img src="src\assets\delete.png" width={20} height={20}/>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default BS_LocalIdeaList;