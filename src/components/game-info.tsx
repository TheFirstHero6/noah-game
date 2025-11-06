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
            <h1 className="heading-1 mb-6 uppercase">
              War of the Elector{welcomeSuffix}
            </h1>

            {/* Subtitle */}
            <p className="font-[Cormorant_Garamond] text-gray-300 italic text-xl md:text-2xl mb-4 leading-relaxed">
              "Forge thy kingdom in fire and steel"
            </p>
            <p className="body-text-serif text-gray-400 mb-12 max-w-2xl mx-auto">
              Command armies, build mighty cities, and shape the fate of realms
              in this grand strategy of medieval conquest and diplomacy.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/pages/dashboard" className="modern-button group">
                <span className="relative flex items-center gap-3 font-[Cinzel] text-base md:text-lg uppercase tracking-wider">
                  <span className="text-xl">⚔️</span>
                  <span>Begin Your Conquest</span>
                </span>
              </Link>

              <Link
                href="/pages/rules"
                className="modern-button-secondary group"
              >
                <span className="relative flex items-center gap-3 font-[Cinzel] text-base md:text-lg uppercase tracking-wider">
                  <span className="text-xl">📜</span>
                  <span>Study the Codex</span>
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
          <div className="modern-card p-8 md:p-12">
            <h2 className="heading-2 mb-8 text-center uppercase">
              ⚔️ Master the Art of Medieval Warfare
            </h2>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🏰</span>
                  <h3 className="heading-3">City Dominion</h3>
                </div>
                <p className="body-text-serif">
                  Establish and expand your settlements across the realm.
                  Construct mighty fortifications, bustling markets, and
                  productive workshops. Each structure serves your grand
                  strategy— from humble sawmills to imposing forges that arm
                  your legions.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">💰</span>
                  <h3 className="heading-3">Economic Mastery</h3>
                </div>
                <p className="body-text-serif">
                  Command a sophisticated economy of seven vital resources.
                  Balance the flow of timber, stone, provisions, coin, metal,
                  and livestock. Set taxation wisely, for a prosperous realm
                  breeds loyal subjects and formidable armies.
                </p>
              </div>
            </div>
          </div>

          {/* Four-Card Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="resource-card group">
              <div className="text-5xl mb-4 transition-transform duration-500 group-hover:scale-110">
                🏘️
              </div>
              <h3 className="heading-4 mb-3">Settlements</h3>
              <p className="body-text text-sm">
                Establish thriving cities and govern with wisdom. Name your
                domains and levy taxes to fund your ambitions.
              </p>
            </div>

            <div className="resource-card group">
              <div className="text-5xl mb-4 transition-transform duration-500 group-hover:scale-110">
                🏗️
              </div>
              <h3 className="heading-4 mb-3">Infrastructure</h3>
              <p className="body-text text-sm">
                Erect sawmills, quarries, forges, granaries, and marketplaces.
                Each building strengthens your realm.
              </p>
            </div>

            <div className="resource-card group">
              <div className="text-5xl mb-4 transition-transform duration-500 group-hover:scale-110">
                💎
              </div>
              <h3 className="heading-4 mb-3">Resources</h3>
              <p className="body-text text-sm">
                Master the flow of timber, stone, grain, gold, iron, and beasts.
                Wealth fuels conquest.
              </p>
            </div>

            <div className="resource-card group">
              <div className="text-5xl mb-4 transition-transform duration-500 group-hover:scale-110">
                ⏳
              </div>
              <h3 className="heading-4 mb-3">Strategy</h3>
              <p className="body-text text-sm">
                Plan each turn with care. Balance growth, defense, and expansion
                in this grand campaign.
              </p>
            </div>
          </div>

          {/* Version 1.0 Card */}
          <div className="modern-card p-8 md:p-12 text-center">
            <div className="inline-block px-6 py-2 rounded-full bg-[var(--theme-gold)]/10 border border-[var(--theme-gold)]/30 mb-6">
              <span className="label-text text-[var(--theme-gold)]">
                Version 1.4 Released
              </span>
            </div>

            <h2 className="heading-2 mb-4 text-glow">Start Your Journey</h2>

            <p className="body-text-serif text-gray-300 mb-12 max-w-3xl mx-auto text-xl">
              The First Edition of War of the Elector is live! Invite your
              friends, build cities, armies, and alliances. Vie for dominance in
              this epic medieval strategy game.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="space-y-4">
                <div className="text-5xl mb-4">🏛️</div>
                <h3 className="heading-4">Realm Creation</h3>
                <p className="body-text">
                  Create your game by making a realm and inviting your friends
                  with the invite code
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-5xl mb-4">⚖️</div>
                <h3 className="heading-4">Resource Management</h3>
                <p className="body-text">
                  The core building block of the game. Send resources between
                  your realm in the Dashboard, or manage other players resources
                  as the Owner
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-5xl mb-4">👑</div>
                <h3 className="heading-4">Building Your Civilization</h3>
                <p className="body-text">
                  Create Cities and Buildings through the Cities section, and
                  use your resources and buildings to contruct armies in the
                  Armies section
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/pages/dashboard" className="modern-button group">
                <span className="relative flex items-center gap-3 font-[Cinzel] text-base md:text-lg uppercase tracking-wider">
                  <span className="text-xl">⚔️</span>
                  <span>Start Playing</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
