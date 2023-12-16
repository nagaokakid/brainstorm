/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useContext, useState } from 'react';
import { chatRoomMessageObject } from '../models/TypesDefine';

type DataContextProviderProps = {
    children: ReactNode;
};

type DataContextType = {
    updateMember: boolean,
    updateMemberFunction: (newData: boolean) => void,
    updateMsg: (chatRoomMessageObject | { fromUserId: string, messageId: string, message: string, timestamp: string }),
    updateMsgFunction: (newMsg: (chatRoomMessageObject | { fromUserId: string, messageId: string, message: string, timestamp: string })) => void,
    updateDeleteMsg: boolean,
    updateDeleteMsgFunction: (newData: boolean) => void,
    updateCount: number,
    updateCountFunction: (newData: number) => void,
    updateHeader: boolean,
    updateHeaderFunction: (newData: boolean) => void,
    updateWindow: boolean,
    updateWindowFunction: (newData: boolean) => void,
    updateName: boolean,
    updateNameFunction: (newData: boolean) => void,
    updateList: boolean,
    updateListFunction: (newData: boolean) => void,
}

// Create the context with an initial value
export const DataContext = createContext({} as DataContextType);

/**
 *  DataContext.tsx 
 * -------------------------
 *  This component is the data context of the chat page.
 *  It contains the data that is shared between components.
 *  -----------------------------------------------------------------------
 * Authors:  Mr. Yee Tsung (Jackson) Kao
 */
export function useDataContext() {
    const context = useContext(DataContext);

    if (context === undefined) {
        throw new Error('useDataContext must be used within a DataContext');
    }

    return context;
}

export function DataContextProvider({ children }: DataContextProviderProps) {
    const [updateMember, setUpdateMember] = useState(true);
    const [updateMsg, setUpdateMsg] = useState({} as (chatRoomMessageObject | { fromUserId: string, messageId: string, message: string, timestamp: string }));
    const [updateDeleteMsg, setUpdateDeleteMsg] = useState(true);
    const [updateCount, setUpdateCount] = useState(0);
    const [updateHeader, setUpdateHeader] = useState(true);
    const [updateWindow, setUpdateWindow] = useState(true);
    const [updateName, setUpdateName] = useState(true);
    const [updateList, setUpdateList] = useState(true);

    const updateMemberFunction = (newData: boolean) => {
        if (newData === true) {
            setUpdateMember(update => !update);
        }
    };

    const updateMsgFunction = (newMsg: (chatRoomMessageObject | { fromUserId: string, messageId: string, message: string, timestamp: string })) => {
        setUpdateMsg(newMsg);
    };

    const updateDeleteMsgFunction = (newData: boolean) => {
        if (newData === true) {
            setUpdateDeleteMsg(update => !update);
        }
    }

    const updateCountFunction = (newData: number) => {
        setUpdateCount(newData);
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

    const updateListFunction = (newData: boolean) => {
        if (newData === true) {
            setUpdateList(update => !update);
        }
    }

    return (
        <DataContext.Provider value={{updateMember, updateMemberFunction, updateMsg, updateMsgFunction, updateDeleteMsg, updateDeleteMsgFunction, updateCount, updateCountFunction, updateHeader, updateHeaderFunction, updateWindow, updateWindowFunction, updateName, updateNameFunction, updateList, updateListFunction}}>
            {children}
        </DataContext.Provider>
    );
}