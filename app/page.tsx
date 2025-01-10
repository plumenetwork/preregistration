"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

const RegistrationPane = {
  DEFAULT: "DEFAULT",
  ABOUT: "ABOUT",
  MEET: "MEET",
  REGISTER: "REGISTER",
  FINISHED: "FINISHED",
} as const;

type RegistrationPaneType =
  (typeof RegistrationPane)[keyof typeof RegistrationPane];

export default function Home() {
  const [currentPane, setCurrentPane] = useState<RegistrationPaneType>(
    RegistrationPane.DEFAULT
  );

  if (currentPane === "DEFAULT") {
    return (
      <div className="p-12 rounded-[24px] border border-[#F0F0F0] flex flex-col gap-6 max-w-[640px] w-full mx-auto mt-16">
        <div className="w-full aspect-[544/320] relative">
          <Image src="/images/plume-default-banner.avif" alt="" layout="fill" />
        </div>
        <div>
          <div className="text-lg text-[#FF3D00] mb-2 font-[500] text-center">
            Plume’s First Official Token Airdrop
          </div>
          <div className="text-[40px] mb-4 font-bold text-center">
            Register for PlumeDrop I
          </div>
          <div className="text-[#747474] text-lg">
            Ahead of the Plume live release, PlumeDrop I rewards early
            contributors who’ve been a part of the journey this far. Learn more
          </div>
        </div>
        <ul className="flex flex-col">
          {[
            {
              image: "/images/plume-default-icon-1.avif",
              title: "Testnet Users",
              description:
                "Participants who’ve contributed considerable testing and engagement across our Testnet campaign.",
            },
            {
              image: "/images/plume-default-icon-2.avif",
              title: "Pre-Deposit Users",
              description:
                "Participants who’ve contributed funds into the Plume Vault and into the Nest Pre-Deposit.",
            },
            {
              image: "/images/plume-default-icon-3.avif",
              title: "Engaged Protocols & Communities",
              description:
                "Individuals and protocols who’ve helped lay out the foundation for the Plume ecosystem up to today.",
            },
          ].map(({ image, title, description }, idx) => {
            return (
              <li
                key={idx}
                className={clsx(
                  "border p-6 flex items-center gap-4",
                  idx === 0 && "rounded-tr-[24px] rounded-tl-[24px]",
                  idx === 1 && "border-t-0 border-b-0",
                  idx === 2 && "rounded-br-[24px] rounded-bl-[24px]"
                )}
              >
                <Image src={image} alt="" width={40} height={40} />
                <div className="flex flex-col gap-1">
                  <div className="font-[500] text-lg">{title}</div>
                  <div className="text-[#747474] font-[500]">{description}</div>
                </div>
              </li>
            );
          })}
        </ul>
        <div>
          <button
            className="w-full font-[500] text-lg hover:opacity-80 bg-[#111111] text-[#F0F0F0] rounded-full py-4 px-8"
            onClick={() => {
              setCurrentPane(RegistrationPane.ABOUT);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return <div />;
}
