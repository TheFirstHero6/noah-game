"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "./logo.png";

export default function LoggedOutNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b bg-[var(--theme-navbar-bg)] border-[var(--theme-border)]">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <Link href="/" className="group flex items-center space-x-2 md:space-x-3 transition-all duration-300 hover:scale-105">
          <div className="relative transition-transform duration-300 group-hover:rotate-6">
            <Image
              src={logo}
              alt="War of the Elector"
              width={48}
              height={48}
              className="rounded-full border-2 border-[var(--theme-accent)] transition-all duration-300 group-hover:border-[var(--theme-gold)]"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-[Cinzel] text-sm md:text-lg lg:text-xl text-[var(--theme-gold)] tracking-wider uppercase transition-colors duration-300 group-hover:text-[var(--theme-gold)]/90">
              WAR OF THE ELECTOR
            </h1>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/#features"
            className="group relative font-[Cinzel] text-sm text-[var(--theme-gold)] hover:text-[var(--theme-gold)]/80 transition-all duration-300 uppercase flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[var(--theme-card-bg)]/50"
          >
            <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">⭐</span>
            <span className="relative transition-all duration-300 group-hover:translate-y-[-2px]">FEATURES</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--theme-accent)] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
          <Link
            href="/#about"
            className="group relative font-[Cinzel] text-sm text-[var(--theme-gold)] hover:text-[var(--theme-gold)]/80 transition-all duration-300 uppercase flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[var(--theme-card-bg)]/50"
          >
            <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">📖</span>
            <span className="relative transition-all duration-300 group-hover:translate-y-[-2px]">ABOUT</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--theme-accent)] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
          <Link
            href="/pages/rules"
            className="group relative font-[Cinzel] text-sm text-[var(--theme-gold)] hover:text-[var(--theme-gold)]/80 transition-all duration-300 uppercase flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[var(--theme-card-bg)]/50"
          >
            <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">📜</span>
            <span className="relative transition-all duration-300 group-hover:translate-y-[-2px]">RULES</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--theme-accent)] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
          <Link
            href="/pages/dashboard"
            className="group relative px-6 py-2.5 rounded-xl bg-[var(--theme-gold)] text-slate-900 font-[Cinzel] text-sm hover:bg-[var(--theme-gold-dark)] transition-all duration-300 uppercase flex items-center gap-2 overflow-hidden"
          >
            <span className="transition-transform duration-300 group-hover:scale-110">🏰</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-y-[-2px]">ENTER CASTLE</span>
            <span className="absolute inset-0 bg-gradient-to-r from-[var(--theme-gold-dark)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center gap-4">
          <Link
            href="/pages/dashboard"
            className="px-4 py-2 rounded-lg bg-[var(--theme-gold)] text-slate-900 font-[Cinzel] text-xs hover:bg-[var(--theme-gold-dark)] transition-all duration-300"
          >
            ENTER CASTLE
          </Link>
        </div>
      </div>
    </nav>
  );
}

