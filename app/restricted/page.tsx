import { Metadata } from "next";
import Link from "next/link";
import { PaneLayout } from "../components/PaneLayout";

export const metadata: Metadata = {
  title: "Plume Restricted Page",
  description: "Plume Restricted Page",
};

const RestrictedPage = () => {
  return (
    <PaneLayout
      invertedImage
      content={
        <div className="flex flex-col">
          <div className="text-[36px] md:text-[48px] lg:text-[56px] leading-[1.2] font-reckless text-center mb-3">
            Plume Airdrop{" "}
            <span className="text-[#918C89] italic">Unavailable</span>
          </div>
          <div className="text-[18px] md:text-[20px] lg:text-[24px] text-[#918C89] text-center">
            This program is unavailable to users in your region due to
            regulatory measures.
          </div>
          <div className="justify-center flex mt-8">
            <Link
              href="https://plumenetwork.xyz/blog/airdrop"
              target="_blank"
              className="font-[600] text-lg hover:opacity-80 bg-white/20 text-white rounded-full py-4 px-8 flex justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Learn More
            </Link>
          </div>
        </div>
      }
    />
  );
};

export default RestrictedPage;
