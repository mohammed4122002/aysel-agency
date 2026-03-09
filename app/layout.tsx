import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import SiteMotion from "@/components/SiteMotion";
import "./globals.css";

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "700", "800"],
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
      <body className={`${almarai.variable} font-sans antialiased`}>
        <SiteMotion>{children}</SiteMotion>
      </body>
    </html>
  );
}
