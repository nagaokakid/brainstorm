/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, ReactNode } from 'react';

type DataContextProviderProps = {
    children: ReactNode;
};

type DataContextType = [boolean, (newData: boolean) => void];

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

    const [update, setUpdate] = useState(true);
    const updateData = (newData: boolean) => {
        if (newData === true) {
            setUpdate(update => !update);
        }
    };

    return (
        <DataContext.Provider value={[update, updateData]}>
            {children}
        </DataContext.Provider>
    );
}