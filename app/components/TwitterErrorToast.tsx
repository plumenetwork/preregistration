export const TwitterErrorToast = () => {
  return (
    <div className="bg-[#212121] rounded-[12px] p-3 flex gap-2 w-full">
      <div className="flex flex-col">
        <div className="text-[#FFFFFF] font-[500]">Twitter connect error</div>
        <div className="text-[#BFBFBF]">Please try again later</div>
      </div>
    </div>
  );
};
