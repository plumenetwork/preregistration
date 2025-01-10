"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { XIcon } from "lucide-react";
import { useDisconnect } from "wagmi";

export const TopNav = () => {
  const { disconnect } = useDisconnect();

  return (
    <div className="rounded-full border-[#F0F0F0] border px-8 py-5 flex items-center justify-between">
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
        <div className="font-black text-xl">Plume</div>
      </a>
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
