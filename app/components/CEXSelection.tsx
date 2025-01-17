import clsx from "clsx";
import Image from "next/image";

export const CEX = {
  BITGET: "BITGET",
  BYBIT: "BYBIT",
  KUCOIN: "KUCOIN",
  // BINANCE: "BINANCE",
  // UPBIT: "UPBIT",
  // BITHUMB: "BITHUMB",
} as const;

export type CEXType = (typeof CEX)[keyof typeof CEX];

type Props = {
  cex: CEXType | null;
  onClick: (_: CEXType) => void;
};

export const getLabelByCex = (cex: CEXType) => {
  switch (cex) {
    case CEX.BITGET:
      return "Bitget";
    case CEX.BYBIT:
      return "Bybit";
    case CEX.KUCOIN:
      return "KuCoin";
    // case CEX.BINANCE:
    //   return "Binance";
    // case CEX.UPBIT:
    //   return "Upbit";
    // case CEX.BITHUMB:
    //   return "Bithumb";
  }
};

export const getPlaceholderByCex = (cex: CEXType) => {
  switch (cex) {
    case CEX.BITGET:
      return "Bitget UID";
    case CEX.BYBIT:
      return "Bybit UID";
    case CEX.KUCOIN:
      return "KuCoin UID";
    default:
      return "";
  }
};

export const getCexLinkDesktop = (cex: CEXType) => {
  switch (cex) {
    case CEX.BITGET:
      return "https://bitget.onelink.me/XqvW?af_xp=custom&pid=Plume";
    case CEX.BYBIT:
      return "https://www.bybit.com/";
    case CEX.KUCOIN:
      return "https://www.kucoin.com/ucenter/signup?utm_source=j_airdrop";
    default:
      return "";
  }
};

export const getCexLinkMobile = (cex: CEXType) => {
  switch (cex) {
    case CEX.BITGET:
      return "https://bitget.onelink.me/XqvW?af_xp=custom&pid=Plume";
    case CEX.BYBIT:
      return "https://www.bybit.com/en/download/";
    case CEX.KUCOIN:
      return "https://www.kucoin.com/ucenter/signup?utm_source=j_airdrop";
    default:
      return "";
  }
};

const getImageByCex = (cex: CEXType) => {
  switch (cex) {
    case CEX.BITGET:
      return "/images/bitget.png";
    case CEX.BYBIT:
      return "/images/bybit.png";
    case CEX.KUCOIN:
      return "/images/kucoin.png";
    // case CEX.BINANCE:
    //   return "/images/binance.png";
    // case CEX.UPBIT:
    //   return "/images/upbit.png";
    // case CEX.BITHUMB:
    //   return "/images/bithumb.png";
    default:
      return "";
  }
};

const getImageDimensionsByCex = (cex: CEXType) => {
  switch (cex) {
    case CEX.BITGET:
      return { width: 120, height: 36 };
    case CEX.BYBIT:
      return { width: 102, height: 40 };
    case CEX.KUCOIN:
      return { width: 137, height: 32 };
    // case CEX.BINANCE:
    //   return { width: 142, height: 28 };
    // case CEX.UPBIT:
    //   return { width: 106, height: 24 };
    // case CEX.BITHUMB:
    //   return { width: 42, height: 56 };
    default:
      return { width: 0, height: 0 };
  }
};

export const getSubtitleByCEX = (cex: CEXType) => {
  switch (cex) {
    case CEX.BITGET:
      return "Unlock 5-100 $PLUME for depositing on Bitget (first come first serve)";
    case CEX.BYBIT:
      return "No gas fees for depositing $PLUME on bybit";
    case CEX.KUCOIN:
      return "Share a 1.25M $PLUME rewards pool for depositing on KuCoin";
    // case CEX.BINANCE:
    //   return "Trade to earn rewards";
    // case CEX.UPBIT:
    //   return "Trade to earn rewards";
    // case CEX.BITHUMB:
    //   return "Trade to earn rewards";
    default: {
      return "";
    }
  }
};

export const getDepositLabelByCEX = (cex: CEXType) => {
  switch (cex) {
    case CEX.KUCOIN: {
      return "$ETH Deposit Address";
    }
    case CEX.BYBIT:
    case CEX.BITGET: {
      return "$PLUME Deposit Address";
    }
    default: {
      return "";
    }
  }
};

export const CEXSelection = ({ cex, onClick }: Props) => {
  return (
    <ul className="flex flex-wrap gap-8">
      {Object.values(CEX).map((c) => (
        <li key={c} className="basis-full">
          <button
            className={clsx(
              "rounded-[12px] p-4 border-[2px] flex flex-col w-full py-8 px-6 hover:opacity-80 relative transition-all",
              cex === c ? "border-[#39BEB7]" : "border-[#403E3C]"
            )}
            onClick={() => {
              onClick(c);
            }}
          >
            <Image
              className={clsx(
                "transition-all",
                cex && cex !== c && "grayscale"
              )}
              alt={getLabelByCex(c)}
              src={getImageByCex(c)}
              width={getImageDimensionsByCex(c).width}
              height={getImageDimensionsByCex(c).height}
              style={{
                width: getImageDimensionsByCex(c).width,
                height: getImageDimensionsByCex(c).height,
              }}
            />
            <div className="text-[#918C89] italic font-[600] mt-3">
              {getSubtitleByCEX(c)}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
};
