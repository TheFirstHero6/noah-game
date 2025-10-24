"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "./logo.png";

interface SplashScreenProps {
  children: React.ReactNode;
}

export default function SplashScreen({ children }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if splash screen has already been shown in this session
    const hasShownSplash = sessionStorage.getItem("splashShown");

    if (hasShownSplash) {
      setIsLoading(false);
      setHasShown(true);
      return;
    }

    // Show splash screen for 2 seconds on first load only
    const timer = setTimeout(() => {
      setIsLoading(false);
      setHasShown(true);
      sessionStorage.setItem("splashShown", "true");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Don't show splash screen if it's already been shown or if loading is complete
  if (!isLoading || hasShown) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-background">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-medieval-pattern opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-medieval-gold-900/10 via-medieval-steel-800/10 to-medieval-gold-900/10 animate-pulse"></div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Logo with proper positioning */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute -inset-8 border-2 border-transparent border-t-medieval-gold-400 border-r-medieval-gold-600 rounded-full animate-spin"></div>

          {/* Inner rotating ring */}
          <div
            className="absolute -inset-4 border-2 border-transparent border-b-medieval-gold-500 border-l-medieval-gold-700 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>

          {/* Logo container with proper centering */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center">
            <Image
              src={logo}
              alt="War of the Elector"
              className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-medieval-gold-600 shadow-glow-gold"
              priority
            />
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-400/20 to-medieval-gold-600/20 rounded-full blur-sm"></div>
          </div>
        </div>

        {/* Game title with better spacing */}
        <div className="text-center space-y-3">
          <h1 className="font-medieval text-2xl md:text-3xl lg:text-4xl text-medieval-gold-300 tracking-wider">
            War of the Elector
          </h1>
          <p className="font-script text-base md:text-lg text-medieval-gold-200 italic">
            Forge Your Destiny
          </p>
        </div>

        {/* Elegant loading indicator */}
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-medieval-gold-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-medieval-gold-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-medieval-gold-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        {/* Subtle decorative elements */}
        <div className="absolute top-16 left-16 text-medieval-gold-600/30 text-xl animate-pulse">
          ⚔️
        </div>
        <div className="absolute top-20 right-20 text-medieval-gold-600/30 text-lg animate-pulse">
          🏰
        </div>
        <div className="absolute bottom-16 left-20 text-medieval-gold-600/30 text-lg animate-pulse">
          👑
        </div>
        <div className="absolute bottom-20 right-16 text-medieval-gold-600/30 text-xl animate-pulse">
          ⚡
        </div>
      </div>
    </div>
  );
}
