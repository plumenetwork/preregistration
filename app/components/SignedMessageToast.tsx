import { CheckCircleIcon } from "lucide-react";

export const SignedMessageToast = () => {
  return (
    <div className="bg-[#212121] rounded-[12px] p-3 flex gap-2 w-full">
      <CheckCircleIcon size={20} color="#FFFFFF" />
      <div className="flex flex-col">
        <div className="text-[#FFFFFF] font-[500]">Signed</div>
        <div className="text-[#BFBFBF]">You’ve signed our Terms of Service</div>
      </div>
    </div>
  );
};
