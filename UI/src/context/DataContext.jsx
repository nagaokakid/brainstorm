/* eslint-disable react/prop-types */
import { createContext, useReducer, useState } from 'react';

export const DataContext = createContext();
export const DataDispatchContext = createContext();

export function DataContextProvider({ children }) {
    const [tasks, dispatch] = useReducer(
        tasksReducer,
        initialTasks
    );

    const [chatRoom, setChatRoom] = useState(true);
    const [directMessage, setDirectMessage] = useState(true);
    const [chatMessage, setChatMessage] = useState(true);
    const [chatRoomInfo, setChatRoomInfo] = useState(true);

    return (
        <DataContext.Provider value={[chatRoom, directMessage, chatMessage, chatRoomInfo]}>
            <DataDispatchContext.Provider value={[setChatRoom, setDirectMessage, setChatMessage, setChatRoomInfo]}>
                {children}
            </DataDispatchContext.Provider>
        </DataContext.Provider>
    );
}

function tasksReducer(tasks, action) {
    switch (action.type) {
        case 'added': {
            return [...tasks, {
                id: action.id,
                text: action.text,
                done: false
            }];
        }
        case 'changed': {
            return tasks.map(t => {
                if (t.id === action.task.id) {
                    return action.task;
                } else {
                    return t;
                }
            });
        }
        case 'deleted': {
            return tasks.filter(t => t.id !== action.id);
        }
        case 'push': {
            return [...tasks, {
                id: action.id,
                text: action.text,
                done: false
            }];
        }
        case 'updateChatMessage': {
            return tasks[0].trigger = !tasks[0].trigger
            // return;
        }
        case 'updateDirectMessage': {
            return tasks[1].trigger = !tasks[1].trigger
            // return;
        }
        case 'updateChatRoom': {
            return tasks[2].trigger = !tasks[2].trigger
            // return;
        }
        case 'print': {
            return console.log("inside context", tasks);
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

const initialTasks = [
    {
        id: 1,
        trigger: true,
    },
    {
        id: 2,
        trigger: true,
    },
    {
        id: 3,
        trigger: true,
    }
];
