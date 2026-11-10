import type { Metadata } from "next";
import { Unbounded, Onest, Martian_Mono } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "reiimiru | Yayıncı",
  description: "reiimiru, Kick yayıncısı. Yayınlar, projeler ve mini oyunlar.",
};

// Tema, sayfa çizilmeden önce uygulanır: yanıp sönme olmaz.
const themeInit = `try{var t=localStorage.getItem("reiimiru-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      data-theme="light"
      suppressHydrationWarning
      className={`${unbounded.variable} ${onest.variable} ${martian.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
