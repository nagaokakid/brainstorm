/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, ReactNode } from 'react';

type DataContextProviderProps = {
    children: ReactNode;
};

type DataContextType = {
    chatMessage: boolean;
    directMessage: boolean;
    chatRoom: boolean;
    chatRoomInfo: boolean;
    chatType: string;
    updateData: (newData: number) => void;
    updateType: (newData: string) => void;
};

// Create the context with an initial value
export const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
    console.log("----> useDataContext");
    const context = useContext(DataContext);

    if (!context) {
        throw new Error('useMyContext must be used within a MyContextProvider');
    }

    return context;
};

export function DataContextProvider({ children }: DataContextProviderProps) {

    const [chatMessage, setChatMessage] = useState(true);
    const [directMessage, setDirectMessage] = useState(true);
    const [chatRoom, setChatRoom] = useState(true);
    const [chatRoomInfo, setChatRoomInfo] = useState(true);
    const [chatType, setChatType] = useState("ChatRoom List");
    const updateData = (newData: number) => {
        if (newData === 1) {
            setChatMessage(chatMessage => !chatMessage);
        }
        else if (newData === 2) {
            setDirectMessage(!directMessage);
        }
        else if (newData === 3) {
            setChatRoom(!chatRoom);
        }
        else if (newData === 4) {
            setChatRoomInfo(!chatRoomInfo);
        }
    };
    const updateType = (newData: string) => {
        if (newData === "Direct Message List") {
            setChatType(newData);
        }
        else if (newData === "ChatRoom List") {
            setChatType(newData);
        }
    };

    return (
        <DataContext.Provider value={{ chatMessage, directMessage, chatRoom, chatRoomInfo, chatType, updateData, updateType }}>
            {children}
        </DataContext.Provider>
    );
}