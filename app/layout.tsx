import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Aysel Agency | نصنع لك حضوراً رقمياً لا يُنسى",
  description:
    "ثلاث شركات متخصصة تحت سقف واحد: استراتيجية، إبداع، وتقنية. نحوّل رؤيتك إلى واقع رقمي يتفوق على المنافسة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-[Cairo,sans-serif] antialiased`}>
        {children}
      </body>
    </html>
  );
}
