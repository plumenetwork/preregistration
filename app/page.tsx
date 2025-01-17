"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { generateMessageToSign } from "./lib/shared/crypto";
import { useMutation } from "@tanstack/react-query";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useIsUserRegistered } from "./hooks/useIsUserRegistered";
import Link from "next/link";
import { Loader2Icon, MoveUpRightIcon, XIcon } from "lucide-react";
import { usePrevious } from "@uidotdev/usehooks";
import { toast } from "react-toastify";
import { SignedMessageToast } from "./components/SignedMessageToast";
import { useIsMounted } from "./hooks/useIsMounted";
import { usePreregStore } from "./store";
import { useShallow } from "zustand/react/shallow";
import { PaneLayout } from "./components/PaneLayout";
import {
  CEXSelection,
  CEXType,
  getCexLinkDesktop,
  getCexLinkMobile,
  getDepositLabelByCEX,
  getLabelByCex,
  getPlaceholderByCex,
} from "./components/CEXSelection";
import { isAddress } from "viem";

const getCexHelpArticle = (cex: CEXType) => {
  switch (cex) {
    case "BITGET":
      return "https://plume-network.notion.site/plume-bitget";
    case "BYBIT":
      return "https://plume-network.notion.site/plume-bybit";
    case "KUCOIN":
      return "https://plume-network.notion.site/plume-kucoin";
  }
};

export default function Home() {
  const { signMessageAsync, isPending: isSigningMessage } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const mounted = useIsMounted();
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const previousAddress = usePrevious(address);
  const [currentPane, setCurrentPane] = usePreregStore(
    useShallow((state) => [state.currentPane, state.setCurrentPane])
  );
  const [cex, setCex] = useState<CEXType | null>(null);
  const [cexId, setCexId] = useState("");
  const [cexAddress, setCexAddress] = useState("");
  const [cexAddressError, setCexAddressError] = useState("");
  const [userIdError, setUserIdError] = useState("");

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ["sign"],
    mutationFn: async ({
      message,
      signature,
      address,
      cex,
      cexId,
      cexAddress,
    }: {
      message: string;
      signature: string;
      address: string;
      cex: CEXType;
      cexId: string;
      cexAddress: string;
    }) => {
      return fetch("/api/sign-write", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          signature,
          address,
          cex,
          cexId,
          cexAddress,
        }),
      });
    },
  });
  const { isFetching, isLoading } = useIsUserRegistered(address);

  useEffect(() => {
    if (address !== previousAddress) {
      setMessage("");
      setSignature("");
    }
  }, [previousAddress, address, currentPane]);

  useEffect(() => {
    // scroll to top
    if (currentPane === "DEFAULT") {
      return;
    }

    if (currentPane === "FORM") {
      const cexFormElement = document.getElementById("cexform");

      if (cexFormElement) {
        cexFormElement.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [currentPane]);

  if (currentPane === "FORM") {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col">
            <div className="text-[36px] md:text-[48px] lg:text-[56px] leading-[1.2] font-reckless text-center mb-3">
              Select an Exchange
            </div>
            <div className="text-[18px] md:text-[20px] lg:text-[24px] text-[#918C89] text-center">
              Select your preferred exchange and follow the instructions to link
              your account.
            </div>
            <div className="mt-12">
              <CEXSelection
                cex={cex}
                onClick={(cex) => {
                  setCex(cex);
                  setCurrentPane("FORM");
                }}
              />
            </div>
            {cex && (
              <div
                className="mt-8 lg:mt-16 flex flex-col gap-8 pb-[200px]"
                id="cexform"
              >
                <div className="text-[28px] font-reckless">
                  1. Add your details
                </div>
                <label className="flex flex-col gap-2">
                  <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
                    <div className="text-[18px]">User ID</div>
                    <Link
                      className="text-[18px] text-[#39BEB7] flex gap-1 items-center"
                      href={getCexHelpArticle(cex)}
                      target="_blank"
                    >
                      What&apos;s my User ID?{" "}
                      <MoveUpRightIcon size={18} color="#39BEB7" />
                    </Link>
                  </div>
                  <input
                    type="text"
                    placeholder={getPlaceholderByCex(cex)}
                    className="px-5 py-4 rounded-[8px] bg-white/5"
                    value={cexId}
                    onChange={(e) => {
                      setUserIdError("");
                      setCexId(e.target.value);
                    }}
                    onBlur={() => {
                      // If cex is bitget, the user id should be a number

                      if (cexId === "") {
                        setUserIdError("");
                      } else if (
                        cex === "BITGET" &&
                        (cexId.match(/^\d+$/) === null ||
                          cexId.length < 9 ||
                          cexId.length > 11)
                      ) {
                        setUserIdError("Invalid User ID");
                      }
                    }}
                  />
                  {userIdError && (
                    <div className="text-[#FF3D00] text-[18px]">
                      {userIdError}
                    </div>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
                    <div className="text-[18px]">
                      {getDepositLabelByCEX(cex)}
                    </div>
                    <Link
                      className="text-[18px] text-[#39BEB7] flex gap-1 items-center"
                      href={getCexHelpArticle(cex)}
                      target="_blank"
                    >
                      Where&apos;s my Plume address?{" "}
                      <MoveUpRightIcon size={18} color="#39BEB7" />
                    </Link>
                  </div>
                  <input
                    type="text"
                    placeholder="0x0000000000000000000000000000000000000000"
                    className="px-5 py-4 rounded-[8px] bg-white/5"
                    value={cexAddress}
                    onChange={(e) => {
                      setCexAddressError("");
                      setCexAddress(e.target.value);
                    }}
                    onBlur={() => {
                      if (cexAddress === "") {
                        setCexAddressError("");
                      } else if (!isAddress(cexAddress)) {
                        setCexAddressError(
                          "Please specify a valid EVM address"
                        );
                      }
                    }}
                  />
                  {cexAddressError && (
                    <div className="text-[#FF3D00] text-[18px]">
                      {cexAddressError}
                    </div>
                  )}
                </label>

                <div className="flex flex-col gap-1">
                  <div className="text-[#918C89] text-[18px]">
                    Don&apos;t have an account?
                  </div>

                  <Link
                    className="text-[18px] flex md:hidden gap-1 items-center"
                    href={getCexLinkMobile(cex)}
                    target="_blank"
                  >
                    Create a {getLabelByCex(cex)} account
                    <MoveUpRightIcon size={18} />
                  </Link>

                  <Link
                    className="text-[18px] hidden md:flex gap-1 items-center"
                    href={getCexLinkDesktop(cex)}
                    target="_blank"
                  >
                    Create a {getLabelByCex(cex)} account
                    <MoveUpRightIcon size={18} />
                  </Link>
                </div>

                <div className="border-t border-[#2C2A29]" />

                <div className="text-[28px] font-reckless">
                  2. Sign the Terms of Service
                </div>
                <div className="text-[18px] text-[#918C89]">
                  By signing below, you confirm that you&apos;ve read and agree
                  with Plume&apos;s Airdrop{" "}
                  <Link
                    className="text-[18px] inline-flex gap-1 items-center text-white"
                    href="/terms"
                    target="_blank"
                  >
                    Terms of Service
                    <MoveUpRightIcon size={18} />
                  </Link>
                </div>

                <ConnectButton.Custom>
                  {({ account, openConnectModal, authenticationStatus }) => {
                    return (
                      <button
                        className="rounded-[24px] border border-dashed border-[#2C2A29] py-[60px] flex items-center justify-center hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={
                          !mounted ||
                          authenticationStatus === "loading" ||
                          isSigningMessage ||
                          !!signature
                        }
                        onClick={async () => {
                          if (account) {
                            const { message } = generateMessageToSign();
                            try {
                              const sig = await signMessageAsync({
                                message,
                              });

                              setMessage(message);
                              setSignature(sig);
                              toast(<SignedMessageToast />);
                            } catch (e) {
                              console.error(e);
                            }
                          } else {
                            openConnectModal();
                          }
                        }}
                      >
                        {mounted && (
                          <div className="font-reckless flex items-center gap-2 text-[18px]">
                            {account ? (
                              <>
                                <span>
                                  <Image
                                    alt=""
                                    src="/images/plume-logo.png"
                                    width={16}
                                    height={16}
                                  />
                                </span>
                                {signature ? (
                                  <span>Signed</span>
                                ) : isSigningMessage ? (
                                  <span>Signing</span>
                                ) : (
                                  <span>
                                    Sign <span className="italic">here</span>
                                  </span>
                                )}
                              </>
                            ) : (
                              <>
                                <Image
                                  alt=""
                                  src="/images/wallet-logo.png"
                                  width={32}
                                  height={20}
                                />
                                Connect Wallet
                              </>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  }}
                </ConnectButton.Custom>

                <div className="border-t border-[#2C2A29]" />

                <div className="text-[28px] font-reckless">
                  3. Submit the form
                </div>

                <div className="text-[#918C89]">
                  By submitting this form, you acknowledge that you have
                  reviewed and agree to Plume&apos;s Airdrop Terms of Service,
                  including the{" "}
                  <span className="text-white">
                    forfeiture of additional boosts
                  </span>{" "}
                  offered to onchain claimers.
                </div>
                <div className="mt-6 justify-center flex">
                  <button
                    className="font-[600] text-lg hover:opacity-80 bg-white text-[#1A1613] rounded-full py-4 px-8 flex justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={
                      !signature ||
                      isPending ||
                      isFetching ||
                      isLoading ||
                      !!cexAddressError ||
                      !!userIdError ||
                      !cexId ||
                      !cexAddress
                    }
                    onClick={async () => {
                      if (!address || !cex) {
                        return;
                      }

                      await mutateAsync({
                        message,
                        signature,
                        address,
                        cex,
                        cexId,
                        cexAddress,
                      });

                      setCurrentPane("FINISHED");
                    }}
                  >
                    {isPending ? (
                      <div className="flex gap-2 items-center justify-center">
                        <Loader2Icon
                          size={16}
                          className="animate-spin text-[#1A1613]"
                        />
                        Submitting
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        }
      />
    );
  }

  if (currentPane === "CEX_SELECTION") {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col">
            <div className="text-[36px] md:text-[48px] lg:text-[56px] leading-[1.2] font-reckless text-center mb-3">
              Select an Exchange
            </div>
            <div className="text-[18px] md:text-[20px] lg:text-[24px] text-[#918C89] text-center">
              Select your preferred exchange and follow the instructions to link
              your account.
            </div>
            <div className="mt-12 pb-[200px]">
              <CEXSelection
                cex={cex}
                onClick={(cex) => {
                  setCex(cex);
                  setCurrentPane("FORM");
                }}
              />
            </div>
          </div>
        }
      />
    );
  }

  if (currentPane === "FINISHED") {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col">
            <div className="text-[36px] md:text-[48px] lg:text-[56px] leading-[1.2] font-reckless text-center mb-3">
              Form Submitted
            </div>
            <div className="text-[18px] md:text-[20px] lg:text-[24px] text-[#918C89] text-center">
              Thank you for registering. Follow Plume on 𝕏 to stay tuned for
              updates.
            </div>
            <div className="flex flex-col md:flex-row mt-8 justify-center items-center gap-4">
              <Link
                href="https://x.com/plumenetwork"
                target="_blank"
                rel="noopener noreferrer"
                passHref
                className="w-full md:w-auto font-[600] text-lg hover:opacity-80 bg-white text-[#1A1613] rounded-full py-4 px-8 flex justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Follow @plumenetwork
              </Link>
              <Link
                href="https://x.com/plumefndn"
                target="_blank"
                rel="noopener noreferrer"
                passHref
                className="w-full md:w-auto font-[600] text-lg hover:opacity-80 bg-white text-[#1A1613] rounded-full py-4 px-8 flex justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Follow @plumefndn
              </Link>
            </div>
          </div>
        }
      />
    );
  }

  if (currentPane === "DEFAULT") {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col h-full grow">
            <div className="text-[36px] md:text-[48px] lg:text-[56px] leading-[1.2] font-reckless text-center mb-3">
              Claim Plume&apos;s Airdrop via{" "}
              <span className="italic">Centralized Exchange</span>
            </div>
            <div className="text-[18px] md:text-[20px] lg:text-[24px] text-[#918C89] text-center">
              Submit this form to claim Plume&apos;s Airdrop ahead of the Plume
              live release via a centralized exchange.
            </div>
            <div className="mt-12">
              <ConnectButton.Custom>
                {({
                  account,
                  openConnectModal,
                  mounted,
                  authenticationStatus,
                }) => {
                  return (
                    <div className="flex flex-col items-center gap-4">
                      <button
                        className="font-[600] text-lg hover:opacity-80 bg-white text-[#1A1613] rounded-full py-4 px-8 flex justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={
                          !mounted ||
                          authenticationStatus === "loading" ||
                          isFetching ||
                          isLoading
                        }
                        onClick={() => {
                          if (account) {
                            // if (data?.registered) {
                            //   setCurrentPane("FINISHED");
                            // } else {
                            setCurrentPane("CEX_SELECTION");
                            // }
                          } else {
                            openConnectModal();
                          }
                        }}
                      >
                        {!mounted || isFetching || isLoading ? (
                          <div className="h-[28px] flex items-center">
                            <Loader2Icon
                              size={16}
                              className="animate-spin text-[#1A1613]"
                            />
                          </div>
                        ) : account ? (
                          "Get Started"
                        ) : (
                          "Connect Wallet"
                        )}
                      </button>
                      {mounted && account?.address && (
                        <button
                          className="text-[#918C89] text-lg flex items-center gap-2 hover:underline"
                          onClick={() => {
                            disconnect();
                          }}
                        >
                          <span>
                            {account.address.slice(0, 3)}...
                            {account.address?.slice(-3)}
                          </span>
                          <XIcon size={20} />
                        </button>
                      )}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
            <div className="text-[#918C89] mt-auto py-8">
              <div className="text-[32px] mx-auto text-center mb-3">⚠️</div>
              <span className="text-white">Disclaimer</span>: Claiming your
              airdrop through an exchange is optional. If eligible, this method
              allows you to receive part of your airdrop early without gas fees.
              However, claiming through an exchange will limit your future
              airdrop boosts, while onchain claims will retain access to the
              full range of boosts.
            </div>
          </div>
        }
      />
    );
  }

  return null;
}
