import "./globals.css";
import type { Metadata } from "next";
import { Inter, Permanent_Marker } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const graffiti = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-graffiti",
});

export const metadata: Metadata = {
  title: "WRKsbyM.A.",
  description: "Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${graffiti.variable}`}>{children}</body>
    </html>
  );
}
