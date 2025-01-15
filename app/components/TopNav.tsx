"use client";
import Image from "next/image";
import { topNavPaneList, usePreregStore } from "../store";
import { useShallow } from "zustand/react/shallow";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export const TopNav = () => {
  const [currentPane, setCurrentPane] = usePreregStore(
    useShallow((state) => [state.currentPane, state.setCurrentPane])
  );
  const currentIndex = topNavPaneList.indexOf(currentPane);
  const shouldShowNav = currentIndex !== -1;

  return (
    <div className="max-w-[1200px] w-full flex py-4 lg:py-8 px-4 lg:px-8">
      <div className="flex items-center gap-8 justify-between md:justify-start w-full">
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
    </div>
  );
};
