import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { dark } from "@clerk/themes";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import GameInfo from "@/components/game-info";
import SplashScreen from "@/components/splash-screen";
import { ThemeProvider } from "@/contexts/ThemeContext";
import RealmProviderWrapper from "@/components/RealmProviderWrapper";
import Chatbot from "@/components/Chatbot";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#d4af37" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="War of the Elector" />
        <link rel="apple-touch-icon" href="/favicon-196.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body suppressHydrationWarning>
        <Script
          src="https://cdn.jotfor.ms/agent/embedjs/019a267959c1778582f0a76622404cfdbfe3/embed.js"
          strategy="afterInteractive"
        />
        <ThemeProvider>
          <ClerkProvider appearance={{ baseTheme: dark }}>
            <RealmProviderWrapper>
              <SplashScreen>
                <ConditionalNavbar />
                <div className="pt-20">
                  {children}
                  <Chatbot />
                </div>
              </SplashScreen>
            </RealmProviderWrapper>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
