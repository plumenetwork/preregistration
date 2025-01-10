import "@rainbow-me/rainbowkit/styles.css";
import { plume } from "wagmi/chains";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "Plume",
  projectId: "04cc015520f075c8d0d0b4ed6e27a764",
  chains: [plume],
});
