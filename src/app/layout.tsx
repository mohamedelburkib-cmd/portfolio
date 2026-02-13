import type { Metadata } from "next";
import { Bebas_Neue, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ReactiveBackground from "@/components/ReactiveBackground";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mohamed El-Burki | Data Analyst",
  description: "Data Analyst Portfolio - Transforming raw data into strategic decisions. SQL, Power BI, Tableau.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${plusJakartaSans.variable}`}>
      <body className="antialiased">
        <ReactiveBackground />
        {children}
      </body>
    </html>
  );
}
