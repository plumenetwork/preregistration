"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";
import { topNavPaneList, usePreregStore } from "../store";
import { useShallow } from "zustand/react/shallow";
import clsx from "clsx";

type Props = {
  content: ReactNode;
  image: string;
  invertImage?: boolean;
};

export const PaneLayout = ({ content, image, invertImage }: Props) => {
  const [currentPane, setCurrentPane] = usePreregStore(
    useShallow((state) => [state.currentPane, state.setCurrentPane])
  );
  const currentIndex = topNavPaneList.indexOf(currentPane);
  const shouldShowNav = currentIndex !== -1;

  const nav = (
    <div className="flex justify-between lg:mb-[100px] items-center">
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
      <div className="flex flex-col lg:flex-row h-screen">
        <div className="lg:hidden aspect-[394/226] relative mb-6">
          <Image className="object-cover" alt="" src={image} fill />
        </div>
        <div className="h-full lg:basis-[50%] xl:basis-[45%] shrink-0 grow flex-col lg:justify-center lg:pt-16 px-3 lg:px-20 overflow-auto">
          {nav}
          <div className="max-w-[520px] w-full">{content}</div>
        </div>
        <div className="lg:basis-[50%] xl:basis-[55%] shrink-0 grow relative hidden lg:flex">
          <Image
            alt=""
            src={image}
            fill
            priority
            className={clsx("object-cover", invertImage && "grayscale")}
          />
        </div>
      </div>
    </>
  );
};
