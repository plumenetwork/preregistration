type Props = {
  error: string;
};

export const GenericErrorMessageToast = ({ error }: Props) => {
  return (
    <div className="bg-[#212121] rounded-[12px] p-3 flex gap-2 w-full">
      <div className="flex flex-col">
        <div className="text-[#FFFFFF] font-[500]">
          Something wrong has happened
        </div>
        <div className="text-[#BFBFBF]">{error}</div>
      </div>
    </div>
  );
};
