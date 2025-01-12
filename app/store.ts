import { create } from "zustand";

const RegistrationPane = {
  DEFAULT: "DEFAULT",
  ABOUT: "ABOUT",
  MEET: "MEET",
  REGISTER: "REGISTER",
  FINISHED: "FINISHED",
} as const;

type RegistrationPaneType =
  (typeof RegistrationPane)[keyof typeof RegistrationPane];

export const topNavPaneList: RegistrationPaneType[] = [
  RegistrationPane.ABOUT,
  RegistrationPane.MEET,
  RegistrationPane.REGISTER,
];

type PreregStore = {
  currentPane: RegistrationPaneType;
  setCurrentPane: (pane: RegistrationPaneType) => void;
};

export const usePreregStore = create<PreregStore>((set) => ({
  currentPane: RegistrationPane.DEFAULT,
  setCurrentPane: (pane) => set({ currentPane: pane }),
}));
