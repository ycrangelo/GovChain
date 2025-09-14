import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Govchain",
  description: "GovChain is a decentralized Web3 platform designed to bring full transparency to government projects. By leveraging blockchain technology, GovChain ensures that public initiatives—ranging from infrastructure development to community programs—are fully verifiable, auditable, and tamper-proof.",
  icons: {
    icon: "/logo.png",
  },
};


const ibmPlex = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background antialiased",
          fontSans.variable,
          ibmPlex.className, // 👈 pixel font
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
