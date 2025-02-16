import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { dark } from "@clerk/themes";
import Navbar from "@/components/navbar";
import GameInfo from "@/components/game-info";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
