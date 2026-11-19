import type { Metadata } from "next";
import { Black_Han_Sans, Do_Hyeon } from "next/font/google";
import "./globals.css";
import { SITE } from "@/site.config";

const heavy = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-heavy",
});

const pop = Do_Hyeon({
  weight: "400",
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-pop",
});

export const metadata: Metadata = {
  title: `${SITE.name} | 찐으로 보내드립니다 · 화환·꽃 전국 당일배송`,
  description: `축하화환·근조화환·꽃다발·꽃바구니·관엽화분·동서양란, ${SITE.name}이 찐한 마음 그대로 전국 당일 전해드립니다. 전화 주문 ${SITE.phone}`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`h-full antialiased ${heavy.variable} ${pop.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
