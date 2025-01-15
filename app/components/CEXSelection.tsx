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

export const getCexLinkDesktop = (cex: CEXType) => {
  switch (cex) {
    case CEX.BITGET:
      return "https://www.bitget.com/";
    case CEX.BYBIT:
      return "https://www.bybit.com/";
    case CEX.KUCOIN:
      return "https://www.kucoin.com/";
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
      return "ttps://www.kucoin.com/download";
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

export const CEXSelection = ({ cex, onClick }: Props) => {
  return (
    <ul className="flex flex-wrap gap-8">
      {Object.values(CEX).map((c) => (
        <li
          key={c}
          className="lg:basis-[calc(33.33%-2rem)] md:basis-[calc(50%-2rem)] basis-full"
        >
          <button
            className={clsx(
              "rounded-[12px] p-4 border-[2px] flex w-full aspect-[200/112] hover:opacity-80 items-center justify-center relative transition-all",
              cex === c ? "border-[#39BEB7]" : "border-[#403E3C]"
            )}
            onClick={() => {
              onClick(c);
            }}
          >
            <Image
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              alt={getLabelByCex(c)}
              src={getImageByCex(c)}
              width={getImageDimensionsByCex(c).width}
              height={getImageDimensionsByCex(c).height}
              style={{
                width: getImageDimensionsByCex(c).width,
                height: getImageDimensionsByCex(c).height,
              }}
            />
          </button>
        </li>
      ))}
    </ul>
  );
};
