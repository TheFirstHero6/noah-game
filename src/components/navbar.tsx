"use client";

import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import logo from "./logo.png";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserRole();
    }
  }, [isLoaded, user]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch("/api/dashboard/user-data");
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest("nav")) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  return (
    <nav
      className="sticky top-0 z-50 bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-xl border-b border-medieval-gold-600 shadow-2xl"
      style={{ borderColor: "rgba(234, 179, 8, 0.3)" }}
    >
      <div className="flex items-center justify-between mx-auto max-w-7xl h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <Link
          href="/"
          className="group flex items-center space-x-3 md:space-x-4 animate-fade-in"
        >
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-medieval-gold-400/20 via-medieval-gold-600/30 to-medieval-gold-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse-glow"></div>
            <Image
              src={logo}
              alt="War of the Elector"
              className="relative h-14 w-14 md:h-16 md:w-16 rounded-full object-cover border-2 border-medieval-gold-600 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:border-medieval-gold-500"
              style={{ borderColor: "rgba(234, 179, 8, 0.6)" }}
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-medieval-gold-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-medieval text-lg md:text-xl lg:text-2xl text-medieval-gold-300 tracking-wider group-hover:text-medieval-gold-200 transition-all duration-300 animate-text-glow">
              War of the Elector
            </h1>
            <p className="font-script text-xs md:text-sm text-medieval-steel-300 italic group-hover:text-medieval-steel-200 transition-colors duration-300">
              Forge Your Destiny
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-2">
          <Link href="/pages/dashboard" className="group relative">
            <div className="relative px-5 py-3 rounded-xl border border-medieval-gold-600 bg-medieval-steel-800/50 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg">
              <span className="font-medieval text-sm text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300 flex items-center space-x-2">
                <span className="text-lg group-hover:animate-bounce-gentle">
                  🏰
                </span>
                <span>Dashboard</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 via-medieval-gold-500/20 to-medieval-gold-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-medieval-gold-600/20 to-medieval-gold-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </Link>

          <Link href="/pages/rules" className="group relative">
            <div className="relative px-5 py-3 rounded-xl border border-medieval-gold-600 bg-medieval-steel-800/50 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg">
              <span className="font-medieval text-sm text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300 flex items-center space-x-2">
                <span className="text-lg group-hover:animate-bounce-gentle">
                  📜
                </span>
                <span>Rules</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 via-medieval-gold-500/20 to-medieval-gold-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-medieval-gold-600/20 to-medieval-gold-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </Link>

          <Link href="/pages/cities" className="group relative">
            <div className="relative px-5 py-3 rounded-xl border border-medieval-gold-600 bg-medieval-steel-800/50 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg">
              <span className="font-medieval text-sm text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300 flex items-center space-x-2">
                <span className="text-lg group-hover:animate-bounce-gentle">
                  🏘️
                </span>
                <span>Cities</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 via-medieval-gold-500/20 to-medieval-gold-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-medieval-gold-600/20 to-medieval-gold-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </Link>

          <Link href="/pages/settings" className="group relative">
            <div className="relative px-5 py-3 rounded-xl border border-medieval-gold-600 bg-medieval-steel-800/50 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg">
              <span className="font-medieval text-sm text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300 flex items-center space-x-2">
                <span className="text-lg group-hover:animate-bounce-gentle">
                  ⚙️
                </span>
                <span>Settings</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 via-medieval-gold-500/20 to-medieval-gold-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-medieval-gold-600/20 to-medieval-gold-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </Link>

          {userRole === "ADMIN" && (
            <Link href="/pages/admin" className="group relative">
              <div className="relative px-5 py-3 rounded-xl border border-medieval-gold-600 bg-gradient-to-r from-medieval-gold-600/20 to-medieval-gold-500/20 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg">
                <span className="font-medieval text-sm text-medieval-gold-200 group-hover:text-medieval-gold-100 transition-colors duration-300 flex items-center space-x-2">
                  <span className="text-lg group-hover:animate-bounce-gentle">
                    👑
                  </span>
                  <span>Admin</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/20 via-medieval-gold-500/30 to-medieval-gold-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-medieval-gold-600/30 to-medieval-gold-500/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </Link>
          )}

          <Link href="/" className="group relative">
            <div className="relative px-5 py-3 rounded-xl border border-medieval-gold-600 bg-medieval-steel-800/50 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg">
              <span className="font-medieval text-sm text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300 flex items-center space-x-2">
                <span className="text-lg group-hover:animate-bounce-gentle">
                  🏠
                </span>
                <span>Home</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 via-medieval-gold-500/20 to-medieval-gold-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-medieval-gold-600/20 to-medieval-gold-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </Link>
        </div>

        {/* Auth Section - Hidden on mobile, shown in mobile menu */}
        <div className="hidden lg:flex items-center space-x-3">
          <SignedOut>
            <div className="relative group">
              <SignInButton>
                <button className="relative px-6 py-3 rounded-xl border border-medieval-gold-600 bg-gradient-to-r from-medieval-gold-600/20 to-medieval-gold-500/20 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg overflow-hidden">
                  <span className="font-medieval text-sm text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300 flex items-center space-x-2">
                    <span className="text-lg group-hover:animate-bounce-gentle">
                      🔐
                    </span>
                    <span>Enter the Realm</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/20 via-medieval-gold-500/30 to-medieval-gold-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-medieval-gold-600/30 to-medieval-gold-500/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right animate-slide-left">
                <p className="font-medieval text-xs text-medieval-steel-400">
                  Welcome back,
                </p>
                <p className="font-script text-sm text-medieval-gold-300">
                  Noble Lord
                </p>
              </div>
              <div className="relative group">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox:
                        "border-2 border-medieval-gold-600 hover:border-medieval-gold-400 hover:scale-110 transition-all duration-500 shadow-lg rounded-full",
                      userButtonPopoverCard:
                        "bg-medieval-steel-800/95 backdrop-blur-md border border-medieval-gold-600 rounded-2xl shadow-2xl",
                      userButtonPopoverActionButton:
                        "text-medieval-gold-300 hover:bg-medieval-gold-600/20 rounded-xl transition-all duration-300",
                      userButtonPopoverFooter:
                        "border-t border-medieval-gold-600",
                    },
                  }}
                  showName
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-medieval-gold-600/20 to-medieval-gold-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden absolute top-5 right-4">
        <button
          onClick={toggleMobileMenu}
          className="relative p-3 rounded-xl border border-medieval-gold-600 bg-medieval-steel-800/50 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg group"
        >
          <span className="text-xl text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300">
            {isMobileMenuOpen ? "✕" : "☰"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 via-medieval-gold-500/20 to-medieval-gold-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-background/98 via-background/95 to-background/98 backdrop-blur-xl border-b border-medieval-gold-600 shadow-2xl animate-slide-down">
          <div className="px-6 py-6 space-y-3">
            <Link
              href="/pages/dashboard"
              onClick={closeMobileMenu}
              className="block group"
            >
              <div className="relative px-5 py-4 rounded-xl border border-medieval-gold-600 bg-medieval-steel-800/50 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg">
                <span className="font-medieval text-lg text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300 flex items-center space-x-3">
                  <span className="text-xl group-hover:animate-bounce-gentle">
                    🏰
                  </span>
                  <span>Dashboard</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 via-medieval-gold-500/20 to-medieval-gold-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </Link>

            <Link
              href="/pages/rules"
              onClick={closeMobileMenu}
              className="block group"
            >
              <div className="relative px-5 py-4 rounded-xl border border-medieval-gold-600 bg-medieval-steel-800/50 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg">
                <span className="font-medieval text-lg text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300 flex items-center space-x-3">
                  <span className="text-xl group-hover:animate-bounce-gentle">
                    📜
                  </span>
                  <span>Rules</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 via-medieval-gold-500/20 to-medieval-gold-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </Link>

            <Link
              href="/pages/cities"
              onClick={closeMobileMenu}
              className="block group"
            >
              <div className="relative px-5 py-4 rounded-xl border border-medieval-gold-600 bg-medieval-steel-800/50 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg">
                <span className="font-medieval text-lg text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300 flex items-center space-x-3">
                  <span className="text-xl group-hover:animate-bounce-gentle">
                    🏘️
                  </span>
                  <span>Cities</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 via-medieval-gold-500/20 to-medieval-gold-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </Link>

            <Link
              href="/pages/settings"
              onClick={closeMobileMenu}
              className="block group"
            >
              <div className="relative px-5 py-4 rounded-xl border border-medieval-gold-600 bg-medieval-steel-800/50 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg">
                <span className="font-medieval text-lg text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300 flex items-center space-x-3">
                  <span className="text-xl group-hover:animate-bounce-gentle">
                    ⚙️
                  </span>
                  <span>Settings</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 via-medieval-gold-500/20 to-medieval-gold-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </Link>

            {userRole === "ADMIN" && (
              <Link
                href="/pages/admin"
                onClick={closeMobileMenu}
                className="block group"
              >
                <div className="relative px-5 py-4 rounded-xl border border-medieval-gold-600 bg-gradient-to-r from-medieval-gold-600/20 to-medieval-gold-500/20 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg">
                  <span className="font-medieval text-lg text-medieval-gold-200 group-hover:text-medieval-gold-100 transition-colors duration-300 flex items-center space-x-3">
                    <span className="text-xl group-hover:animate-bounce-gentle">
                      👑
                    </span>
                    <span>Admin</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/20 via-medieval-gold-500/30 to-medieval-gold-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </Link>
            )}

            <Link href="/" onClick={closeMobileMenu} className="block group">
              <div className="relative px-5 py-4 rounded-xl border border-medieval-gold-600 bg-medieval-steel-800/50 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg">
                <span className="font-medieval text-lg text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300 flex items-center space-x-3">
                  <span className="text-xl group-hover:animate-bounce-gentle">
                    🏠
                  </span>
                  <span>Home</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 via-medieval-gold-500/20 to-medieval-gold-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </Link>

            {/* Mobile Auth Section */}
            <div className="pt-6 border-t border-medieval-gold-600">
              <SignedOut>
                <div className="w-full">
                  <SignInButton>
                    <button className="relative w-full px-6 py-4 rounded-xl border border-medieval-gold-600 bg-gradient-to-r from-medieval-gold-600/20 to-medieval-gold-500/20 backdrop-blur-sm hover:border-medieval-gold-500 transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg group overflow-hidden">
                      <span className="font-medieval text-lg text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300 flex items-center justify-center space-x-3">
                        <span className="text-xl group-hover:animate-bounce-gentle">
                          🔐
                        </span>
                        <span>Enter the Realm</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/20 via-medieval-gold-500/30 to-medieval-gold-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-between p-4 rounded-xl border border-medieval-gold-600 bg-medieval-steel-800/50 backdrop-blur-sm">
                  <div className="text-left">
                    <p className="font-medieval text-sm text-medieval-steel-400">
                      Welcome back,
                    </p>
                    <p className="font-script text-lg text-medieval-gold-300">
                      Noble Lord
                    </p>
                  </div>
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox:
                          "border-2 border-medieval-gold-600 hover:border-medieval-gold-400 hover:scale-110 transition-all duration-500 shadow-lg rounded-full",
                        userButtonPopoverCard:
                          "bg-medieval-steel-800/95 backdrop-blur-md border border-medieval-gold-600 rounded-2xl shadow-2xl",
                        userButtonPopoverActionButton:
                          "text-medieval-gold-300 hover:bg-medieval-gold-600/20 rounded-xl transition-all duration-300",
                        userButtonPopoverFooter:
                          "border-t border-medieval-gold-600",
                      },
                    }}
                    showName
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
