import {create} from 'zustand'

export interface UseStorrre {
    update: boolean;
    SetUpdate: () => void;
}

export const useMyStore = create<UseStorrre>((set) => ({
  update: true, 
  SetUpdate: () => set(state => ({ update: !state.update })),
}))