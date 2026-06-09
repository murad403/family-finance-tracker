import type { Metadata } from "next";
import { Roboto, Roboto_Mono, Geist } from "next/font/google";
import "./globals.css";
import { FinanceProvider } from "@/context/FinanceContext";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Family Finance Tracker",
  description: "A private, premium finance tracking system for managing family members, monthly incomes, and daily expenses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", roboto.variable, robotoMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <FinanceProvider>
          {children}
        </FinanceProvider>
      </body>
    </html>
  );
}
