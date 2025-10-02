import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "СРО Арбитражных Управляющих",
  description: "Официальный сайт саморегулируемой организации арбитражных управляющих. Реестр членов, нормативные документы, компенсационный фонд.",
  keywords: "СРО, арбитражные управляющие, банкротство, реестр, компенсационный фонд",
  authors: [{ name: "СРО Арбитражных Управляющих" }],
  openGraph: {
    title: "СРО Арбитражных Управляющих",
    description: "Официальный сайт саморегулируемой организации арбитражных управляющих",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
