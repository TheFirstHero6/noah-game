"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import logo from "./logo.png";
import LoggedOutNavbar from "./LoggedOutNavbar";

export default function GameInfo() {
  const { user } = useUser();
  const username = user?.firstName;
  const welcomeSuffix = username ? `, ${username}` : "";

  return (
    <div className="bg-[var(--theme-bg)] relative overflow-hidden min-h-screen -mt-20">
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: `${(i * 61) % 100}%`, top: `${(i * 37) % 100}%` }}
          >
            <svg className="h-12 w-12" fill="none" viewBox="0 0 40 40">
              <path
                d="M36 34V30H34V34H30V36H34V40H36V36H40V34H36ZM36 4V0H34V4H30V6H34V10H36V6H40V4H36ZM6 34V30H4V34H0V36H4V40H6V36H10V34H6ZM6 4V0H4V4H0V6H4V10H6V6H10V4H6Z"
                fill="var(--theme-gold)"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Full-Screen Hero Section */}
      <section className="h-screen flex flex-col relative">
        <LoggedOutNavbar />
        
        {/* Centered Hero Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-4xl">
            {/* Game Logo */}
            <div className="relative group mb-8 flex justify-center">
              <div className="relative">
                <Image
                  src={logo}
                  alt="War of the Elector"
                  width={180}
                  height={180}
                  className="rounded-full border-4 border-[var(--theme-accent)] transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 relative z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-gold)] to-[var(--theme-accent)] rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500 -z-10"></div>
              </div>
            </div>

            {/* Heading */}
            <h1 className="font-[Cinzel] text-[var(--theme-gold)] text-4xl md:text-5xl lg:text-6xl mb-6 uppercase tracking-wide">
              WELCOME TO THE WAR OF THE ELECTOR{welcomeSuffix.toUpperCase()}!
            </h1>

            {/* Subtitle */}
            <p className="font-[Playfair_Display] text-[var(--theme-gold)] italic text-lg md:text-xl mb-12">
              "In the realm of nobles and knights, your destiny awaits..."
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/pages/dashboard"
                className="group relative px-8 py-4 rounded-xl overflow-hidden font-[Cinzel] text-lg bg-[var(--theme-gold)] text-slate-900 hover:bg-[var(--theme-gold-dark)] transition-all duration-300"
              >
                <span className="relative flex items-center gap-3">
                  <span>🏰</span>
                  <span>ENTER YOUR CASTLE</span>
                </span>
              </Link>

              <Link
                href="/pages/rules"
                className="group relative px-8 py-4 rounded-xl overflow-hidden font-[Cinzel] text-lg border-2 border-[var(--theme-border)] hover:border-[var(--theme-accent)] transition-colors text-[var(--theme-gold)]"
              >
                <span className="relative flex items-center gap-3">
                  <span>📜</span>
                  <span>LEARN THE RULES</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Main Features Card */}
          <div className="border border-[var(--theme-border)] rounded-lg p-8 md:p-12">
            <h2 className="font-[Cinzel] text-[var(--theme-gold)] text-3xl md:text-4xl mb-8 text-center uppercase">
              🏰 THE REALM AWAITS YOUR COMMAND
            </h2>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="font-[Cinzel] text-[var(--theme-gold)] text-2xl mb-4">
                  🏰 CITY MANAGEMENT & BUILDING
                </h3>
                <p className="font-[Playfair_Display] text-gray-200 leading-relaxed">
                  War of the Elector features comprehensive city management where
                  you can construct buildings, set tax rates, and manage local
                  wealth. Build sawmills, quarries, forges, farms, and markets to
                  generate resources and grow your economy.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="font-[Cinzel] text-[var(--theme-gold)] text-2xl mb-4">
                  💰 TURN-BASED ECONOMY
                </h3>
                <p className="font-[Playfair_Display] text-gray-200 leading-relaxed">
                  Experience a dynamic turn-based economy with seven core
                  resources: Wood, Stone, Food, Currency, Metal, and Livestock.
                  Manage your cities' local wealth, set tax rates, and watch your
                  realm prosper through strategic resource management.
                </p>
              </div>
            </div>
          </div>

          {/* Four-Card Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group relative h-[280px] w-full">
              <div className="relative h-full border border-[var(--theme-border)] rounded-lg p-8 flex flex-col items-center justify-center text-center group-hover:border-[var(--theme-accent)] transition-all duration-300">
                <div className="text-5xl mb-4 group-hover:animate-float">🏘️</div>
                <h3 className="font-[Cinzel] text-[var(--theme-gold)] text-xl mb-3 uppercase">
                  CITY MANAGEMENT
                </h3>
                <p className="font-[Playfair_Display] text-gray-200">
                  Build and manage cities with customizable names and tax rates
                </p>
              </div>
            </div>

            <div className="group relative h-[280px] w-full">
              <div className="relative h-full border border-[var(--theme-border)] rounded-lg p-8 flex flex-col items-center justify-center text-center group-hover:border-[var(--theme-accent)] transition-all duration-300">
                <div className="text-5xl mb-4 group-hover:animate-float">🏗️</div>
                <h3 className="font-[Cinzel] text-[var(--theme-gold)] text-xl mb-3 uppercase">
                  BUILDING CONSTRUCTION
                </h3>
                <p className="font-[Playfair_Display] text-gray-200">
                  Construct sawmills, quarries, forges, farms, and markets
                </p>
              </div>
            </div>

            <div className="group relative h-[280px] w-full">
              <div className="relative h-full border border-[var(--theme-border)] rounded-lg p-8 flex flex-col items-center justify-center text-center group-hover:border-[var(--theme-accent)] transition-all duration-300">
                <div className="text-5xl mb-4 group-hover:animate-float">💰</div>
                <h3 className="font-[Cinzel] text-[var(--theme-gold)] text-xl mb-3 uppercase">
                  RESOURCE MANAGEMENT
                </h3>
                <p className="font-[Playfair_Display] text-gray-200">
                  Manage Wood, Stone, Food, Currency, Metal, and Livestock
                </p>
              </div>
            </div>

            <div className="group relative h-[280px] w-full">
              <div className="relative h-full border border-[var(--theme-border)] rounded-lg p-8 flex flex-col items-center justify-center text-center group-hover:border-[var(--theme-accent)] transition-all duration-300">
                <div className="text-5xl mb-4 group-hover:animate-float">👑</div>
                <h3 className="font-[Cinzel] text-[var(--theme-gold)] text-xl mb-3 uppercase">
                  TURN-BASED INCOME
                </h3>
                <p className="font-[Playfair_Display] text-gray-200">
                  Experience turn-based economy with income and taxation
                </p>
              </div>
            </div>
          </div>

          {/* Version 1.0 Card */}
          <div className="border border-[var(--theme-border)] rounded-lg p-8 md:p-12 text-center">
            <h2 className="font-[Cinzel] text-[var(--theme-gold)] text-3xl md:text-4xl mb-8 uppercase [text-shadow:var(--theme-accent)_0_0_30px,var(--theme-accent)_0_0_20px,var(--theme-accent)_0_0_10px]">
              🚀 VERSION 1.0 - NOW AVAILABLE
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="space-y-4">
                <div className="text-4xl mb-4">🏘️</div>
                <h3 className="font-[Cinzel] text-[var(--theme-gold)] text-xl uppercase">
                  CITY MANAGEMENT
                </h3>
                <p className="font-[Playfair_Display] text-gray-200">
                  Build cities, construct buildings, and manage local wealth
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="font-[Cinzel] text-[var(--theme-gold)] text-xl uppercase">
                  TURN-BASED ECONOMY
                </h3>
                <p className="font-[Playfair_Display] text-gray-200">
                  Experience income generation and taxation systems
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-4xl mb-4">👑</div>
                <h3 className="font-[Cinzel] text-[var(--theme-gold)] text-xl uppercase">
                  ADMIN CONTROLS
                </h3>
                <p className="font-[Playfair_Display] text-gray-200">
                  Grant cities and advance turns for all players
                </p>
              </div>
            </div>

            {/* Footer Quote */}
            <p className="font-[Dancing_Script] text-2xl text-[var(--theme-gold)]/80 italic">
              "The realm awaits your command, noble lord..."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
