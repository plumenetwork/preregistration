import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Plume Restricted Page",
  description: "Plume Restricted Page",
};

const RestrictedPage = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col gap-4 justify-center text-center max-w-[560px] w-full mt-[100px] border border-[#F0F0F0] bg-[#FFFFFF] rounded-[16px] p-10">
        <Image
          src="/images/plume-unavailable.avif"
          className="mx-auto"
          alt=""
          width={48}
          height={48}
        />
        <div className="font-semibold text-[20px]">PlumeDrop Unavailable</div>
        <div className="text-[#515154]">
          This program is unavailable to users in your region due to regulatory
          measures.
        </div>
        <div>
          <Link
            href="/"
            className="font-[500] text-sm border border-[#F0F0F0] rounded-full py-2 px-4"
            target="_blank"
          >
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestrictedPage;
