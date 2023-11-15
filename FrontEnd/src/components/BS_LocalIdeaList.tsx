import '../styles/BS_LocalIdeaList.css';
import UserInfo from '../services/UserInfo';
import { useEffect, useState } from 'react';

interface BS_LocalIdeaListProps {
    content: string[],
}

function BS_LocalIdeaList(props: BS_LocalIdeaListProps) {

    const [display, setDisplay] = useState("none");
    const [forceUpdate, setForceUpdate] = useState(false);

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
        <div className="LocalIdeasContainer" style={{ display: display }}>
            <h1>Current Ideas:</h1>
            {props.content.map((idea, id) => {
                return (
                    <div className="Idea" key={id}>
                        {idea}
                        <button onClick={() => handleDeleteClick(id)}>X</button>
                    </div>
                );
            })}
        </div>
    );
}

export default BS_LocalIdeaList;