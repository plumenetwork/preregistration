"use client";

import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { generateMessageToSign } from "./lib/shared/crypto";
import { useMutation } from "@tanstack/react-query";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useIsUserRegistered } from "./hooks/useIsUserRegistered";
import Link from "next/link";
import { CheckIcon, Loader2Icon, MoveUpRightIcon, XIcon } from "lucide-react";
import { usePrevious } from "@uidotdev/usehooks";
import { toast } from "react-toastify";
import { SignedMessageToast } from "./components/SignedMessageToast";
import { useIsMounted } from "./hooks/useIsMounted";
import { usePreregStore } from "./store";
import { useShallow } from "zustand/react/shallow";
import { PaneLayout } from "./components/PaneLayout";
import Image from "next/image";
import { CEXSelection, CEXType } from "./components/CEXSelection";

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
  const [finishedRegistration, setFinishedRegistration] = useState(false);

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ["sign"],
    mutationFn: async ({
      message,
      signature,
      address,
      twitterEncryptedId,
      twitterEncryptedUsername,
      discordEncryptedId,
      discordEncryptedUsername,
    }: {
      message: string;
      signature: string;
      address: string;
      twitterEncryptedId?: string | null;
      twitterEncryptedUsername?: string | null;
      discordEncryptedId?: string | null;
      discordEncryptedUsername?: string | null;
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
          discordEncryptedUsername: discordEncryptedUsername || null,
          discordEncryptedId: discordEncryptedId || null,
        }),
      });
    },
  });
  const { isFetching, isLoading, data } = useIsUserRegistered(address);

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
            <div>Form</div>
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
            <div className="mt-12">
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
          <div className="flex flex-col pb-[100px] mt-8 ">
            <div className="font-[500] text-[42px] md:text-[48px] lg:text-[56px] mb-4 font-reckless italic">
              You’re Registered
            </div>
            <div className="mb-8 font-[500] text-[18px] md:text-[20px] lg:text-[24px] text-[#918C89]">
              Thank you for registering for Plume&apos;s Airdrop. Further
              updates will be shared on Plume&apos;s X account.
            </div>
            <div className="flex">
              <Link
                href="https://x.com/plumenetwork"
                target="_blank"
                rel="noopener noreferrer"
                passHref
                className="w-auto font-[600] text-lg hover:opacity-80 bg-white text-[#1A1613] rounded-full py-4 px-8 flex justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Follow Plume on X
              </Link>
            </div>
          </div>
        }
        image="/images/plume-bg-1.webp"
      />
    );
  }

  if (currentPane === "DEFAULT") {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col">
            <div className="text-[36px] md:text-[48px] lg:text-[56px] leading-[1.2] font-reckless text-center mb-3">
              Claim Plume Airdrop via{" "}
              <span className="italic">Centralized Exchange</span>
            </div>
            <div className="text-[18px] md:text-[20px] lg:text-[24px] text-[#918C89] text-center">
              Submit this form to claim your Plume Airdrop ahead of the Plume
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
                            if (data?.registered) {
                              setCurrentPane("FINISHED");
                            } else {
                              setCurrentPane("CEX_SELECTION");
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
          </div>
        }
      />
    );
  }

  return null;
}
