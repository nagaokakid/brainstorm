/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useContext, useState } from 'react';
import { chatRoomMessageObject } from '../models/TypesDefine';

/* 
    *  DataContext.tsx 
    * -------------------------
    *  This component is the data context of the chat page.
    *  It contains the data that is shared between components.
    *  -----------------------------------------------------------------------
    * Authors:  Mr. Yee Tsung (Jackson) Kao & Mr. Roland Fehr
    * Date Created:  01/12/2023
    * Last Modified: 01/12/2023
    * Version: 1.0
*/

type DataContextProviderProps = {
    children: ReactNode;
};

type DataContextType = [
    boolean,
    (chatRoomMessageObject | { fromUserId: string, messageId: string, message: string, timestamp: string }),
    (newData: boolean) => void,
    (newMsg: (chatRoomMessageObject | { fromUserId: string, messageId: string, message: string, timestamp: string })) => void,
    boolean,
    (newData: boolean) => void,
    number,
    (newData: number) => void,
    boolean,
    (newData: boolean) => void,
    boolean,
    (newData: boolean) => void,
    boolean,
    (newData: boolean) => void
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
    const [newMsg, setNewMsg] = useState({} as (chatRoomMessageObject | { fromUserId: string, messageId: string, message: string, timestamp: string }));
    const [updateAgain, setUpdateAgain] = useState(true);
    const [updateHeader, setUpdateHeader] = useState(true);
    const [updateWindow, setUpdateWindow] = useState(true);
    const [updateName, setUpdateName] = useState(true);
    const [count, setCount] = useState(0);
    const updateData = (newData: boolean) => {
        if (newData === true) {
            setUpdate(update => !update);
        }
    };

    const updateMsg = (newMsg: (chatRoomMessageObject | { fromUserId: string, messageId: string, message: string, timestamp: string })) => {
        setNewMsg(newMsg);
    };

    const render = (newData: boolean) => {
        if (newData === true) {
            setUpdateAgain(update => !update);
        }
    }

    const updateCount = (newData: number) => {
        setCount(newData);
    }

    const updateHeaderFunction = (newData: boolean) => {
        if (newData === true) {
            setUpdateHeader(update => !update);
        }
    }

    const updateWindowFunction = (newData: boolean) => {
        if (newData === true) {
            setUpdateWindow(update => !update);
        }
    }

    const updateNameFunction = (newData: boolean) => {
        if (newData === true) {
            setUpdateName(update => !update);
        }
    }

    return (
        <DataContext.Provider value={[update, newMsg, updateData, updateMsg, updateAgain, render, count, updateCount, updateHeader, updateHeaderFunction, updateWindow, updateWindowFunction, updateName, updateNameFunction]}>
            {children}
        </DataContext.Provider>
    );
}