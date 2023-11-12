import '../styles/BS_OnlineIdeaList.css';

interface BS_OnlineIdeaListProps {
    content: string[],
}

function BS_OnlineIdeaList(props: BS_OnlineIdeaListProps) {

    return (
        <div className="OnlineIdeasContainer">
            {props.content.map((idea) => {
                return (
                    <div className="Idea">
                        {idea+"sdsd"}
                    </div>
                );
            })}
        </div>
    );
}

export default BS_OnlineIdeaList;