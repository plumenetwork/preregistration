"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";
import { topNavPaneList, usePreregStore } from "../store";
import { useShallow } from "zustand/react/shallow";
import clsx from "clsx";
import Link from "next/link";

type Props = {
  content: ReactNode;
  image: string;
  invertImage?: boolean;
  imageClasses?: string;
};

export const PaneLayout = ({
  imageClasses,
  content,
  image,
  invertImage,
}: Props) => {
  const [currentPane, setCurrentPane] = usePreregStore(
    useShallow((state) => [state.currentPane, state.setCurrentPane])
  );
  const currentIndex = topNavPaneList.indexOf(currentPane);
  const shouldShowNav = currentIndex !== -1;

  const nav = (
    <div className="flex justify-between lg:mb-[100px] items-center w-full">
      {/* eslint-disable-next-line */}
      <a href="/" className="flex items-center gap-2">
        <Image
          src="/images/plume-logo-new.png"
          alt=""
          width={32}
          height={32}
          className="lg:block"
        />
      </a>
      {shouldShowNav && (
        <div className="flex items-center gap-4 text-white">
          <button
            className="disabled:opacity-40"
            disabled={currentIndex === 0}
            onClick={() => {
              const prevPane = topNavPaneList[currentIndex - 1];

              if (prevPane) {
                setCurrentPane(prevPane);
              }
            }}
          >
            <ChevronLeftIcon size={20} />
          </button>
          <button
            className="disabled:opacity-40"
            disabled={currentIndex === topNavPaneList.length - 1}
            onClick={() => {
              const nextPane = topNavPaneList[currentIndex + 1];

              if (nextPane) {
                setCurrentPane(nextPane);
              }
            }}
          >
            <ChevronRightIcon size={20} />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {shouldShowNav && (
        <div
          className="fixed top-0 z-10 flex h-[6px] bg-[#D7FF30] transition-all"
          style={{
            width: `${((currentIndex + 1) / topNavPaneList.length) * 80}%`,
          }}
        />
      )}
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="lg:hidden p-4">{nav}</div>
        <div className="lg:hidden aspect-[394/226] relative mb-6">
          <Image className="object-cover" alt="" src={image} fill />
        </div>
        <div className="h-full lg:basis-[55%] xl:basis-[45%] shrink-0 grow flex-col lg:justify-center lg:pt-16 px-6 lg:pl-20 lg:pr-18 overflow-auto">
          <div className="hidden lg:flex w-full">{nav}</div>
          <div className="max-w-[530px] w-full">{content}</div>
        </div>
        <div className="lg:basis-[45%] xl:basis-[55%] shrink-0 grow relative hidden lg:flex overflow-hidden">
          <Image
            alt=""
            src={image}
            fill
            priority
            className={clsx(
              "object-cover",
              invertImage && "grayscale",
              imageClasses
            )}
          />
        </div>
      </div>
      <div className="py-6 lg:text-center px-6 text-[#918C89] max-w-[900px] mx-auto mt-10">
        <span className="text-white">Disclaimer</span>: Terms of Service apply.
        Plume&apos;s Airdrop is available globally, excluding the United States
        and OFAC-sanctioned countries, in accordance with regulatory and
        compliance requirements.
      </div>
      <footer className="py-20">
        <div className="max-w-[1200px] flex mx-auto px-6 lg:px-10 flex-col lg:flex-row">
          <div className="flex flex-col gap-1 lg:mr-auto">
            {/* eslint-disable-next-line */}
            <a href="/" className="flex items-center gap-2">
              <Image
                alt=""
                src="/images/plume-red-logo.png"
                width={64}
                height={64}
              />
              <span className="font-[800] text-[40px] font-lufga">Plume</span>
            </a>
            <div className="font-reckless text-[20px] lg:text-[24px]">
              Bringing the <span className="font-[500] italic">real world</span>{" "}
              onchain
            </div>
          </div>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 mt-10 lg:ml-10 lg:mt-0">
            <div className="flex flex-col gap-4">
              <div className="text-[#918C89]">About Plume</div>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href="https://plumenetwork.xyz/blog/airdrop"
                    target="_blank"
                  >
                    Plume Airdrop FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-[#918C89]">Legal</div>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/terms" target="_blank">
                    Airdrop Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-[#918C89]">Community</div>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="https://x.com/plumenetwork" target="_blank">
                    Plume
                  </Link>
                </li>
                <li>
                  <Link href="https://x.com/plumefndn" target="_blank">
                    Plume Foundation
                  </Link>
                </li>

                <li>
                  <Link href="https://discord.gg/plume-network" target="_blank">
                    Discord
                  </Link>
                </li>

                <li>
                  <Link href="https://t.me/plumenetwork" target="_blank">
                    Telegram
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
