import type { Metadata } from "next";
import DefaultBanner from "../public/images/banner.avif";
import localFont from "next/font/local";
import "./globals.css";
import { AppProviders } from "./components/AppProviders";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";

const matter = localFont({
  src: [
    {
      path: "./fonts/MatterRegular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/MatterMedium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/MatterSemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/MatterBold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/MatterHeavy.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/MatterBlack.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-matter",
});

const reckless = localFont({
  src: [
    {
      path: "./fonts/Reckless-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Reckless-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Reckless-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Reckless-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Reckless-Heavy.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-reckless",
});

export const metadata: Metadata = {
  title: "Plume Airdrop Pre Registration",
  description: "Please register for the Plume Airdrop",
  openGraph: {
    images: [{ url: DefaultBanner.src }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${matter.variable} ${reckless.variable} antialiased bg-[#1A1613] text-white`}
      >
        <div className="font-matter">
          <AppProviders>
            <Suspense>
              {children}
              <ToastContainer
                position="bottom-right"
                hideProgressBar
                toastClassName="custom-toast"
                closeButton={false}
              />
            </Suspense>
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
