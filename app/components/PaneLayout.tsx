"use client";

import clsx from "clsx";
import Image from "next/image";

import { ReactNode } from "react";

type Props = {
  content: ReactNode;
  invertedImage?: boolean;
};

export const PaneLayout = ({ content, invertedImage }: Props) => {
  return (
    <div className="px-6 lg:px-8 max-w-[720px] w-full mx-auto flex flex-col gap-6 lg:mt-[100px]">
      <Image
        alt=""
        src="/images/plume-cex-home-logo.avif"
        width={120}
        height={120}
        className={clsx("mx-auto", invertedImage && "grayscale")}
      />
      {content}
    </div>
  );
};
