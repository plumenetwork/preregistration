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
      content={
        <div className="flex flex-col pb-[100px] mt-8 ">
          <div className="font-[500] text-[42px] md:text-[48px] lg:text-[56px] mb-4 font-reckless italic">
            Plume Airdrop is <span className="text-[#918C89]">Unavailable</span>
          </div>
          <div className="mb-8 font-[500] text-[18px] md:text-[20px] lg:text-[24px] text-[#918C89]">
            This program is unavailable to users in your region due to
            regulatory measures.
          </div>
          <div className="flex">
            <Link
              href="https://plumenetwork.xyz/blog/airdrop"
              className="w-auto bg-white/20 py-4 px-6 rounded-full text-white hover:opacity-80 text-[20px] font-[600]"
              target="_blank"
            >
              Learn more
            </Link>
          </div>
        </div>
      }
      image="/images/plume-bg-1.avif"
      invertImage
    />
  );
};

export default RestrictedPage;
