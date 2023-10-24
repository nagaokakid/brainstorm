/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, ReactNode } from 'react';

type DataContextProviderProps = {
    children: ReactNode;
};

type DataContextType = [boolean, (newData: number) => void];

// Create the context with an initial value
export const DataContext = createContext<DataContextType | undefined>(undefined);

export function useDataContext() {
    console.log("----> Getting DataContext");
    const context = useContext(DataContext);

    if (context === undefined) {
        throw new Error('useDataContext must be used within a DataContext');
    }

    return context;
}

export function DataContextProvider({ children }: DataContextProviderProps) {

    const [chatMessage, setChatMessage] = useState(true);
    const updateData = (newData: number) => {
        if (newData === 1) {
            setChatMessage(chatMessage => !chatMessage);
        }
    };

    return (
        <DataContext.Provider value={[chatMessage, updateData]}>
            {children}
        </DataContext.Provider>
    );
}