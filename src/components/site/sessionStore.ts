import { create } from "zustand";

interface SessionState {
  isUserSignIn: boolean;
  setisUserSignIn: (isUserSignIn: boolean) => void;
}

export const sessionStore = create<SessionState>()((set, get) => ({
  isUserSignIn: false,
  setisUserSignIn: (isUserSignIn: boolean) => set({ isUserSignIn }),
}));
