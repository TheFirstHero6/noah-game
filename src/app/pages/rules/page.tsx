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
                📜 The Rules of War of the Elector
              </h1>
              <p className="medieval-subtitle italic">
                "Master the ancient laws that govern the realm..."
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
              where you command a noble house in a medieval realm. Your
              decisions will shape the fate of your dynasty, determine the
              strength of your alliances, and ultimately decide who will rule
              the realm.
            </p>

            <div className="bg-gradient-to-r from-background/50 to-background/50 p-8 rounded-lg border-2 border-primary/30">
              <p className="medieval-text text-lg leading-relaxed">
                <span className="font-medieval text-medieval-gold-300">
                  "In this realm, power flows through bloodlines, alliances, and
                  the wise management of resources. The noble houses that
                  survive are those who understand that true strength comes not
                  from the sword alone, but from the bonds of family and the
                  wealth of their lands."
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Gameplay Rules Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            ⚔️ Core Gameplay Rules
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">👑</span>
                  Noble House Management
                </h3>
                <div className="space-y-4">
                  <p className="medieval-text">
                    Each player controls a noble house where family members play
                    crucial roles in gaining strategic advantages.
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="medieval-text flex items-start">
                      <span className="text-medieval-gold-400 mr-2">•</span>
                      <span>Family members can lead armies (age 18+)</span>
                    </li>
                    <li className="medieval-text flex items-start">
                      <span className="text-medieval-gold-400 mr-2">•</span>
                      <span>
                        Govern regions and complete missions (age 18+)
                      </span>
                    </li>
                    <li className="medieval-text flex items-start">
                      <span className="text-medieval-gold-400 mr-2">•</span>
                      <span>Strategic marriages within noble ranks</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🏘️</span>
                  Town & Population
                </h3>
                <div className="space-y-4">
                  <p className="medieval-text">
                    Towns serve as the economic backbone of your noble house.
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="medieval-text flex items-start">
                      <span className="text-medieval-gold-400 mr-2">•</span>
                      <span>Each town supports up to four buildings</span>
                    </li>
                    <li className="medieval-text flex items-start">
                      <span className="text-medieval-gold-400 mr-2">•</span>
                      <span>
                        Population required for production and management
                      </span>
                    </li>
                    <li className="medieval-text flex items-start">
                      <span className="text-medieval-gold-400 mr-2">•</span>
                      <span>Recruiting armies consumes population</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">⚔️</span>
                  Army & Combat
                </h3>
                <div className="space-y-4">
                  <p className="medieval-text">
                    Build armies and engage in strategic battles to expand your
                    influence.
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="medieval-text flex items-start">
                      <span className="text-medieval-gold-400 mr-2">•</span>
                      <span>Must have a Muster Field to recruit</span>
                    </li>
                    <li className="medieval-text flex items-start">
                      <span className="text-medieval-gold-400 mr-2">•</span>
                      <span>Pay population, resource, and ducat costs</span>
                    </li>
                    <li className="medieval-text flex items-start">
                      <span className="text-medieval-gold-400 mr-2">•</span>
                      <span>
                        Unit types: Pikes, Matchlocks, Flintlocks, Cavalry
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4 flex items-center">
                  <span className="text-3xl mr-3">💰</span>
                  Resource Management
                </h3>
                <div className="space-y-4">
                  <p className="medieval-text">
                    Manage your kingdom's wealth and resources strategically.
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="medieval-text flex items-start">
                      <span className="text-medieval-gold-400 mr-2">•</span>
                      <span>Resources: Wood, Stone, Food, Ducats</span>
                    </li>
                    <li className="medieval-text flex items-start">
                      <span className="text-medieval-gold-400 mr-2">•</span>
                      <span>Buildings produce key resources</span>
                    </li>
                    <li className="medieval-text flex items-start">
                      <span className="text-medieval-gold-400 mr-2">•</span>
                      <span>
                        Trade and transfer resources with other players
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marriage & Alliances Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            💒 Marriage & Alliances
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-6">
                💍 Noble Marriages
              </h3>
              <div className="space-y-4">
                <p className="medieval-text">
                  Noble houses only marry within their rank. There are two ways
                  to obtain a spouse:
                </p>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-2">
                      💰 Dowry Marriage
                    </h4>
                    <p className="medieval-text">
                      Pay $1000 dowry to find a spouse from a minor noble house.
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                    <h4 className="font-medieval text-lg text-medieval-gold-300 mb-2">
                      🤝 Alliance Marriage
                    </h4>
                    <p className="medieval-text">
                      Arrange marriage with another player's noble family, with
                      dowry negotiation and potential alliance benefits.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-6">
                🌳 Family Growth
              </h3>
              <div className="space-y-4">
                <p className="medieval-text">
                  Families grow through adoption or childbirth, determined by
                  seasonal rolls. Strategic family planning is crucial for
                  maintaining your dynasty's strength.
                </p>
                <div className="bg-gradient-to-r from-background/30 to-background/30 p-6 rounded-lg border border-primary/30">
                  <h4 className="font-medieval text-lg text-medieval-gold-300 mb-2">
                    📈 Dynasty Management
                  </h4>
                  <p className="medieval-text">
                    Each new family member brings potential for leadership,
                    alliances, and strategic advantages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Victory Conditions Section */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
            👑 Victory Conditions
          </h2>

          <div className="space-y-8">
            <p className="medieval-text text-lg text-center">
              The ultimate goal is to establish your noble house as the most
              powerful dynasty in the realm. Victory can be achieved through
              various strategic paths:
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="text-5xl">⚔️</div>
                <h3 className="font-medieval text-xl text-medieval-gold-300">
                  Military Dominance
                </h3>
                <p className="medieval-text">
                  Build the strongest army and conquer your rivals through
                  force.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="text-5xl">💎</div>
                <h3 className="font-medieval text-xl text-medieval-gold-300">
                  Economic Supremacy
                </h3>
                <p className="medieval-text">
                  Accumulate vast wealth and control the realm's trade routes.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="text-5xl">🤝</div>
                <h3 className="font-medieval text-xl text-medieval-gold-300">
                  Diplomatic Victory
                </h3>
                <p className="medieval-text">
                  Forge powerful alliances and rule through political influence.
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
