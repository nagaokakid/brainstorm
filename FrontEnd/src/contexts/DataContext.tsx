/* eslint-disable react-refresh/only-export-components */
import { chatRoomMessageObject, newDirectMessageObject } from '../models/TypesDefine';
import { createContext, useState, useContext, ReactNode } from 'react';

type DataContextProviderProps = {
    children: ReactNode;
};

type DataContextType = [
    boolean,
    (chatRoomMessageObject | newDirectMessageObject),
    (newData: boolean) => void,
    (newMsg: (chatRoomMessageObject | newDirectMessageObject)) => void
];

// Create the context with an initial value
export const DataContext = createContext<DataContextType | undefined>(undefined);

export function useDataContext() {
    const context = useContext(DataContext);

    if (context === undefined) {
        throw new Error('useDataContext must be used within a DataContext');
    }

    return context;
}

export function DataContextProvider({ children }: DataContextProviderProps) {

    const [update, setUpdate] = useState(true);
    const [newMsg, setNewMsg] = useState({} as (chatRoomMessageObject | newDirectMessageObject));
    const updateData = (newData: boolean) => {
        if (newData === true) {
            setUpdate(update => !update);
        }
    };
    const updateMsg = (newMsg: (chatRoomMessageObject | newDirectMessageObject)) => {
        setNewMsg(newMsg);
    };

    return (
        <DataContext.Provider value={[update, newMsg, updateData, updateMsg]}>
            {children}
        </DataContext.Provider>
    );
}