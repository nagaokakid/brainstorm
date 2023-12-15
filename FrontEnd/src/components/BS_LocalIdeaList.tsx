import '../styles/BS_LocalIdeaList.css';
import UserInfo from '../services/UserInfo';
import { useEffect, useState } from 'react';
import deleteIcon from '../assets/delete.png'

interface BS_LocalIdeaListProps {
    content: string[],
}

/**
 *  BS_LocalIdeaList.tsx 
 * -------------------------
 *  This component is the local idea list of the brain storm page.
 *  It contains the list of ideas that the user has created.
 * -----------------------------------------------------------------------
 *  Author:  Mr. Yee Tsung (Jackson) Kao
 */
function BS_LocalIdeaList(props: BS_LocalIdeaListProps) {
    const [display, setDisplay] = useState("none");
    const [forceUpdate, setForceUpdate] = useState(false);

    /**
     * Handle the delete click event
     * @param position The position of the idea in the list
     */
    function handleDeleteClick(position: number) {
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
        <div className="local-ideas-container" style={{ display: display }}>
            <h1>Current Ideas:</h1>
            {props.content.map((idea, id) => {
                return (
                    <div className="Idea" key={id}>
                        {idea}
                        <button className='local-idea-delete-button' onClick={() => handleDeleteClick(id)}>
                            <img src={deleteIcon} width={20} height={20} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default BS_LocalIdeaList;