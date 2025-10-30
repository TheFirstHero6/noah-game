"use client";

import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedButton } from "./AnimatedButton";
import { cn } from "@/lib/design-system";

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
  const navItems = [
    { href: "/pages/dashboard", label: "Dashboard", icon: "🏰" },
    { href: "/pages/rules", label: "Rules", icon: "📜" },
    { href: "/pages/cities", label: "Cities", icon: "🏘️" },
    { href: "/pages/armies", label: "Armies", icon: "⚔️" },
    { href: "/pages/settings", label: "Settings", icon: "⚙️" },
    { href: "/", label: "Home", icon: "🏠" },
  ];

  if (userRole === "ADMIN") {
    navItems.splice(-1, 0, {
      href: "/pages/admin",
      label: "Admin",
      icon: "👑",
    });
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-gradient-to-r from-steel-900/95 via-steel-800/90 to-steel-900/95 backdrop-blur-xl border-b border-gold-600/30 shadow-2xl"
    >
      <div className="flex items-center justify-between mx-auto max-w-7xl h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/"
            className="group flex items-center space-x-2 md:space-x-3"
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-gold-400/20 via-gold-600/30 to-gold-400/20 rounded-full blur-md"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.img
                src="/logo.png"
                alt="War of the Elector"
                className="relative h-12 w-12 md:h-14 md:w-14 rounded-full object-cover border-2 border-gold-600 shadow-lg"
                whileHover={{ rotate: 6, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = "flex";
                  }
                }}
              />
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden items-center justify-center text-2xl"
                style={{ display: "none" }}
              >
                ⚔️
              </div>
            </div>
            <div className="hidden sm:block">
              <motion.h1
                className="font-medieval text-sm md:text-lg lg:text-xl text-gold-300 tracking-wider group-hover:text-gold-200 transition-all duration-300"
                whileHover={{ textShadow: "0 0 20px rgba(245, 158, 11, 0.5)" }}
              >
                War of the Elector
              </motion.h1>
              <p className="font-script text-xs text-steel-300 italic group-hover:text-steel-200 transition-colors duration-300">
                Forge Your Destiny
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link href={item.href} className="group relative">
                <motion.div
                  className={cn(
                    "relative px-4 py-2.5 rounded-xl border backdrop-blur-sm transition-all duration-300",
                    item.label === "Admin"
                      ? "border-gold-600 bg-gradient-to-r from-gold-600/20 to-gold-500/20"
                      : "border-gold-600/50 bg-steel-800/50 hover:border-gold-500"
                  )}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span
                    className={cn(
                      "font-medieval text-sm flex items-center space-x-2 transition-colors duration-300",
                      item.label === "Admin"
                        ? "text-gold-200 group-hover:text-gold-100"
                        : "text-gold-300 group-hover:text-gold-200"
                    )}
                  >
                    <motion.span
                      className="text-sm"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.icon}
                    </motion.span>
                    <span>{item.label}</span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gold-600/10 via-gold-500/20 to-gold-600/10 rounded-xl"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Auth Section */}
        <motion.div
          className="hidden lg:flex items-center space-x-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <SignedOut>
            <SignInButton>
              <AnimatedButton variant="primary" size="md" className="px-6 py-3">
                <span className="flex items-center space-x-2">
                  <span>🔐</span>
                  <span>Enter the Realm</span>
                </span>
              </AnimatedButton>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center space-x-4">
              <motion.div
                className="hidden md:block text-right"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <p className="font-medieval text-xs text-steel-400">
                  Welcome back,
                </p>
                <p className="font-script text-sm text-gold-300">Noble Lord</p>
              </motion.div>
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox:
                        "border-2 border-gold-600 hover:border-gold-400 transition-all duration-300 shadow-lg rounded-full",
                      userButtonPopoverCard:
                        "bg-steel-800/95 backdrop-blur-md border border-gold-600 rounded-2xl shadow-2xl",
                      userButtonPopoverActionButton:
                        "text-gold-300 hover:bg-gold-600/20 rounded-xl transition-all duration-300",
                      userButtonPopoverFooter: "border-t border-gold-600",
                    },
                  }}
                  showName
                />
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-gold-600/20 to-gold-500/20 rounded-full blur-md"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>
          </SignedIn>
        </motion.div>
      </div>

      {/* Mobile Menu Button */}
      <motion.div
        className="lg:hidden absolute top-5 right-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.button
          onClick={toggleMobileMenu}
          className="relative p-3 rounded-xl border border-gold-600/50 bg-steel-800/50 backdrop-blur-sm hover:border-gold-500 transition-all duration-300 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="text-xl text-gold-300 group-hover:text-gold-200 transition-colors duration-300"
            animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </motion.span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gold-600/10 via-gold-500/20 to-gold-600/10 rounded-xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-steel-900/95 via-steel-800/90 to-steel-900/95 backdrop-blur-xl border-b border-gold-600/30 shadow-2xl"
          >
            <div className="px-6 py-6 space-y-3">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block group"
                  >
                    <motion.div
                      className={cn(
                        "relative px-5 py-4 rounded-xl border backdrop-blur-sm transition-all duration-300",
                        item.label === "Admin"
                          ? "border-gold-600 bg-gradient-to-r from-gold-600/20 to-gold-500/20"
                          : "border-gold-600/50 bg-steel-800/80 hover:border-gold-500"
                      )}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span
                        className={cn(
                          "font-medieval text-lg flex items-center space-x-3 transition-colors duration-300",
                          item.label === "Admin"
                            ? "text-gold-200 group-hover:text-gold-100"
                            : "text-gold-300 group-hover:text-gold-200"
                        )}
                      >
                        <motion.span
                          className="text-xl"
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.icon}
                        </motion.span>
                        <span>{item.label}</span>
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-gold-600/10 via-gold-500/20 to-gold-600/10 rounded-xl"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Auth Section */}
              <motion.div
                className="pt-6 border-t border-gold-600/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <SignedOut>
                  <SignInButton>
                    <AnimatedButton
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      <span className="flex items-center justify-center space-x-3">
                        <span>🔐</span>
                        <span>Enter the Realm</span>
                      </span>
                    </AnimatedButton>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <motion.div
                    className="flex items-center justify-between p-4 rounded-xl border border-gold-600/50 bg-steel-800/80 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-left">
                      <p className="font-medieval text-sm text-steel-400">
                        Welcome back,
                      </p>
                      <p className="font-script text-lg text-gold-300">
                        Noble Lord
                      </p>
                    </div>
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox:
                            "border-2 border-gold-600 hover:border-gold-400 transition-all duration-300 shadow-lg rounded-full",
                          userButtonPopoverCard:
                            "bg-steel-800/95 backdrop-blur-md border border-gold-600 rounded-2xl shadow-2xl",
                          userButtonPopoverActionButton:
                            "text-gold-300 hover:bg-gold-600/20 rounded-xl transition-all duration-300",
                          userButtonPopoverFooter: "border-t border-gold-600",
                        },
                      }}
                      showName
                    />
                  </motion.div>
                </SignedIn>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
