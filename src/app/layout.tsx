import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { FinanceProvider } from "@/context/FinanceContext";
import { cn } from "@/lib/utils";


const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
})



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
      className={cn("h-full", "antialiased", sora.variable)}
    >
      <body className="min-h-full flex flex-col">
        <FinanceProvider>
          {children}
        </FinanceProvider>
      </body>
    </html>
  );
}
