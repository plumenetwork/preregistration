import type { Metadata } from "next";
import DefaultBanner from "../public/images/default.avif";
import localFont from "next/font/local";
import "./globals.css";
import { TopNav } from "./components/TopNav";
import { AppProviders } from "./components/AppProviders";
import { ToastContainer } from "react-toastify";

const lufga = localFont({
  src: [
    {
      path: "./fonts/Lufga-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Lufga-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Lufga-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Lufga-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Lufga-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/Lufga-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

// TODO: Update title/description
export const metadata: Metadata = {
  title: "Plume Mainnet",
  description:
    "Plume Mainnet: Dive into the Plume ecosystem! Earn Plume Feathers by completing daily tasks, engage with the community, and mint exclusive NFTs. Join the adventure today!",
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
      <body className={`${lufga.className} antialiased`}>
        <div className="px-10 pb-[300px]">
          <AppProviders>
            <div className="max-w-[1200px] mx-auto w-full mt-8">
              <TopNav />
            </div>
            {children}
            <ToastContainer
              position="bottom-right"
              hideProgressBar
              toastClassName="custom-toast"
              closeButton={false}
            />
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
