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
import { useTwitterConnect } from "./hooks/useTwitterConnect";
import { useSearchParams } from "next/navigation";
import { useTwitterDisconnect } from "./hooks/useTwitterDisconnect";
import { useIsMounted } from "./hooks/useIsMounted";
import { TwitterErrorToast } from "./components/TwitterErrorToast";
import { DiscordErrorToast } from "./components/DiscordErrorToast";
import { usePreregStore } from "./store";
import { useShallow } from "zustand/react/shallow";
import { PaneLayout } from "./components/PaneLayout";
import { useDiscordConnect } from "./hooks/useDiscordConnect";
import { useDiscordDisconnect } from "./hooks/useDiscordDisconnect";
import Image from "next/image";

export default function Home() {
  const { signMessageAsync, isPending: isSigningMessage } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const shouldShowRegisterStep = searchParams.get("step") === "twitter";
  const twitterEncryptedId = searchParams.get("tid");
  const twitterEncryptedUsername = searchParams.get("tname");
  const twitterUsername = searchParams.get("rtname");
  const twitterError = searchParams.get("twitterError");
  const discordEncryptedId = searchParams.get("did");
  const discordEncryptedUsername = searchParams.get("dname");
  const discordUsername = searchParams.get("rdname");
  const discordError = searchParams.get("discordError");
  const mounted = useIsMounted();

  const { mutateAsync: getTwitterConnectUrl, isPending: isFetchingTwitterUrl } =
    useTwitterConnect();
  const { mutateAsync: getDiscordConnectUrl, isPending: isFetchingDiscordUrl } =
    useDiscordConnect();
  const {
    mutateAsync: disconnectTwitter,
    isPending: isDisconnectingFromTwitter,
  } = useTwitterDisconnect();
  const {
    mutateAsync: disconnectDiscord,
    isPending: isDisconnectingFromDiscord,
  } = useDiscordDisconnect();
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const previousAddress = usePrevious(address);
  const [currentPane, setCurrentPane] = usePreregStore(
    useShallow((state) => [state.currentPane, state.setCurrentPane])
  );
  const [finishedRegistration, setFinishedRegistration] = useState(false);

  useEffect(() => {
    if (shouldShowRegisterStep) {
      setCurrentPane("REGISTER");
      const urlParams = new URLSearchParams(window.location.search);

      urlParams.delete("step");

      window.history.pushState(null, "", `?${urlParams.toString()}`);
    }
  }, [shouldShowRegisterStep]);

  useEffect(() => {
    if (twitterError) {
      toast(<TwitterErrorToast />);
    }

    if (discordError) {
      toast(<DiscordErrorToast />);
    }
  }, [twitterError, discordError]);

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

  if (currentPane === "REGISTER_2") {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col pb-[100px] mt-8 ">
            <div className="font-[500] text-[42px] md:text-[48px] lg:text-[56px] mb-4 font-reckless italic">
              Review and Sign the Terms of Service
            </div>
            <div className="mb-8 font-[500] text-[18px] md:text-[20px] lg:text-[24px] text-[#918C89]">
              You&apos;ve confirmed that you&apos;ve read and agree with
              Plume&apos;s Airdrop{" "}
              <Link
                className="text-white whitespace-nowrap flex items-center gap-1"
                href="/terms"
                target="_blank"
              >
                Terms of Service <MoveUpRightIcon size={22} />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {signature ? (
                <button
                  disabled
                  className="px-6 py-4 rounded-full bg-[#D7FF30] text-[#1A1613] font-[600] hover:opacity-80 disabled:opacity-40"
                >
                  Signed
                </button>
              ) : (
                <button
                  className="px-6 py-4 rounded-full bg-white text-[#1A1613] font-[600] hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={isSigningMessage}
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
                  {isSigningMessage ? (
                    <div className="flex gap-2 items-center">
                      <Loader2Icon
                        size={16}
                        className="animate-spin text-[#1A1613]"
                      />
                      Signing
                    </div>
                  ) : (
                    "Sign"
                  )}
                </button>
              )}

              <button
                className="font-[600] text-lg hover:opacity-80 bg-white text-[#1A1613] rounded-full py-4 px-8 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-[#E7E7E7] disabled:text-[#1A1613]"
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
                    discordEncryptedId: discordEncryptedId || null,
                    discordEncryptedUsername: discordEncryptedUsername || null,
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
        }
        image="/images/plume-bg-2.avif"
      />
    );
  }

  if (
    (shouldShowRegisterStep && !finishedRegistration) ||
    currentPane === "REGISTER"
  ) {
    if (!mounted) {
      return null;
    }

    return (
      <PaneLayout
        content={
          <div className="flex flex-col pb-[100px] mt-8 ">
            <div className="font-[500] text-[42px] md:text-[48px] lg:text-[56px] mb-4 font-reckless italic">
              Register to Claim
            </div>
            <div className="mb-8 font-[500] text-[18px] md:text-[20px] lg:text-[24px] text-[#918C89]">
              Fill out this form and agree to the Terms of Service to be able to
              claim.
            </div>
            <ul className="flex flex-col gap-6">
              <li>
                <ConnectButton.Custom>
                  {({
                    account,
                    mounted: mountedWallet,
                    authenticationStatus,
                    openConnectModal,
                  }) => {
                    return (
                      <button
                        disabled={
                          !mountedWallet || authenticationStatus === "loading"
                        }
                        className={
                          "w-full p-4 flex items-center gap-4 justify-between shadow-md rounded-full border border-white/25 bg-white/5 hover:opacity-80"
                        }
                        onClick={async () => {
                          if (!account || !mountedWallet) {
                            openConnectModal();
                          } else {
                            disconnect();
                          }
                        }}
                      >
                        <div className="flex gap-2 w-full items-center">
                          <div className="w-[30px]">
                            {address ? (
                              <CheckIcon size={20} color="#D7FF30" />
                            ) : (
                              <Image
                                alt=""
                                src="/images/wallet-logo.png"
                                width={28}
                                height={16}
                              />
                            )}
                          </div>
                          <div className="text-lg w-full text-left">
                            {address ? (
                              <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col gap-1 text-left">
                                  <div className="text-[24px]">
                                    Wallet connected
                                  </div>
                                  <div className="text-[#D7FF30] text-[20px]">
                                    {address.slice(0, 6)}...
                                    {address.slice(-4)}
                                  </div>
                                </div>
                                <div className="bg-[#2B2826] rounded-full p-1.5">
                                  <XIcon size={16} />
                                </div>
                              </div>
                            ) : (
                              "Connect Wallet"
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  }}
                </ConnectButton.Custom>
              </li>

              <li>
                <button
                  className={
                    "w-full p-4 flex items-center gap-4 justify-between shadow-md rounded-full border border-white/25 bg-white/5 hover:opacity-80"
                  }
                  onClick={async () => {
                    if (!twitterUsername) {
                      const { url } = await getTwitterConnectUrl();

                      window.location.href = url;
                    } else {
                      await disconnectTwitter();

                      const params = new URLSearchParams();

                      if (discordEncryptedId) {
                        params.set("did", discordEncryptedId);
                      }

                      if (discordEncryptedUsername) {
                        params.set("dname", discordEncryptedUsername);
                      }

                      if (discordUsername) {
                        params.set("rdname", discordUsername);
                      }

                      window.location.href = `/?step=twitter&${params.toString()}`;
                    }
                  }}
                >
                  <div className="flex gap-2 w-full items-center">
                    <div className="w-[30px]">
                      {twitterUsername ? (
                        <CheckIcon size={20} color="#D7FF30" />
                      ) : (
                        <Image
                          alt=""
                          src="/images/x-logo.png"
                          width={28}
                          height={16}
                        />
                      )}
                    </div>
                    <div className="text-lg w-full text-left">
                      {isDisconnectingFromTwitter ? (
                        <div className="flex gap-2 items-center">
                          <Loader2Icon
                            size={16}
                            className="animate-spin text-white"
                          />
                          Disconnecting
                        </div>
                      ) : isFetchingTwitterUrl ? (
                        <div className="flex gap-2 items-center">
                          <Loader2Icon
                            size={16}
                            className="animate-spin text-white"
                          />
                          Connecting
                        </div>
                      ) : twitterUsername ? (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col gap-1 text-left">
                            <div className="text-[24px]">X connected</div>
                            <div className="text-[#D7FF30] text-[20px]">
                              {twitterUsername}
                            </div>
                          </div>
                          <div className="bg-[#2B2826] rounded-full p-1.5">
                            <XIcon size={16} />
                          </div>
                        </div>
                      ) : (
                        "Connect X"
                      )}
                    </div>
                  </div>
                </button>
              </li>

              <li>
                <button
                  className={
                    "w-full p-4 flex items-center gap-4 justify-between shadow-md rounded-full border border-white/25 bg-white/5 hover:opacity-80"
                  }
                  onClick={async () => {
                    if (!discordUsername) {
                      const { url } = await getDiscordConnectUrl();

                      window.location.href = url;
                    } else {
                      await disconnectDiscord();

                      const params = new URLSearchParams();

                      if (twitterEncryptedId) {
                        params.set("tid", twitterEncryptedId);
                      }

                      if (twitterEncryptedUsername) {
                        params.set("tname", twitterEncryptedUsername);
                      }

                      if (twitterUsername) {
                        params.set("rtname", twitterUsername);
                      }

                      window.location.href = `/?step=twitter&${params.toString()}`;
                    }
                  }}
                >
                  <div className="flex gap-2 w-full items-center">
                    <div className="w-[30px]">
                      {discordUsername ? (
                        <CheckIcon size={20} color="#D7FF30" />
                      ) : (
                        <Image
                          alt=""
                          src="/images/discord-logo.png"
                          width={28}
                          height={16}
                        />
                      )}
                    </div>
                    <div className="text-lg w-full text-left">
                      {isDisconnectingFromDiscord ? (
                        <div className="flex gap-2 items-center">
                          <Loader2Icon
                            size={16}
                            className="animate-spin text-white"
                          />
                          Disconnecting
                        </div>
                      ) : isFetchingDiscordUrl ? (
                        <div className="flex gap-2 items-center">
                          <Loader2Icon
                            size={16}
                            className="animate-spin text-white"
                          />
                          Connecting
                        </div>
                      ) : discordUsername ? (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col gap-1 text-left">
                            <div className="text-[24px]">Discord connected</div>
                            <div className="text-[#D7FF30] text-[20px]">
                              {discordUsername}
                            </div>
                          </div>
                          <div className="bg-[#2B2826] rounded-full p-1.5">
                            <XIcon size={16} />
                          </div>
                        </div>
                      ) : (
                        "Connect Discord"
                      )}
                    </div>
                  </div>
                </button>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-8">
              <button
                className="font-[600] text-lg hover:opacity-80 bg-white text-[#1A1613] rounded-full py-4 px-8 flex justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                onClick={() => {
                  setCurrentPane("REGISTER_2");
                }}
                disabled={!address}
              >
                Continue
              </button>
            </div>
          </div>
        }
        image="/images/plume-bg-2.avif"
        invertImage={!address}
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
              Thank you for registering for the Plume Airdrop. Stay tuned for
              news and updates as we approach our live release.
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
        image="/images/plume-bg-1.avif"
      />
    );
  }

  if (currentPane === "DEFAULT") {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col pb-[100px] mt-8 ">
            <div className="font-[500] text-[42px] md:text-[48px] lg:text-[56px] mb-4 font-reckless italic">
              Register for the Plume airdrop
            </div>
            <div className="mb-8 font-[500] text-[18px] md:text-[20px] lg:text-[24px] text-[#918C89]">
              Plume&apos;s first official Airdrop rewards early contributors
              who&apos;ve been a part of the journey thus far.
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
                    <div className="flex items-center gap-4">
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
                            {account.address.slice(0, 6)}...
                            {account.address?.slice(-4)}
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
        image="/images/plume-bg-1.avif"
      />
    );
  }

  if (currentPane === "ABOUT") {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col pb-[100px] mt-8 ">
            <div className="font-[500] text-[42px] md:text-[48px] lg:text-[56px] mb-4 font-reckless italic">
              The L1 for RWAs
            </div>
            <div className="mb-8 font-[500] text-[18px] md:text-[20px] lg:text-[24px] text-[#918C89]">
              Plume is the first Layer 1 blockchain designed exclusively to
              unlock the full potential of real-world assets (RWAs) by making
              them:
            </div>
            <ul className="flex flex-col gap-6 mb-8">
              {[
                {
                  image: "/images/plume-about-icon-1.png",
                  title: "Composable",
                },
                {
                  title: "Liquid",
                  image: "/images/plume-about-icon-2.png",
                },
                {
                  image: "/images/plume-about-icon-3.png",
                  title:
                    "Accessible within an ecosystem that is secure and compliant",
                },
              ].map(({ image, title }, idx) => {
                return (
                  <li className="flex gap-3 items-center" key={idx}>
                    <Image
                      alt=""
                      src={image}
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                    <div className="text-[24px]">{title}</div>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-4">
              <Link
                target="_blank"
                href="https://plumenetwork.xyz/blog/plume-drop-faq"
                className="font-[500] text-lg hover:opacity-80 bg-white/20 text-white rounded-full px-6 py-4"
              >
                About Plume
              </Link>

              <button
                className="font-[600] text-lg hover:opacity-80 bg-white text-[#1A1613] rounded-full py-4 px-8 flex justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => {
                  setCurrentPane("MEET");
                }}
              >
                Continue
              </button>
            </div>
          </div>
        }
        image="/images/plume-bg-1.avif"
      />
    );
  }

  if (currentPane === "MEET") {
    return (
      <PaneLayout
        content={
          <div className="flex flex-col pb-[100px] mt-8 ">
            <div className="font-[500] text-[42px] md:text-[48px] lg:text-[56px] mb-4 font-reckless italic">
              The Plume Token
            </div>
            <div className="mb-8 font-[500] text-[18px] md:text-[20px] lg:text-[24px] text-[#918C89]">
              Plume is designed to secure and power the Plume RWA Chain and
              broader RWAfi ecosystem. The Plume Airdrop is the first official
              drop of <span className="italic text-white">$PLUME</span>.
            </div>
            <div className="flex items-center gap-4">
              <Link
                target="_blank"
                href="https://plumenetwork.xyz/blog/plume-drop-faq"
                className="font-[500] text-lg hover:opacity-80 bg-white/20 text-white rounded-full px-6 py-4"
              >
                Read Announcement
              </Link>

              <button
                className="font-[600] text-lg hover:opacity-80 bg-white text-[#1A1613] rounded-full py-4 px-8 flex justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => {
                  setCurrentPane("REGISTER");
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

  return <div />;
}
