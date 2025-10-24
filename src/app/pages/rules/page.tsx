"use client";

import Image from "next/image";
import logo from "../../../components/logo.png";

export default function RulesPage() {
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

            <div className="bg-gradient-to-r from-background/50 to-background/50 p-8 rounded-lg border-2 border-primary/30">
              <p className="medieval-text text-lg leading-relaxed">
                <span className="font-medieval text-medieval-gold-300">
                  "In this realm, power flows through the wise management of
                  cities, the construction of buildings, and the strategic use
                  of resources. The noble houses that prosper are those who
                  understand the art of city management, taxation, and economic
                  growth."
                </span>
              </p>
            </div>

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

        {/* Core Resources Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            💎 The Seven Pillars of Wealth
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🌳</span>
                <h3 className="font-medieval text-xl text-medieval-gold-300">
                  Wood
                </h3>
              </div>
              <p className="medieval-text">
                The foundation of construction. Essential for basic buildings,
                tools, and infrastructure. Gathered from forests and processed
                in sawmills.
              </p>
            </div>

            <div className="bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🪨</span>
                <h3 className="font-medieval text-xl text-medieval-gold-300">
                  Stone
                </h3>
              </div>
              <p className="medieval-text">
                The backbone of fortification. Required for advanced buildings,
                walls, and defensive structures. Mined from quarries and stone
                deposits.
              </p>
            </div>

            <div className="bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🌾</span>
                <h3 className="font-medieval text-xl text-medieval-gold-300">
                  Food
                </h3>
              </div>
              <p className="medieval-text">
                The lifeblood of your people. Sustains population, feeds armies,
                and drives economic growth. Produced by farms and agricultural
                buildings.
              </p>
            </div>

            <div className="bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">💰</span>
                <h3 className="font-medieval text-xl text-medieval-gold-300">
                  Currency
                </h3>
              </div>
              <p className="medieval-text">
                The universal medium of exchange. Used for construction, trade,
                and administrative costs. Generated through taxation and
                economic activities.
              </p>
            </div>

            <div className="bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">⚒️</span>
                <h3 className="font-medieval text-xl text-medieval-gold-300">
                  Metal
                </h3>
              </div>
              <p className="medieval-text">
                The forge of industry. Essential for weapons, advanced tools,
                and technological development. Smelted in forges and
                metalworking facilities.
              </p>
            </div>

            <div className="bg-gradient-to-br from-background/50 to-background/30 p-6 rounded-lg border border-primary/30">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🐄</span>
                <h3 className="font-medieval text-xl text-medieval-gold-300">
                  Livestock
                </h3>
              </div>
              <p className="medieval-text">
                The wealth of the pastures. Provides food, materials, and trade
                goods. Raised in pastures and managed through agricultural
                expertise.
              </p>
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
                            • <strong>Sawmill:</strong> 100 Currency
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Quarry:</strong> 100 Currency
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Forge:</strong> 150 Currency, 50 Wood
                          </li>
                          <li className="medieval-text text-sm">
                            • <strong>Farm:</strong> 80 Currency, 20 Wood
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medieval text-medieval-gold-300 mb-1">
                          Rare Buildings
                        </h5>
                        <ul className="space-y-1 ml-4">
                          <li className="medieval-text text-sm">
                            • <strong>Market:</strong> 200 Currency, 100 Wood,
                            50 Stone
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
                          <strong>Tier 3:</strong> 20 income per turn
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Tier 4:</strong> 25 income per turn
                        </span>
                      </li>
                      <li className="medieval-text flex items-start">
                        <span className="text-medieval-gold-400 mr-2">•</span>
                        <span>
                          <strong>Tier 5:</strong> 30 income per turn
                        </span>
                      </li>
                    </ul>
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
                        • City starts at Tier 1 with 0 local wealth
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

        {/* Advanced Strategies Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            🧠 Advanced Strategies & Tips
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h3 className="font-medieval text-xl text-medieval-gold-300 mb-4">
                  💡 Economic Optimization
                </h3>
                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <ul className="space-y-2">
                    <li className="medieval-text text-sm">
                      • Balance tax rates to maximize income without stifling
                      growth
                    </li>
                    <li className="medieval-text text-sm">
                      • Prioritize buildings that generate the resources you
                      need most
                    </li>
                    <li className="medieval-text text-sm">
                      • Consider the long-term value of rare buildings like
                      Markets
                    </li>
                    <li className="medieval-text text-sm">
                      • Monitor local wealth accumulation for optimal tax timing
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-medieval text-xl text-medieval-gold-300 mb-4">
                  🏗️ Construction Strategy
                </h3>
                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <ul className="space-y-2">
                    <li className="medieval-text text-sm">
                      • Start with basic buildings to establish resource
                      production
                    </li>
                    <li className="medieval-text text-sm">
                      • Plan your building sequence based on resource
                      availability
                    </li>
                    <li className="medieval-text text-sm">
                      • Consider the cost-benefit ratio of each building type
                    </li>
                    <li className="medieval-text text-sm">
                      • Save resources for rare buildings when possible
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medieval text-xl text-medieval-gold-300 mb-4">
                  🏘️ City Management
                </h3>
                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <ul className="space-y-2">
                    <li className="medieval-text text-sm">
                      • Name your cities strategically for easy identification
                    </li>
                    <li className="medieval-text text-sm">
                      • Monitor city wealth to determine optimal tax rates
                    </li>
                    <li className="medieval-text text-sm">
                      • Balance local wealth growth with tax collection
                    </li>
                    <li className="medieval-text text-sm">
                      • Plan for city upgrade opportunities
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-medieval text-xl text-medieval-gold-300 mb-4">
                  ⚖️ Resource Balance
                </h3>
                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <ul className="space-y-2">
                    <li className="medieval-text text-sm">
                      • Maintain a diverse resource portfolio
                    </li>
                    <li className="medieval-text text-sm">
                      • Trade excess resources with other players
                    </li>
                    <li className="medieval-text text-sm">
                      • Plan ahead for expensive building projects
                    </li>
                    <li className="medieval-text text-sm">
                      • Monitor resource production from all buildings
                    </li>
                  </ul>
                </div>
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
