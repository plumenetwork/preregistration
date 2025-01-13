"use client";

import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { generateMessageToSign } from "./lib/shared/crypto";
import { useMutation } from "@tanstack/react-query";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useIsUserRegistered } from "./hooks/useIsUserRegistered";
import Link from "next/link";
import { CheckCircleIcon, Loader2Icon, XIcon } from "lucide-react";
import { usePrevious } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-toastify";
import { SignedMessageToast } from "./components/SignedMessageToast";
import { useTwitterConnect } from "./hooks/useTwitterConnect";
import { useSearchParams } from "next/navigation";
import { useTwitterDisconnect } from "./hooks/useTwitterDisconnect";
import { useIsMounted } from "./hooks/useIsMounted";
import { TwitterErrorToast } from "./components/TwitterErrorToast";
import { usePreregStore } from "./store";
import { useShallow } from "zustand/react/shallow";
import { PaneLayout } from "./components/PaneLayout";

export default function Home() {
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const shouldShowRegisterStep = searchParams.get("step") === "twitter";
  const twitterEncryptedId = searchParams.get("tid");
  const twitterEncryptedUsername = searchParams.get("tname");
  const twitterUsername = searchParams.get("rtname");
  const twitterError = searchParams.get("twitterError");
  const { mutateAsync: getTwitterConnectUrl, isPending: isFetchingTwitterUrl } =
    useTwitterConnect();
  const {
    mutateAsync: disconnectTwitter,
    isPending: isDisconnectingFromTwitter,
  } = useTwitterDisconnect();
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const previousAddress = usePrevious(address);
  const [currentPane, setCurrentPane] = usePreregStore(
    useShallow((state) => [state.currentPane, state.setCurrentPane])
  );
  const [finishedRegistration, setFinishedRegistration] = useState(false);
  const mounted = useIsMounted();

  useEffect(() => {
    if (twitterError) {
      toast(<TwitterErrorToast />);
    }
  }, [twitterError]);

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ["sign"],
    mutationFn: async ({
      message,
      signature,
      address,
      twitterEncryptedId,
      twitterEncryptedUsername,
    }: {
      message: string;
      signature: string;
      address: string;
      twitterEncryptedId?: string | null;
      twitterEncryptedUsername?: string | null;
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
          twitterEncryptedUsername: twitterEncryptedUsername || null,
          twitterEncryptedId: twitterEncryptedId || null,
        }),
      });
    },
  });
  const { isFetching, isLoading, data } = useIsUserRegistered(address);

  useEffect(() => {
    if (address !== previousAddress) {
      setMessage("");
      setSignature("");

      // User disconnected and not on register step, send them back to first step
      if (!address && currentPane !== "REGISTER") {
        setCurrentPane("DEFAULT");
      }
    }
  }, [previousAddress, address, currentPane]);

  useEffect(() => {
    // scroll to top

    if (currentPane === "DEFAULT") {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPane]);

  if (
    (shouldShowRegisterStep && !finishedRegistration) ||
    currentPane === "REGISTER"
  ) {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col pb-[100px] mt-[100px]">
            <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#FF3D00] font-[500] mb-2">
              Request Form
            </div>
            <div className="font-bold text-[42px] md:text-[48px] lg:text-[56px] mb-4">
              Register to Claim
            </div>
            <div className="mb-8 font-[500] text-[18px] md:text-[20px] lg:text-[24px]">
              To be able to claim, individuals must fill out this form and agree
              to the Plume Airdrop Terms of Service.
            </div>
            <ul className="flex flex-col gap-3">
              <li
                className={
                  "p-6 flex items-center gap-4 justify-between shadow-md rounded-[16px] border border-[#F0F0F0]"
                }
              >
                <div className="flex flex-col gap-1">
                  <div className="font-[500] text-lg">Connect Wallet</div>
                </div>

                <ConnectButton.Custom>
                  {({
                    account,
                    mounted,
                    authenticationStatus,
                    openConnectModal,
                  }) => {
                    if (!account || !mounted) {
                      return (
                        <button
                          className="bg-[#111111] px-4 py-2 rounded-full text-[#F0F0F0]"
                          disabled={
                            !mounted || authenticationStatus === "loading"
                          }
                          onClick={() => {
                            openConnectModal();
                          }}
                        >
                          Connect wallet
                        </button>
                      );
                    } else {
                      return (
                        <button
                          className="border border-[#111111] flex items-center gap-2 rounded-full px-3 py-2 hover:bg-[#F0F0F0] h-10"
                          onClick={() => {
                            disconnect();
                          }}
                        >
                          {account.address.slice(0, 6)}...
                          {account.address.slice(-4)}
                          <XIcon size={16} />
                        </button>
                      );
                    }
                  }}
                </ConnectButton.Custom>
              </li>

              <li className="p-6 flex items-center gap-4 justify-between shadow-md rounded-[16px] border border-[#F0F0F0]">
                <div className="flex flex-col gap-1">
                  <div className="font-[500] text-lg">Connect to X</div>
                </div>
                {!twitterUsername ? (
                  <button
                    className="border border-[#F0F0F0] px-4 py-2 text-sm font-[500] rounded-full hover:bg-[#F0F0F0] hover:text-[#111111] disabled:opacity-80"
                    disabled={isFetchingTwitterUrl}
                    onClick={async () => {
                      const { url } = await getTwitterConnectUrl();

                      window.location.href = url;
                    }}
                  >
                    {isFetchingTwitterUrl ? (
                      <div className="flex gap-2 items-center justify-center">
                        <Loader2Icon
                          size={16}
                          className="animate-spin text-[#111111]"
                        />
                        Connecting
                      </div>
                    ) : (
                      "Connect X"
                    )}
                  </button>
                ) : (
                  <button
                    className="border border-[#F0F0F0] px-4 py-2 text-sm font-[500] rounded-full hover:bg-[#F0F0F0] hover:text-[#111111] disabled:opacity-80"
                    onClick={async () => {
                      await disconnectTwitter();

                      console.log("relogging");

                      window.location.href = "/?step=twitter";
                    }}
                  >
                    {isDisconnectingFromTwitter ? (
                      <div className="flex gap-2 items-center justify-center">
                        <Loader2Icon
                          size={16}
                          className="animate-spin text-[#111111]"
                        />
                        Disconnecting
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center justify-center">
                        {twitterUsername}
                        <XIcon size={16} />
                      </div>
                    )}
                  </button>
                )}
              </li>

              <li className="p-6 flex items-center gap-4 justify-between shadow-md rounded-[16px] border border-[#F0F0F0]">
                <div className="text-lg font-[500] text-[#747474]">
                  I confirm that I&apos;ve read and agree with the
                  PlumeDrop&apos;s{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="underline text-[#111111]"
                  >
                    Terms of Service
                  </Link>
                </div>
                <AnimatePresence>
                  {signature ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-[#FFFFFF] text-[#111111] py-2 px-4 flex gap-1.5 items-center rounded-full"
                    >
                      <CheckCircleIcon size={12} /> Signed
                    </motion.div>
                  ) : (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-[#111111] text-[#F0F0F0] py-2 px-4 rounded-full h-10 hover:!opacity-80 disabled:!opacity-40 disabled:cursor-not-allowed"
                      disabled={!mounted || !address}
                      onClick={async () => {
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
                      }}
                    >
                      Sign
                    </motion.button>
                  )}
                </AnimatePresence>
              </li>
            </ul>
            <div className="mt-8">
              <button
                className="font-[500] text-lg hover:opacity-80 bg-[#111111] text-[#F0F0F0] rounded-full py-4 px-8 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-[#E7E7E7] disabled:text-[#111111]"
                disabled={isPending || !address || !signature}
                onClick={async () => {
                  if (!address) {
                    return;
                  }

                  await mutateAsync({
                    message,
                    signature,
                    address,
                    twitterEncryptedId: twitterEncryptedId || null,
                    twitterEncryptedUsername: twitterEncryptedUsername || null,
                  });

                  // Once done we can move to final step

                  setFinishedRegistration(true);
                  setCurrentPane("FINISHED");
                }}
              >
                {isPending ? (
                  <div className="flex gap-2 items-center justify-center">
                    <Loader2Icon
                      size={16}
                      className="animate-spin text-[#111111]"
                    />
                    Submitting
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
            {/* <div className="text-[#747474] text-sm font-[500]">
              <span className="text-[#111111]">Disclaimer</span>: Registering to
              claim does not automatically make you eligible for rewards. Final
              PlumeDrop allocation subject to eligibility verification.{" "}
              <Link
                target="_blank"
                href="https://plumenetwork.xyz/blog/plume-drop-faq"
                className="text-[#111111]"
              >
                Learn more
              </Link>
            </div> */}
          </div>
        }
        image="/images/plume-bg-3.avif"
      />
    );
  }

  if (currentPane === "FINISHED") {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col pb-[100px]">
            <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#FF3D00] font-[500] mb-2">
              You’re all set
            </div>
            <div className="font-bold text-[42px] md:text-[48px] lg:text-[56px] mb-4">
              You&apos;re Registered
            </div>
            <div className="mb-8 font-[500] text-[18px] md:text-[20px] lg:text-[24px]">
              Thank you for registering to the Plume Airdrop. Stay tuned for
              updates as Plume approaches its live release.
            </div>
            <div>
              <Link
                href="https://x.com/plumenetwork"
                target="_blank"
                rel="noopener noreferrer"
                passHref
                className="w-auto text-center justify-center font-[500] text-lg hover:opacity-80 bg-[#111111] text-[#F0F0F0] rounded-full py-4 px-8 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Follow Plume on X
              </Link>
            </div>
          </div>
        }
        image="/images/plume-bg-1.avif"
      />
    );
  }

  if (currentPane === "DEFAULT") {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col pb-[100px] mt-[100px]">
            <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#FF3D00] font-[500] mb-2">
              Registration Form
            </div>
            <div className="font-bold text-[42px] md:text-[48px] lg:text-[56px] mb-4">
              Plume Airdrop
            </div>
            <div className="mb-8 font-[500] text-[18px] md:text-[20px] lg:text-[24px]">
              Plume&apos;s first official Airdrop rewards early contributors
              who’ve been a part of the journey thus far.
            </div>
            <div>
              <ConnectButton.Custom>
                {({
                  account,
                  openConnectModal,
                  mounted,
                  authenticationStatus,
                }) => {
                  return (
                    <button
                      className="font-[500] text-lg hover:opacity-80 bg-[#111111] text-[#F0F0F0] rounded-full py-4 px-8 flex justify-center disabled:bg-[#E7E7E7] disabled:opacity-40 disabled:cursor-not-allowed disabled:text-[#111111]"
                      disabled={
                        !mounted ||
                        authenticationStatus === "loading" ||
                        isFetching ||
                        isLoading
                      }
                      onClick={() => {
                        if (account) {
                          if (data?.registered) {
                            setCurrentPane("FINISHED");
                          } else {
                            setCurrentPane("ABOUT");
                          }
                        } else {
                          openConnectModal();
                        }
                      }}
                    >
                      {!mounted || isFetching || isLoading ? (
                        <div className="h-[28px] flex items-center">
                          <Loader2Icon
                            size={16}
                            className="animate-spin text-[#111111]"
                          />
                        </div>
                      ) : account ? (
                        "Get Started"
                      ) : (
                        "Connect Wallet"
                      )}
                    </button>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        }
        image="/images/plume-bg-1.avif"
      />
    );
  }

  if (currentPane === "ABOUT") {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col pb-[100px] mt-[100px]">
            <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#FF3D00] font-[500] mb-2">
              About Plume
            </div>
            <div className="font-bold text-[42px] md:text-[48px] lg:text-[56px] mb-4">
              The L1 for RWAs
            </div>
            <div className="mb-8 font-[500] text-[18px] md:text-[20px] lg:text-[24px]">
              Plume is the first Layer 1 blockchain designed to unlock the full
              potential of real-world assets (RWAs) by making them composable,
              liquid, and accessible within a secure and compliant ecosystem.
            </div>
            <div className="flex items-center gap-4">
              <Link
                target="_blank"
                href="https://plumenetwork.xyz/blog/plume-drop-faq"
                className="font-[500] text-lg hover:opacity-80 bg-white text-[#111111] border border-[#F0F0F0] rounded-full py-4 px-8 flex justify-center disabled:bg-[#E7E7E7] disabled:opacity-40 disabled:cursor-not-allowed disabled:text-[#111111]"
              >
                About Plume
              </Link>

              <button
                className="font-[500] text-lg hover:opacity-80 bg-[#111111] text-[#F0F0F0] rounded-full py-4 px-8 flex justify-center disabled:bg-[#E7E7E7] disabled:opacity-40 disabled:cursor-not-allowed disabled:text-[#111111]"
                onClick={() => {
                  setCurrentPane("MEET");
                }}
              >
                Continue
              </button>
            </div>
          </div>
        }
        image="/images/plume-bg-2.avif"
      />
    );
  }

  if (currentPane === "MEET") {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col pb-[100px] mt-[100px]">
            <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#FF3D00] font-[500] mb-2">
              The Plume Token
            </div>
            <div className="font-bold text-[42px] md:text-[48px] lg:text-[56px] mb-4">
              $PLUME is here
            </div>
            <div className="mb-8 font-[500] text-[18px] md:text-[20px] lg:text-[24px]">
              $PLUME is designed to secure and power the Plume RWA Chain and
              broader RWAfi.
              <br />
              <br />
              <span className="text-[#922100]">
                The Plume Airdrop will be the first official airdrop of $PLUME,
                supporting our effort of building a unified RWAfi ecosystem.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="font-[500] text-lg hover:opacity-80 bg-[#111111] text-[#F0F0F0] rounded-full py-4 px-8 flex justify-center disabled:bg-[#E7E7E7] disabled:opacity-40 disabled:cursor-not-allowed disabled:text-[#111111]"
                onClick={() => {
                  setCurrentPane("REGISTER");
                }}
              >
                Continue
              </button>
            </div>
          </div>
        }
        image="/images/plume-bg-3.avif"
      />
    );
  }

  return <div />;
}
