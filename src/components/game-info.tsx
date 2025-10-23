"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import logo from "./logo.png";

export default function GameInfo() {
  const { user } = useUser();
  const username = user?.firstName;
  const welcomeSuffix = username ? `, ${username}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-medieval-steel-900 via-medieval-steel-800 to-medieval-steel-900 flex items-center justify-center p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-medieval-pattern opacity-5"></div>

      <div className="relative w-full max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12 mb-12">
            <div className="relative group">
              <Image
                src={logo}
                alt="War of the Elector"
                width={140}
                height={140}
                className="rounded-full border-4 border-medieval-gold-600 shadow-glow-gold transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-medieval-gold-400 to-medieval-gold-600 rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500"></div>
            </div>

            <div className="text-center lg:text-left">
              <h1 className="medieval-title mb-4 glow-text">
                Welcome to the War of the Elector{welcomeSuffix}!
              </h1>
              <p className="medieval-subtitle italic">
                "In the realm of nobles and knights, your destiny awaits..."
              </p>
            </div>
          </div>
        </div>

        {/* Game Overview */}
        <div className="medieval-card p-12 mb-12 animate-slide-up">
          <h2 className="font-medieval text-4xl text-medieval-gold-300 mb-8 glow-text text-center">
            🏰 The Realm Awaits Your Command
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4">
                ⚔️ Strategic Multiplayer Warfare
              </h3>
              <p className="medieval-text text-lg leading-relaxed">
                War of the Elector is an online multiplayer strategy game where
                players manage noble families, oversee towns, build armies, and
                engage in trade and combat. Command your noble house and forge
                alliances in a world where every decision shapes the fate of
                your dynasty.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-4">
                👑 Noble House Management
              </h3>
              <p className="medieval-text text-lg leading-relaxed">
                Each player controls a noble house where family members play
                crucial roles. Lead armies, govern regions, and complete
                missions. Manage marriages, alliances, and the growth of your
                dynasty through strategic decisions and diplomatic negotiations.
              </p>
            </div>
          </div>
        </div>

        {/* Core Gameplay Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="resource-card text-center group">
            <div className="text-5xl mb-4 group-hover:animate-float">🌳</div>
            <h3 className="font-medieval text-xl text-medieval-gold-300 mb-3">
              Family Trees
            </h3>
            <p className="medieval-text">
              Manage noble bloodlines and strategic marriages
            </p>
          </div>

          <div className="resource-card text-center group">
            <div className="text-5xl mb-4 group-hover:animate-float">🏘️</div>
            <h3 className="font-medieval text-xl text-medieval-gold-300 mb-3">
              Town Management
            </h3>
            <p className="medieval-text">
              Build and upgrade settlements with up to four buildings
            </p>
          </div>

          <div className="resource-card text-center group">
            <div className="text-5xl mb-4 group-hover:animate-float">⚔️</div>
            <h3 className="font-medieval text-xl text-medieval-gold-300 mb-3">
              Army & Combat
            </h3>
            <p className="medieval-text">
              Recruit units and engage in strategic battles
            </p>
          </div>

          <div className="resource-card text-center group">
            <div className="text-5xl mb-4 group-hover:animate-float">💰</div>
            <h3 className="font-medieval text-xl text-medieval-gold-300 mb-3">
              Resource Trade
            </h3>
            <p className="medieval-text">
              Manage wood, stone, food, and ducats
            </p>
          </div>
        </div>

        {/* Current Features & Call to Action */}
        <div className="medieval-card p-12 text-center">
          <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text">
            🚀 Version 1.0 - Now Available
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="space-y-4">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="font-medieval text-xl text-medieval-gold-300">
                Secure Authentication
              </h3>
              <p className="medieval-text">
                Robust user management and noble house security
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="font-medieval text-xl text-medieval-gold-300">
                Resource Management
              </h3>
              <p className="medieval-text">
                View, send, and receive resources and wealth
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="font-medieval text-xl text-medieval-gold-300">
                Admin Controls
              </h3>
              <p className="medieval-text">
                Exclusive administrative powers for realm oversight
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="font-script text-2xl text-medieval-gold-200 italic mb-8">
              "The realm awaits your command, noble lord..."
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
                href="/pages/rules"
                className="medieval-button-secondary group text-lg px-8 py-4"
              >
                <span className="flex items-center space-x-3">
                  <span>📜</span>
                  <span>Learn the Rules</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
