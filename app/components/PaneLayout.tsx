import { ConnectButton } from "@rainbow-me/rainbowkit";
import { XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { useDisconnect } from "wagmi";
import { topNavPaneList, usePreregStore } from "../store";
import { useShallow } from "zustand/react/shallow";

type Props = {
  content: ReactNode;
  image: string;
};

export const PaneLayout = ({ content, image }: Props) => {
  const { disconnect } = useDisconnect();
  const currentPane = usePreregStore(useShallow((state) => state.currentPane));
  const currentIndex = topNavPaneList.indexOf(currentPane);
  const shouldShowNav = currentIndex !== -1;

  return (
    <>
      {shouldShowNav && (
        <div
          className="fixed top-0 z-10 flex h-[6px] bg-[#FE3D01] transition-all"
          style={{
            width: `${((currentIndex + 1) / topNavPaneList.length) * 80}%`,
          }}
        />
      )}
      <div className="flex flex-col lg:flex-row h-full">
        <div className="max-w-[1200px] mx-auto relative z-1 w-full lg:min-h-[calc(100vh-40px)] pb-[200px] lg:pb-0 lg:-mt-5">
          <div className="flex items-center justify-between px-3 md:px-6 relative pt-3 lg:pt-0 lg:top-[60px] z-[100]">
            {/* eslint-disable-next-line */}
            <a href="/" className="flex items-center gap-2">
              <Image
                src="/images/plume-logo-mobile.png"
                alt=""
                width={32}
                height={32}
                className="lg:hidden"
              />
              <Image
                src="/images/plume-logo.png"
                alt=""
                width={32}
                height={32}
                className="hidden lg:block"
              />
              <div className="font-black text-xl hidden lg:flex">plume</div>
            </a>

            <div className="flex items-center gap-2">
              <Link
                href="https://plumenetwork.xyz/blog/plume-drop-faq"
                className="font-[500] text-sm border border-[#F0F0F0] rounded-full py-2 px-4 bg-white hover:bg-[#F0F0F0]"
                target="_blank"
              >
                Learn more
              </Link>
              <ConnectButton.Custom>
                {({
                  account,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  if (!account || !mounted) {
                    return (
                      <button
                        className="bg-[#111111] px-4 py-2 rounded-full text-[#F0F0F0] hover:opactiy-80 lg:min-w-[160px] text-center"
                        disabled={
                          !mounted || authenticationStatus === "loading"
                        }
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
                        className="border border-[#F0F0F0] flex items-center gap-2 rounded-full px-3 py-2 hover:bg-[#F0F0F0] h-10 lg:min-w-[160px] bg-white"
                        onClick={() => {
                          disconnect();
                        }}
                      >
                        <span className="lg:hidden">
                          {account.address.slice(0, 3)}...
                          {account.address.slice(-2)}
                        </span>

                        <span className="hidden lg:block">
                          {account.address.slice(0, 6)}...
                          {account.address.slice(-4)}
                        </span>

                        <XIcon size={16} />
                      </button>
                    );
                  }
                }}
              </ConnectButton.Custom>
            </div>
          </div>
          <div className="lg:hidden aspect-[394/226] relative mt-3 mb-6">
            <Image className="object-cover" alt="" src={image} fill />
          </div>

          <div className="flex h-full">
            <div className="basis-[100%] lg:basis-[50%] flex flex-col lg:justify-center px-3 md:px-6">
              {content}
            </div>
            <div className="basis-[50%] hidden lg:flex relative">
              <Image
                alt=""
                src={image}
                fill
                priority
                className="object-cover rounded-[24px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
