import { create } from "zustand";

const RegistrationPane = {
  DEFAULT: "DEFAULT",
  CEX_SELECTION: "CEX_SELECTION",
  FORM: "FORM",
  FINISHED: "FINISHED",
} as const;

type RegistrationPaneType =
  (typeof RegistrationPane)[keyof typeof RegistrationPane];

export const topNavPaneList: RegistrationPaneType[] = [
  RegistrationPane.CEX_SELECTION,
  RegistrationPane.FORM,
];

type PreregStore = {
  currentPane: RegistrationPaneType;
  setCurrentPane: (pane: RegistrationPaneType) => void;
};

export const usePreregStore = create<PreregStore>((set) => ({
  currentPane: RegistrationPane.DEFAULT,
  setCurrentPane: (pane) => set({ currentPane: pane }),
}));
