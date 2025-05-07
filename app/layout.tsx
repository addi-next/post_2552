import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "个人博文站 - 分享生活与技术",
  description:
    "一个专注于分享生活经验、技术见解和个人成长的博客平台。探索最新的技术趋势和实用生活技巧。",
  keywords: ["博客", "技术", "生活", "分享", "个人成长"],
  authors: [{ name: "网站作者" }],
  creator: "网站创建者",
  publisher: "个人博文站",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: defaultUrl,
    title: "个人博文站 - 分享生活与技术",
    description:
      "一个专注于分享生活经验、技术见解和个人成长的博客平台。探索最新的技术趋势和实用生活技巧。",
    siteName: "个人博文站",
    images: [
      {
        url: `${defaultUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "个人博文站预览图",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "个人博文站 - 分享生活与技术",
    description: "一个专注于分享生活经验、技术见解和个人成长的博客平台",
    images: [`${defaultUrl}/twitter-image.png`],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground bg-[url('/bg.jpg')] bg-cover bg-center bg-fixed hide-scrollbar">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full flex justify-between items-center px-10 sm:px-20 md:px-36  text-sm">
              <Button asChild size="sm">
                <Link href="/">个人博文站</Link>
              </Button>
              {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
            </div>
          </nav>
          {children}
          <Toaster />
          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>
              Powered by{" "}
              <a
                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                Supabase
              </a>
            </p>
            <ThemeSwitcher />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
