import { create } from "zustand";

const RegistrationPane = {
  DEFAULT: "DEFAULT",
  ABOUT: "ABOUT",
  MEET: "MEET",
  REGISTER: "REGISTER",
  REGISTER_2: "REGISTER_2",
  FINISHED: "FINISHED",
} as const;

type RegistrationPaneType =
  (typeof RegistrationPane)[keyof typeof RegistrationPane];

export const topNavPaneList: RegistrationPaneType[] = [
  RegistrationPane.ABOUT,
  RegistrationPane.MEET,
  RegistrationPane.REGISTER,
  RegistrationPane.REGISTER_2,
];

type PreregStore = {
  currentPane: RegistrationPaneType;
  setCurrentPane: (pane: RegistrationPaneType) => void;
};

export const usePreregStore = create<PreregStore>((set) => ({
  currentPane: RegistrationPane.DEFAULT,
  setCurrentPane: (pane) => set({ currentPane: pane }),
}));
