import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Providers } from "@/src/components/Provider";

const sourceSansPro = Source_Sans_3({
  variable: "--font-source-sans-pro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodWagen Site",
  description: "FoodWagen Business Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={`${sourceSansPro.variable} antialiased`}>
          <main>{children}</main>
        </body>
      </html>
    </Providers>
  );
}
