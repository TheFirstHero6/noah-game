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
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-background via-background to-background border-b-4 border-primary shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-24 px-6">
        {/* Logo Section */}
        <Link
          href="/"
          className="group flex items-center space-x-2 md:space-x-4"
        >
          <div className="relative">
            <Image
              src={logo}
              alt="War of the Elector"
              className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover border-4 border-medieval-gold-600 shadow-glow-gold transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-medieval-gold-400 to-medieval-gold-600 rounded-full opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-medieval text-lg md:text-2xl text-medieval-gold-300 tracking-wider group-hover:text-medieval-gold-200 transition-colors duration-300">
              War of the Elector
            </h1>
            <p className="font-script text-xs md:text-sm text-foreground italic">
              Forge Your Destiny
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link href="/pages/dashboard" className="group">
            <div className="relative px-4 py-2 rounded-lg border-2 border-transparent hover:border-medieval-gold-500 transition-all duration-300">
              <span className="font-medieval text-base text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300">
                🏰 Dashboard
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 to-medieval-gold-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>

          <Link href="/pages/rules" className="group">
            <div className="relative px-4 py-2 rounded-lg border-2 border-transparent hover:border-medieval-gold-500 transition-all duration-300">
              <span className="font-medieval text-base text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300">
                📜 Rules
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 to-medieval-gold-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>

          <Link href="/pages/cities" className="group">
            <div className="relative px-4 py-2 rounded-lg border-2 border-transparent hover:border-medieval-gold-500 transition-all duration-300">
              <span className="font-medieval text-base text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300">
                🏘️ Cities
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 to-medieval-gold-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>

          <Link href="/pages/settings" className="group">
            <div className="relative px-4 py-2 rounded-lg border-2 border-transparent hover:border-medieval-gold-500 transition-all duration-300">
              <span className="font-medieval text-base text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300">
                ⚙️ Settings
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 to-medieval-gold-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>

          {userRole === "ADMIN" && (
            <Link href="/pages/admin" className="group">
              <div className="relative px-4 py-2 rounded-lg border-2 border-transparent hover:border-medieval-gold-500 transition-all duration-300">
                <span className="font-medieval text-base text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300">
                  👑 Admin
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 to-medieval-gold-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          )}

          <Link href="/" className="group">
            <div className="relative px-4 py-2 rounded-lg border-2 border-transparent hover:border-medieval-gold-500 transition-all duration-300">
              <span className="font-medieval text-base text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300">
                🏠 Home
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-medieval-gold-600/10 to-medieval-gold-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>
        </div>

        {/* Auth Section - Hidden on mobile, shown in mobile menu */}
        <div className="hidden lg:flex items-center space-x-4">
          <SignedOut>
            <div className="relative">
              <SignInButton>
                <button className="medieval-button group">
                  <span className="flex items-center space-x-2">
                    <span>🔐</span>
                    <span>Enter the Realm</span>
                  </span>
                </button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="font-medieval text-sm text-medieval-gold-300">
                  Welcome back,
                </p>
                <p className="font-script text-lg text-medieval-gold-200">
                  Noble Lord
                </p>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox:
                      "border-4 border-medieval-gold-600 hover:border-medieval-gold-400 hover:scale-110 transition-all duration-300 shadow-glow-gold",
                    userButtonPopoverCard:
                      "bg-medieval-steel-800 border-2 border-medieval-gold-600",
                    userButtonPopoverActionButton:
                      "text-medieval-gold-300 hover:bg-medieval-gold-600/20",
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

      {/* Mobile Menu Button */}
      <div className="lg:hidden absolute top-6 right-6">
        <button
          onClick={toggleMobileMenu}
          className="medieval-button-secondary p-3"
        >
          <span className="text-xl">{isMobileMenuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-background to-background border-b-4 border-primary shadow-2xl backdrop-blur-sm">
          <div className="px-6 py-4 space-y-4">
            <Link
              href="/pages/dashboard"
              onClick={closeMobileMenu}
              className="block"
            >
              <div className="relative px-4 py-3 rounded-lg border-2 border-transparent hover:border-medieval-gold-500 transition-all duration-300">
                <span className="font-medieval text-lg text-medieval-gold-300">
                  🏰 Dashboard
                </span>
              </div>
            </Link>

            <Link
              href="/pages/rules"
              onClick={closeMobileMenu}
              className="block"
            >
              <div className="relative px-4 py-3 rounded-lg border-2 border-transparent hover:border-medieval-gold-500 transition-all duration-300">
                <span className="font-medieval text-lg text-medieval-gold-300">
                  📜 Rules
                </span>
              </div>
            </Link>

            <Link
              href="/pages/cities"
              onClick={closeMobileMenu}
              className="block"
            >
              <div className="relative px-4 py-3 rounded-lg border-2 border-transparent hover:border-medieval-gold-500 transition-all duration-300">
                <span className="font-medieval text-lg text-medieval-gold-300">
                  🏘️ Cities
                </span>
              </div>
            </Link>

            <Link
              href="/pages/settings"
              onClick={closeMobileMenu}
              className="block"
            >
              <div className="relative px-4 py-3 rounded-lg border-2 border-transparent hover:border-medieval-gold-500 transition-all duration-300">
                <span className="font-medieval text-lg text-medieval-gold-300">
                  ⚙️ Settings
                </span>
              </div>
            </Link>

            {userRole === "ADMIN" && (
              <Link
                href="/pages/admin"
                onClick={closeMobileMenu}
                className="block"
              >
                <div className="relative px-4 py-3 rounded-lg border-2 border-transparent hover:border-medieval-gold-500 transition-all duration-300">
                  <span className="font-medieval text-lg text-medieval-gold-300">
                    👑 Admin
                  </span>
                </div>
              </Link>
            )}

            <Link href="/" onClick={closeMobileMenu} className="block">
              <div className="relative px-4 py-3 rounded-lg border-2 border-transparent hover:border-medieval-gold-500 transition-all duration-300">
                <span className="font-medieval text-lg text-medieval-gold-300">
                  🏠 Home
                </span>
              </div>
            </Link>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-medieval-gold-600">
              <SignedOut>
                <div className="w-full">
                  <SignInButton>
                    <button className="medieval-button w-full group">
                      <span className="flex items-center justify-center space-x-2">
                        <span>🔐</span>
                        <span>Enter the Realm</span>
                      </span>
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="font-medieval text-sm text-medieval-gold-300">
                      Welcome back,
                    </p>
                    <p className="font-script text-lg text-medieval-gold-200">
                      Noble Lord
                    </p>
                  </div>
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox:
                          "border-4 border-medieval-gold-600 hover:border-medieval-gold-400 hover:scale-110 transition-all duration-300 shadow-glow-gold",
                        userButtonPopoverCard:
                          "bg-medieval-steel-800 border-2 border-medieval-gold-600",
                        userButtonPopoverActionButton:
                          "text-medieval-gold-300 hover:bg-medieval-gold-600/20",
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
