"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useDisconnect } from "wagmi";
import { topNavPaneList, usePreregStore } from "../store";
import { useShallow } from "zustand/react/shallow";
import clsx from "clsx";

export const TopNav = () => {
  const { disconnect } = useDisconnect();
  const [currentPane, setCurrentPane] = usePreregStore(
    useShallow((state) => [state.currentPane, state.setCurrentPane])
  );

  const shouldShowNav = topNavPaneList.includes(currentPane);

  console.log("shouldShowNav", shouldShowNav);

  return (
    <div className="rounded-full border-[#F0F0F0] border px-8 py-5 flex items-center justify-between relative">
      {/* eslint-disable-next-line */}
      <a className="flex items-center gap-1" href="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
        >
          <path
            d="M21.1487 11.6327V20.2469L17.7671 16.8372V8.22303L21.1487 11.6327Z"
            fill="#272727"
          />
          <path
            d="M11.721 21.1435H20.2599L16.8801 17.732H8.34119L11.721 21.1435Z"
            fill="#272727"
          />
          <path
            d="M25.9549 26.0221V16.4813L22.5733 13.0716V22.6125L13.1474 22.5806L16.5273 25.9921L25.9531 26.0239"
            fill="#272727"
          />
          <path
            d="M4 4.00175L4 13.5426L7.38159 16.9523L7.38159 7.41143L16.8075 7.44328L13.4276 4.03185L4.0018 4"
            fill="#272727"
          />
          <path
            d="M26.8489 27.8341L24.9304 25.8987L25.8622 24.9586L27.7807 26.894L28 28L26.8489 27.8341Z"
            fill="#272727"
          />
        </svg>
        <div className="font-black text-xl">plume</div>
      </a>
      {shouldShowNav && (
        <div className="gap-2 items-center hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button
            className="px-3 py-1.5 border border-[#F0F0F0] rounded-full disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-[#F0F0F0]"
            disabled={topNavPaneList.indexOf(currentPane) === 0}
            onClick={() => {
              const currentPaneInListIdx = topNavPaneList.indexOf(currentPane);
              setCurrentPane(topNavPaneList[currentPaneInListIdx - 1]);
            }}
          >
            <ChevronLeftIcon size={20} />
          </button>
          <ul className="flex items-center gap-2">
            {topNavPaneList.map((pane, idx) => {
              const currentPaneInListIdx = topNavPaneList.indexOf(currentPane);

              return (
                <button
                  key={pane}
                  className={clsx(
                    "w-16 rounded-full h-[6px]",
                    currentPaneInListIdx >= idx
                      ? "bg-[#111111]"
                      : "bg-[#F0F0F0]"
                  )}
                  onClick={() => {
                    setCurrentPane(pane);
                  }}
                />
              );
            })}
          </ul>
          <button
            className="px-3 py-1.5 border border-[#F0F0F0] rounded-full  disabled:opacity-40 disabled:cursor-not-allowed  bg-white hover:bg-[#F0F0F0]"
            disabled={
              topNavPaneList.indexOf(currentPane) === topNavPaneList.length - 1
            }
            onClick={() => {
              const currentPaneInListIdx = topNavPaneList.indexOf(currentPane);
              setCurrentPane(topNavPaneList[currentPaneInListIdx + 1]);
            }}
          >
            <ChevronRightIcon size={20} />
          </button>
        </div>
      )}
      <ConnectButton.Custom>
        {({ account, openConnectModal, authenticationStatus, mounted }) => {
          if (!account || !mounted) {
            return (
              <button
                className="bg-[#111111] px-4 py-2 rounded-full text-[#F0F0F0] hover:opactiy-80"
                disabled={!mounted || authenticationStatus === "loading"}
                onClick={() => {
                  openConnectModal();
                }}
              >
                Connect wallet
              </button>
            );
          } else {
            return (
              <button
                className="border border-[#F0F0F0] flex items-center gap-2 rounded-full px-3 py-2 hover:bg-[#F0F0F0] h-10"
                onClick={() => {
                  disconnect();
                }}
              >
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
                <XIcon size={16} />
              </button>
            );
          }
        }}
      </ConnectButton.Custom>
    </div>
  );
};
