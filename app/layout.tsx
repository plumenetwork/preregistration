import type { Metadata } from "next";
import DefaultBanner from "../public/images/default.avif";
import localFont from "next/font/local";
import "./globals.css";
import { AppProviders } from "./components/AppProviders";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";

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
      <body className={`${lufga.className} antialiased`}>
        <div className="">
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
