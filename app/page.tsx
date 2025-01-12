"use client";

import clsx from "clsx";
import Image from "next/image";
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

const RegistrationPane = {
  DEFAULT: "DEFAULT",
  ABOUT: "ABOUT",
  MEET: "MEET",
  REGISTER: "REGISTER",
  FINISHED: "FINISHED",
} as const;

type RegistrationPaneType =
  (typeof RegistrationPane)[keyof typeof RegistrationPane];

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
  const [currentPane, setCurrentPane] = useState<RegistrationPaneType>(
    RegistrationPane.DEFAULT
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
        setCurrentPane(RegistrationPane.DEFAULT);
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
      <div className="md:p-12 p-5 rounded-[24px] border border-[#F0F0F0] flex flex-col gap-6 max-w-[640px] w-full mx-auto md:mt-16 mt-5 bg-white">
        <div>
          <div className="text-[40px] mb-4 font-bold text-center">
            Register to Claim
          </div>
          <div className="text-[#747474] text-lg text-center font-[500]">
            To be able to claim, individuals must fill out this form and agree
            to the PlumeDrop Terms of Service.
          </div>
        </div>

        <ul className="flex flex-col">
          <li
            className={clsx(
              "border p-6 flex items-center gap-4 rounded-tr-[24px] rounded-tl-[24px] justify-between"
            )}
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
                      disabled={!mounted || authenticationStatus === "loading"}
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

          <li
            className={clsx(
              "border border-t-0 p-6 flex items-center gap-4 rounded-br-[24px] rounded-bl-[24px] justify-between"
            )}
          >
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
        </ul>
        <div className="bg-[#F9F9F9] rounded-[24px] p-6 flex gap-4 items-center">
          <div className="text-lg font-[500] text-[#747474]">
            I confirm that I&apos;ve read and agree with the PlumeDrop&apos;s{" "}
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
        </div>

        <div>
          <button
            className="w-full font-[500] text-lg hover:opacity-80 bg-[#111111] text-[#F0F0F0] rounded-full py-4 px-8 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-[#E7E7E7] disabled:text-[#111111]"
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
              setCurrentPane(RegistrationPane.FINISHED);
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
        <div className="text-[#747474] text-sm font-[500]">
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
        </div>
      </div>
    );
  }

  if (currentPane === "FINISHED") {
    return (
      <div className="md:p-12 p-5 rounded-[24px] border border-[#F0F0F0] flex flex-col gap-6 max-w-[640px] w-full mx-auto md:mt-16 mt-5 bg-white">
        <Image
          alt=""
          src="/images/plume-logo.avif"
          className="mx-auto"
          width={64}
          height={64}
        />
        <div>
          <div className="text-[40px] mb-4 font-bold text-center">
            You&apos;re All Set!
          </div>
          <div className="text-[#747474] text-lg text-center font-[500]">
            Thank you for registering for PlumeDrop I. We&apos;ll keep you
            posted on updates as Plume approaches its live release.
          </div>
        </div>

        <div>
          <Link
            href="https://x.com/plumenetwork"
            target="_blank"
            rel="noopener noreferrer"
            passHref
            className="flex text-center justify-center w-full font-[500] text-lg hover:opacity-80 bg-[#111111] text-[#F0F0F0] rounded-full py-4 px-8 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Follow Plume on X
          </Link>
        </div>
      </div>
    );
  }

  if (currentPane === "DEFAULT") {
    return (
      <div className="md:p-12 p-5 rounded-[24px] border border-[#F0F0F0] flex flex-col gap-6 max-w-[640px] w-full mx-auto md:mt-16 mt-5 bg-white">
        <div className="w-full aspect-[544/320] relative">
          <Image src="/images/plume-default-banner.avif" alt="" layout="fill" />
        </div>
        <div>
          <div className="text-lg text-[#FF3D00] mb-2 font-[500] text-center">
            Season 1 of Plume&apos;s Official Token Airdrop
          </div>
          <div className="text-[40px] mb-4 font-bold text-center">
            Register for Plume&apos;s Airdrop
          </div>
          <div className="text-[#747474] text-lg text-center font-[500]">
            Plume&apos;s first official airdrop rewards early contributors
            who&apos;ve been a part of the journey thus far.
            <Link
              target="_blank"
              href="https://plumenetwork.xyz/blog/plume-drop-faq"
              className="underline whitespace-nowrap"
            >
              Learn more
            </Link>
            .
          </div>
        </div>
        <ul className="flex flex-col">
          {[
            {
              image: "/images/plume-default-icon-1.avif",
              title: "Testnet Users",
              description:
                "Participants who’ve contributed considerable testing and engagement across our Testnet campaign.",
            },
            {
              image: "/images/plume-default-icon-2.avif",
              title: "Pre-Deposit Users",
              description:
                "Participants who’ve contributed funds into the Plume Vault and into the into the Nest Pre-Deposit vault.",
            },
            {
              image: "/images/plume-default-icon-3.avif",
              title: "Engaged Protocols & Communities",
              description:
                "Individuals and protocols who’ve helped lay out the foundation for the Plume ecosystem up to today.",
            },
          ].map(({ image, title, description }, idx) => {
            return (
              <li
                key={idx}
                className={clsx(
                  "border p-6 flex items-center gap-4",
                  idx === 0 && "rounded-tr-[24px] rounded-tl-[24px]",
                  idx === 1 && "border-t-0 border-b-0",
                  idx === 2 && "rounded-br-[24px] rounded-bl-[24px]"
                )}
              >
                <Image
                  src={image}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div className="flex flex-col gap-1">
                  <div className="font-[500] text-lg">{title}</div>
                  <div className="text-[#747474] font-[500]">{description}</div>
                </div>
              </li>
            );
          })}
        </ul>
        <ConnectButton.Custom>
          {({ account, openConnectModal, mounted, authenticationStatus }) => {
            return (
              <button
                className="w-full font-[500] text-lg hover:opacity-80 bg-[#111111] text-[#F0F0F0] rounded-full py-4 px-8 flex justify-center disabled:bg-[#E7E7E7] disabled:opacity-40 disabled:cursor-not-allowed disabled:text-[#111111]"
                disabled={
                  !mounted ||
                  authenticationStatus === "loading" ||
                  isFetching ||
                  isLoading
                }
                onClick={() => {
                  if (account) {
                    if (data?.registered) {
                      setCurrentPane(RegistrationPane.FINISHED);
                    } else {
                      setCurrentPane(RegistrationPane.ABOUT);
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
                  "Continue"
                ) : (
                  "Connect Wallet"
                )}
              </button>
            );
          }}
        </ConnectButton.Custom>
      </div>
    );
  }

  if (currentPane === "ABOUT") {
    return (
      <div className="md:p-12 p-5 rounded-[24px] border border-[#F0F0F0] flex flex-col gap-6 max-w-[640px] w-full mx-auto md:mt-16 mt-5 bg-white">
        <Image
          alt=""
          src="/images/plume-about-logo.avif"
          className="mx-auto"
          width={64}
          height={64}
        />
        <div>
          <div className="text-[40px] mb-4 font-bold text-center">
            About Plume
          </div>
          <div className="text-[#747474] text-lg text-center font-[500]">
            PlumeDrop is directly associated to Plume, the first fully modular
            L1 chain tailored for real-world assets.
          </div>
        </div>

        <ul className="flex flex-col">
          {[
            {
              image: "/images/plume-about-icon-1.avif",
              title: "Building RWAfi",
              description:
                "Plume is focused on bridging the real world onchain to enable real asset-backed, crypto native use cases.",
            },
            {
              image: "/images/plume-about-icon-2.avif",
              title: "Comprehensive Ecosystem",
              description:
                "RWAfi on Plume benefits from built-in compliance solutions, liquidity, and tokenization, all in one seamless flow.",
            },
            {
              image: "/images/plume-about-icon-3.avif",
              title: "Institutional-Grade Applications",
              description:
                "Plume is built on robust, scalable architecture that supports the broader effort of sustaining a thriving onchain economy.",
            },
          ].map(({ image, title, description }, idx) => {
            return (
              <li
                key={idx}
                className={clsx(
                  "border p-6 flex items-center gap-4",
                  idx === 0 && "rounded-tr-[24px] rounded-tl-[24px]",
                  idx === 1 && "border-t-0 border-b-0",
                  idx === 2 && "rounded-br-[24px] rounded-bl-[24px]"
                )}
              >
                <Image
                  src={image}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div className="flex flex-col gap-1">
                  <div className="font-[500] text-lg">{title}</div>
                  <div className="text-[#747474] font-[500]">{description}</div>
                </div>
              </li>
            );
          })}
        </ul>

        <div>
          <button
            className="w-full font-[500] text-lg hover:opacity-80 bg-[#111111] text-[#F0F0F0] rounded-full py-4 px-8"
            onClick={() => {
              setCurrentPane(RegistrationPane.MEET);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (currentPane === "MEET") {
    return (
      <div className="md:p-12 p-5 rounded-[24px] border border-[#F0F0F0] flex flex-col gap-6 max-w-[640px] w-full mx-auto md:mt-16 mt-5 bg-white">
        <div className="w-full aspect-[544/320] relative">
          <Image src="/images/plume-meet-banner.avif" alt="" layout="fill" />
        </div>

        <div>
          <div className="text-[40px] mb-4 font-bold text-center">
            Meet <span className="text-[#FF3D00]">$PLUME</span>
          </div>
          <div className="text-[#747474] text-lg text-center font-[500]">
            PlumeDrop will distribute $PLUME, the official RWAfi ecosystem token
            on Plume, designed to align stakeholders across the ecosystem and
            unlock long term objectives.
          </div>
        </div>

        <ul className="flex flex-col">
          {[
            {
              image: "/images/plume-meet-icon-1.avif",
              title: "Transaction Costs",
              description:
                "Power low-cost (>$0.01), efficient transactions across the Plume ecosystem for a seamless user experience.",
            },
            {
              image: "/images/plume-meet-icon-2.avif",
              title: "Ecosystem Liquidity",
              description:
                "By seeding initial liquidity and reserve funds, $PLUME empowers thousands of traders, lenders, and users from day one.",
            },
            {
              image: "/images/plume-meet-icon-3.avif",
              title: "Decentralized Governance",
              description:
                "Empower with the community with active participation in decision-making and help shape the future of Plume.",
            },
            {
              image: "/images/plume-meet-icon-4.avif",
              title: "Staking as Security",
              description:
                "By staking $PLUME, representatives and validators secure the network against even the most sophisticated threats while earning staking rewards in return.",
            },
          ].map(({ image, title, description }, idx) => {
            return (
              <li
                key={idx}
                className={clsx(
                  "border p-6 flex items-center gap-4",
                  idx === 0 && "rounded-tr-[24px] rounded-tl-[24px]",
                  idx === 1 && "border-t-0",
                  idx === 2 && "border-b-0 border-t-0",
                  idx === 3 && "rounded-br-[24px] rounded-bl-[24px]"
                )}
              >
                <Image
                  src={image}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div className="flex flex-col gap-1">
                  <div className="font-[500] text-lg">{title}</div>
                  <div className="text-[#747474] font-[500]">{description}</div>
                </div>
              </li>
            );
          })}
        </ul>

        <div>
          <button
            className="w-full font-[500] text-lg hover:opacity-80 bg-[#111111] text-[#F0F0F0] rounded-full py-4 px-8"
            onClick={() => {
              setCurrentPane(RegistrationPane.REGISTER);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return <div />;
}
