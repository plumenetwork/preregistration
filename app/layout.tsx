import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Plume Terms of Service",
  description: "Plume Terms of Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${reckless.variable} antialiased bg-[#1A1613] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
