import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { dark } from "@clerk/themes";
import Navbar from "@/components/navbar";
import GameInfo from "@/components/game-info";
import { ThemeProvider } from "@/contexts/ThemeContext";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ClerkProvider appearance={{ baseTheme: dark }}>
            <Navbar />
            {children}
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
