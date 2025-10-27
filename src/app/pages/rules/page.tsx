"use client";

import Image from "next/image";
import logo from "../../../components/logo.png";
import { useState } from "react";

export default function RulesPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [hoveredResource, setHoveredResource] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-medieval-pattern opacity-5"></div>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12 mb-12">
            <div className="relative group">
              <Image
                src={logo}
                alt="War of the Elector"
                width={120}
                height={120}
                className="rounded-full border-4 border-medieval-gold-600 shadow-glow-gold transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-medieval-gold-400 to-medieval-gold-600 rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500"></div>
            </div>

            <div className="text-center lg:text-left">
              <h1 className="medieval-title mb-4 glow-text">
                📜 The Complete Rules of War of the Elector
              </h1>
              <p className="medieval-subtitle italic">
                "Master the ancient laws that govern the realm and forge your
                destiny..."
              </p>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            🏰 Introduction to the Realm
          </h2>

          <div className="space-y-6">
            <p className="medieval-text text-lg leading-relaxed">
              Welcome to the War of the Elector, a strategic multiplayer game
              based on the Imperium Fragmentum (2nd Edition) ruleset. Command
              your cities, construct buildings, manage resources, and build your
              realm through turn-based economic gameplay.
            </p>

            <div className="bg-gradient-to-r from-background/30 to-background/30 p-8 rounded-lg border border-primary/30 mt-6">
              <p className="medieval-text text-lg leading-relaxed italic">
                <span className="font-script text-medieval-gold-200">
                  "I have poured many hours into the original game and many more
                  into this refined version of it, I really do hope that
                  everyone enjoys it. A special thanks to people who helped me
                  refine this 2nd edition of the game: Eli, for help with game
                  balancing; Ben, for help with balancing, map building, and
                  combat testing; Aidan, for taking a long time to make a well
                  done detailed map that also was balanced for spawn locations;
                  And finally to you the player for giving my dream project a
                  chance :)"
                </span>
              </p>
              <p className="medieval-text text-sm text-medieval-steel-400 mt-4 text-right">
                — Noah, From the Imperium Fragmentum (2nd Edition) Foreword
              </p>
            </div>
          </div>
        </div>

        {/* How to Take Your Turn Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            🔄 How to Take Your Turn
          </h2>

          <div className="space-y-8">
            <p className="medieval-text text-lg text-center mb-8">
              Each turn follows a specific sequence of phases. Understanding
              this order is crucial for effective gameplay.
            </p>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 hover:shadow-lg hover:border-medieval-gold-400">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3 transition-transform duration-300 hover:scale-110">
                      💰
                    </span>
                    <h3 className="font-medieval text-xl text-medieval-gold-300">
                      1. Collect Income (Automatic)
                    </h3>
                  </div>
                  <p className="medieval-text">
                    Your cities generate income based on their tier level and
                    local wealth. Each turn, cities gain income according to
                    their tier level.{" "}
                    <strong>
                      City income per turn = Tier level income (10, 15, 40, 55,
                      or 70)
                    </strong>{" "}
                    This income is added to the city's total wealth. You can
                    then tax a percentage of the city's total wealth, which is
                    deducted from the city but added to your personal wealth.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 hover:shadow-lg hover:border-medieval-gold-400">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3 transition-transform duration-300 hover:scale-110">
                      ⚔️
                    </span>
                    <h3 className="font-medieval text-xl text-medieval-gold-300">
                      2. Pay Upkeep and Move Armies
                    </h3>
                  </div>
                  <p className="medieval-text">
                    Keep your armies in check by paying their upkeep costs.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 hover:shadow-lg hover:border-medieval-gold-400">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3 transition-transform duration-300 hover:scale-110">
                      📜
                    </span>
                    <h3 className="font-medieval text-xl text-medieval-gold-300">
                      3. Receive Event
                    </h3>
                  </div>
                  <p className="medieval-text">
                    An event triggers for all players, providing opportunities
                    for intrigue, diplomacy, and strategic decisions that can
                    affect your realm.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 hover:shadow-lg hover:border-medieval-gold-400">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3 transition-transform duration-300 hover:scale-110">
                      🏗️
                    </span>
                    <h3 className="font-medieval text-xl text-medieval-gold-300">
                      4. Build and Recruitment
                    </h3>
                  </div>
                  <p className="medieval-text">
                    Construct buildings and recruit units using your wealth and
                    resources. Costs are paid from your personal wealth, not the
                    cities' wealth.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 hover:shadow-lg hover:border-medieval-gold-400">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3 transition-transform duration-300 hover:scale-110">
                      🗺️
                    </span>
                    <h3 className="font-medieval text-xl text-medieval-gold-300">
                      5. Give Movement Orders
                    </h3>
                  </div>
                  <p className="medieval-text">
                    At the end of your turn, write down movement orders for
                    armies that will move next turn. Give these to the game
                    master before the turn passes.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 hover:shadow-lg hover:border-medieval-gold-400">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3 transition-transform duration-300 hover:scale-110">
                      📊
                    </span>
                    <h3 className="font-medieval text-xl text-medieval-gold-300">
                      Tax Collection
                    </h3>
                  </div>
                  <p className="medieval-text">
                    Set tax rates in 5% increments. You tax a percentage of your
                    city's total wealth, not just the income gained that turn.{" "}
                    <strong>
                      Tax amount = (%tax rate × City's total wealth)
                    </strong>{" "}
                    The taxed amount is deducted from the city's wealth and
                    added to your personal wealth. Cities continue to gain their
                    normal income per turn regardless of taxation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Overview Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            🎮 How the Game Works
          </h2>

          <div className="space-y-8">
            <p className="medieval-text text-lg text-center mb-8">
              War of the Elector is a strategic multiplayer game where you build
              cities, manage resources, and compete for dominance through
              economic and military might.
            </p>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">🏰</span>
                    <h3 className="font-medieval text-xl text-medieval-gold-300">
                      City Management
                    </h3>
                  </div>
                  <p className="medieval-text">
                    Each city has a tier level (1-5) that determines its income
                    generation. Cities accumulate wealth over time, and you can
                    tax a percentage of their total accumulated wealth. Higher
                    tier cities generate more income per turn but cost more to
                    upgrade.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">🏗️</span>
                    <h3 className="font-medieval text-xl text-medieval-gold-300">
                      Building Construction
                    </h3>
                  </div>
                  <p className="medieval-text">
                    Construct buildings to generate resources and improve your
                    cities. Buildings have different rarities (Common/Rare) and
                    require specific resources. Each building provides ongoing
                    benefits to your economy.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">⚔️</span>
                    <h3 className="font-medieval text-xl text-medieval-gold-300">
                      Military Strategy
                    </h3>
                  </div>
                  <p className="medieval-text">
                    Recruit and maintain armies to defend your territory and
                    expand your influence. Units have different tiers (T1-T5)
                    representing training and equipment quality. Higher tier
                    units are more effective but cost more to maintain.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">💰</span>
                    <h3 className="font-medieval text-xl text-medieval-gold-300">
                      Economic System
                    </h3>
                  </div>
                  <p className="medieval-text">
                    Balance taxation with city growth. Set tax rates in 5%
                    increments to extract wealth from your cities' total wealth.
                    Cities gain fixed income each turn regardless of taxation,
                    but high taxes will drain accumulated city wealth over time.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">🗺️</span>
                    <h3 className="font-medieval text-xl text-medieval-gold-300">
                      Turn-Based Gameplay
                    </h3>
                  </div>
                  <p className="medieval-text">
                    The game progresses in turns, with each turn following the
                    5-phase sequence. Four turns make up one year. Time
                    management and planning ahead are crucial for success in
                    this strategic environment.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">👑</span>
                    <h3 className="font-medieval text-xl text-medieval-gold-300">
                      Victory Conditions
                    </h3>
                  </div>
                  <p className="medieval-text">
                    Compete to build the most prosperous realm through city
                    mastery, economic dominance, and military excellence. The
                    player with the strongest combination of these elements will
                    emerge victorious.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            💎 The Five Core Resources
          </h2>

          <div className="space-y-8">
            <p className="medieval-text text-lg text-center mb-8">
              Your realm's prosperity depends on managing these five essential
              resources effectively.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              <div
                className={`bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                  hoveredResource === "crops"
                    ? "border-medieval-gold-400 shadow-glow-gold"
                    : ""
                }`}
                onMouseEnter={() => setHoveredResource("crops")}
                onMouseLeave={() => setHoveredResource(null)}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3 transition-transform duration-300 hover:rotate-12">
                    🌾
                  </span>
                  <h3 className="font-medieval text-xl text-medieval-gold-300">
                    Crops
                  </h3>
                </div>
                <p className="medieval-text">
                  Essential for feeding your population and armies. Produced by
                  Fields and other agricultural buildings. Critical for
                  maintaining your realm's food security.
                </p>
              </div>

              <div
                className={`bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                  hoveredResource === "wood"
                    ? "border-medieval-gold-400 shadow-glow-gold"
                    : ""
                }`}
                onMouseEnter={() => setHoveredResource("wood")}
                onMouseLeave={() => setHoveredResource(null)}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3 transition-transform duration-300 hover:rotate-12">
                    🌳
                  </span>
                  <h3 className="font-medieval text-xl text-medieval-gold-300">
                    Wood
                  </h3>
                </div>
                <p className="medieval-text">
                  The foundation of construction and industry. Essential for
                  building structures, weapons, and tools. Gathered from forests
                  and processed in Sawmills.
                </p>
              </div>

              <div
                className={`bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                  hoveredResource === "stone"
                    ? "border-medieval-gold-400 shadow-glow-gold"
                    : ""
                }`}
                onMouseEnter={() => setHoveredResource("stone")}
                onMouseLeave={() => setHoveredResource(null)}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3 transition-transform duration-300 hover:rotate-12">
                    🪨
                  </span>
                  <h3 className="font-medieval text-xl text-medieval-gold-300">
                    Stone
                  </h3>
                </div>
                <p className="medieval-text">
                  Required for fortifications, advanced buildings, and defensive
                  structures. Mined from quarries and stone deposits. Essential
                  for city upgrades.
                </p>
              </div>

              <div
                className={`bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                  hoveredResource === "metal"
                    ? "border-medieval-gold-400 shadow-glow-gold"
                    : ""
                }`}
                onMouseEnter={() => setHoveredResource("metal")}
                onMouseLeave={() => setHoveredResource(null)}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3 transition-transform duration-300 hover:rotate-12">
                    ⚒️
                  </span>
                  <h3 className="font-medieval text-xl text-medieval-gold-300">
                    Metal
                  </h3>
                </div>
                <p className="medieval-text">
                  The forge of industry and warfare. Essential for weapons,
                  armor, and advanced tools. Mined from metal deposits and
                  processed in forges.
                </p>
              </div>

              <div
                className={`bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                  hoveredResource === "produce"
                    ? "border-medieval-gold-400 shadow-glow-gold"
                    : ""
                }`}
                onMouseEnter={() => setHoveredResource("produce")}
                onMouseLeave={() => setHoveredResource(null)}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3 transition-transform duration-300 hover:rotate-12">
                    🐄
                  </span>
                  <h3 className="font-medieval text-xl text-medieval-gold-300">
                    Produce
                  </h3>
                </div>
                <p className="medieval-text">
                  Livestock and animal products. Provides food, materials, and
                  trade goods. Raised in Pastures and managed through
                  agricultural expertise.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* City Management Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            🏘️ City Management & Administration
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🏰</span>
                  City Fundamentals
                </h3>
                <div className="space-y-4">
                  <p className="medieval-text">
                    Cities are the heart of your realm, each with unique
                    characteristics and management requirements.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      City Properties
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Name:</strong> Customizable city names for
                          personalization
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Upgrade Tier:</strong> Levels 1-5, affecting
                          income generation
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Local Wealth:</strong> Internal city treasury
                          separate from your resources
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Tax Rate:</strong> Set in 5% increments (5%,
                          10%, 15%, etc.)
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30 mt-4">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      City Upgrade Costs
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Tier 2:</strong> 100 Currency, 20 Wood, 20
                          Stone
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Tier 3:</strong> 300 Currency, 40 Wood, 40
                          Stone
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Tier 4:</strong> 900 Currency, 90 Wood, 90
                          Stone
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Tier 5:</strong> 2700 Currency, 180 Wood, 180
                          Stone
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">📊</span>
                  Economic Management
                </h3>
                <div className="space-y-4">
                  <p className="medieval-text">
                    Master the art of taxation and wealth management to maximize
                    your realm's prosperity.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      Taxation System
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          Tax rates must be set in 5% increments (5%, 10%, 15%,
                          etc.)
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          Taxes are calculated from the city's local wealth
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          Collected taxes are added to your main currency
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          Tax collection reduces the city's local wealth
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🏗️</span>
                  Building Construction
                </h3>
                <div className="space-y-4">
                  <p className="medieval-text">
                    Construct buildings to generate resources, improve
                    efficiency, and expand your economic capabilities.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      Available Buildings
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medieval text-medieval-gold-300 mb-1">
                          Common Buildings
                        </h5>
                        <ul className="space-y-1 ml-4">
                          <li className="medieval-text text-sm">
                            • <strong>Sawmill:</strong> 50 Currency, 20 Wood, 10
                            Stone
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Quarry:</strong> 50 Currency, 20 Wood
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Fields:</strong> 50 Currency, 20 Wood
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Pastures:</strong> 50 Currency, 20 Wood,
                            10 Produce
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Infantry Barracks:</strong> 50 Currency,
                            20 Wood, 20 Stone, 10 Metal, 10 Produce
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Archery Barracks:</strong> 50 Currency, 20
                            Wood, 20 Stone, 10 Produce
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Town Square:</strong> 50 Currency, 20
                            Wood, 20 Stone, 10 Produce
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medieval text-medieval-gold-300 mb-1">
                          Rare Buildings
                        </h5>
                        <ul className="space-y-1 ml-4">
                          <li className="medieval-text text-sm">
                            • <strong>Mine:</strong> 150 Currency, 30 Wood, 30
                            Stone
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Cavalry Barracks:</strong> 150 Currency,
                            30 Wood, 20 Stone, 15 Metal, 10 Produce, 10 Produce
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Temple:</strong> 150 Currency, 30 Wood, 30
                            Stone
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Trading Post:</strong> 150 Currency, 30
                            Wood, 30 Stone, 20 Metal, 10 Produce, 10 Produce
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">⚙️</span>
                  Construction Process
                </h3>
                <div className="space-y-4">
                  <p className="medieval-text">
                    Understanding the building construction system is crucial
                    for efficient city development.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      Construction Rules
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          You must have sufficient resources to construct
                          buildings
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          Resources are deducted immediately upon construction
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>Buildings are permanent once constructed</span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          Building limits per city will be implemented (TBD)
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Turn-Based Economy Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            🔄 Turn-Based Economic System
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">💰</span>
                  Income Generation
                </h3>
                <div className="space-y-4">
                  <p className="medieval-text">
                    Each turn, your cities generate income based on their
                    upgrade tier and economic activity.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      City Income Formula
                    </h4>
                    <div className="space-y-3">
                      <p className="medieval-text text-sm">
                        <strong>
                          City income per turn = Tier level income (fixed
                          amount)
                        </strong>
                      </p>
                      <p className="medieval-text text-sm">
                        <strong>
                          Tax amount = (%tax rate × City's total wealth)
                        </strong>
                      </p>
                      <p className="medieval-text text-sm">
                        <strong>
                          City wealth after tax = (Previous wealth + Income) -
                          Tax amount
                        </strong>
                      </p>
                      <ul className="space-y-2">
                        <li className="medieval-text flex items-start">
                          <span className="text-medieval-gold-400 mr-2">•</span>
                          <span>
                            <strong>Tier 1:</strong> 10 income per turn
                          </span>
                        </li>
                        <li className="medieval-text flex items-start">
                          <span className="text-medieval-gold-400 mr-2">•</span>
                          <span>
                            <strong>Tier 2:</strong> 15 income per turn
                          </span>
                        </li>
                        <li className="medieval-text flex items-start">
                          <span className="text-medieval-gold-400 mr-2">•</span>
                          <span>
                            <strong>Tier 3:</strong> 40 income per turn
                          </span>
                        </li>
                        <li className="medieval-text flex items-start">
                          <span className="text-medieval-gold-400 mr-2">•</span>
                          <span>
                            <strong>Tier 4:</strong> 55 income per turn
                          </span>
                        </li>
                        <li className="medieval-text flex items-start">
                          <span className="text-medieval-gold-400 mr-2">•</span>
                          <span>
                            <strong>Tier 5:</strong> 70 income per turn
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🏭</span>
                  Resource Production
                </h3>
                <div className="space-y-4">
                  <p className="medieval-text">
                    Buildings generate resources each turn, providing a steady
                    income stream for your realm.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      Building Production
                    </h4>
                    <p className="medieval-text text-sm italic">
                      Specific resource generation values will be determined
                      based on building types and game balance. Each building
                      will contribute to your resource stockpile every turn.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">📈</span>
                  Tax Collection Process
                </h3>
                <div className="space-y-4">
                  <p className="medieval-text">
                    The taxation system is the core of your economic power,
                    converting local wealth into usable currency.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      Tax Calculation
                    </h4>
                    <div className="space-y-2">
                      <p className="medieval-text text-sm">
                        <strong>Step 1:</strong> City generates income and adds
                        it to local wealth
                      </p>
                      <p className="medieval-text text-sm">
                        <strong>Step 2:</strong> Tax amount = (Tax Rate % ×
                        Local Wealth)
                      </p>
                      <p className="medieval-text text-sm">
                        <strong>Step 3:</strong> Tax amount is added to your
                        main currency
                      </p>
                      <p className="medieval-text text-sm">
                        <strong>Step 4:</strong> Tax amount is deducted from
                        city's local wealth
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">⏰</span>
                  Turn Advancement
                </h3>
                <div className="space-y-4">
                  <p className="medieval-text">
                    Turn advancement is controlled by administrators to ensure
                    proper game flow and economic processing.
                  </p>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                      Turn Processing
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>Resource generation from all buildings</span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          City income calculation and local wealth updates
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>Tax collection and currency distribution</span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>Economic balance updates across all players</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Controls Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            👑 Administrative Powers & Game Management
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-6">
                🏘️ City Granting Authority
              </h3>
              <div className="space-y-4">
                <p className="medieval-text">
                  Administrators wield the power to shape the realm by granting
                  cities to players, expanding their territories and economic
                  potential.
                </p>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-2">
                      🏰 City Creation Process
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text text-sm">
                        • Select a player from the user list
                      </li>
                      <li className="medieval-text text-sm">
                        • Enter a custom city name
                      </li>
                      <li className="medieval-text text-sm">
                        • City starts at Tier 1 with 100 local wealth
                      </li>
                      <li className="medieval-text text-sm">
                        • Default tax rate of 5% is applied
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-2">
                      📊 Realm Oversight
                    </h4>
                    <p className="medieval-text text-sm">
                      Monitor all cities across the realm, tracking wealth
                      accumulation, building progress, and economic development
                      of all players.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-6">
                🔄 Turn Management System
              </h3>
              <div className="space-y-4">
                <p className="medieval-text">
                  The turn-based economy requires careful administration to
                  maintain game balance and ensure fair economic processing for
                  all players.
                </p>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-2">
                      ⚠️ Turn Advancement Protocol
                    </h4>
                    <ul className="space-y-2">
                      <li className="medieval-text text-sm">
                        • Confirmation modal prevents accidental advancement
                      </li>
                      <li className="medieval-text text-sm">
                        • Processes all cities simultaneously
                      </li>
                      <li className="medieval-text text-sm">
                        • Updates all player resources and wealth
                      </li>
                      <li className="medieval-text text-sm">
                        • Maintains economic balance across the realm
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-2">
                      💰 Economic Processing
                    </h4>
                    <p className="medieval-text text-sm">
                      Each turn processes income generation, tax collection,
                      resource production, and wealth distribution across all
                      players simultaneously.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Interface Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            🎮 Game Interface & Navigation
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="font-medieval text-xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-2xl mr-3">🏰</span>
                Dashboard
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                <ul className="space-y-2">
                  <li className="medieval-text text-sm">
                    • View your current resources
                  </li>
                  <li className="medieval-text text-sm">
                    • Transfer resources to other players
                  </li>
                  <li className="medieval-text text-sm">
                    • Access admin functions (if applicable)
                  </li>
                  <li className="medieval-text text-sm">
                    • Monitor realm statistics
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medieval text-xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-2xl mr-3">🏘️</span>
                Cities
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                <ul className="space-y-2">
                  <li className="medieval-text text-sm">
                    • View all your cities
                  </li>
                  <li className="medieval-text text-sm">
                    • Access individual city management
                  </li>
                  <li className="medieval-text text-sm">
                    • Monitor city wealth and buildings
                  </li>
                  <li className="medieval-text text-sm">
                    • Construct new buildings
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medieval text-xl text-medieval-gold-300 mb-4 flex items-center">
                <span className="text-2xl mr-3">👑</span>
                Admin Panel
              </h3>
              <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                <ul className="space-y-2">
                  <li className="medieval-text text-sm">
                    • Grant cities to players
                  </li>
                  <li className="medieval-text text-sm">
                    • Advance turns for all players
                  </li>
                  <li className="medieval-text text-sm">
                    • Monitor realm-wide statistics
                  </li>
                  <li className="medieval-text text-sm">
                    • Oversee economic balance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Victory Conditions Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            🏆 Paths to Victory
          </h2>

          <div className="space-y-8">
            <p className="medieval-text text-lg text-center">
              The ultimate goal is to build the most prosperous and powerful
              realm through strategic city management, economic growth, and
              resource mastery.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="text-5xl">🏘️</div>
                <h3 className="font-medieval text-xl text-medieval-gold-300">
                  City Mastery
                </h3>
                <p className="medieval-text">
                  Build the most cities with the highest upgrade tiers and local
                  wealth. Expand your territorial control and economic influence
                  across the realm.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="text-5xl">💰</div>
                <h3 className="font-medieval text-xl text-medieval-gold-300">
                  Economic Dominance
                </h3>
                <p className="medieval-text">
                  Accumulate vast resources and currency through efficient city
                  management, optimal tax rates, and strategic building
                  construction.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="text-5xl">🏗️</div>
                <h3 className="font-medieval text-xl text-medieval-gold-300">
                  Building Excellence
                </h3>
                <p className="medieval-text">
                  Construct the most advanced buildings and optimize your
                  economic output. Master the art of resource production and
                  industrial development.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="medieval-card p-12 text-center animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text">
            🚀 Ready to Begin Your Journey?
          </h2>

          <p className="font-script text-2xl text-medieval-gold-200 italic mb-8">
            "The realm awaits your command, noble lord. Will you forge a dynasty
            that will be remembered for ages?"
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/pages/dashboard"
              className="medieval-button group text-lg px-8 py-4"
            >
              <span className="flex items-center space-x-3">
                <span>🏰</span>
                <span>Enter Your Castle</span>
              </span>
            </a>

            <a
              href="/pages/cities"
              className="medieval-button-secondary group text-lg px-8 py-4"
            >
              <span className="flex items-center space-x-3">
                <span>🏘️</span>
                <span>Manage Your Cities</span>
              </span>
            </a>

            <a
              href="/"
              className="medieval-button-secondary group text-lg px-8 py-4"
            >
              <span className="flex items-center space-x-3">
                <span>🏠</span>
                <span>Return Home</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
