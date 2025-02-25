"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import logo from "./logo.png";

export default function GameInfo() {
  const { user } = useUser();
  const username = user?.firstName;
  const welcomeSuffix = username ? `, ${username}` : "";
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-800 to-black pt-96 mt-20">
      <div className="w-full max-w-3xl bg-gray-900 p-8 rounded-lg shadow-2xl border border-yellow-600 text-center">
        {/* Header Section with Logo & Welcome Message */}
        <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
          <Image
            src={logo}
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-300 tracking-wider">
            Welcome to the War of the Elector{welcomeSuffix}!
          </h1>
        </div>

        {/* Introductory Description */}
        <p className="mt-6 text-gray-300 text-lg">
          Get ready for the release of v1, which includes a few key features
        </p>
        <ul className="mt-4 list-disc list-inside text-gray-300 text-lg">
          <li>Robust user management and authentication</li>
          <li>Resource management and transferring mechanics</li>
          <li>Exclusive admin controls for Noah</li>
        </ul>

        {/* Game Rules Rundown */}
        <p className="mt-6 text-gray-300 text-lg">
          <strong>Game Rules Rundown:</strong> Use the items at your disposal to
          contract agreements and levy favor, manage your family tree wisely(i'm
          adding a gamerules page at some point, might be like v1.1 because it
          will be super easy but non-essential)
        </p>

        {/* Interactive Details Toggle */}
        <div className="mt-8">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-6 py-3 bg-yellow-600 text-black font-bold rounded hover:bg-yellow-500 transition"
          >
            {showDetails ? "Hide Details" : "More Details"}
          </button>
          {showDetails && (
            <div className="mt-4 text-gray-200 text-lg">
              <p>
                Stay tuned for more features and updates as I continue to make
                the app a more robust and complete experience v2 features will
                most likely include
                <ul className="mt-4 list-disc list-inside text-gray-300 text-lg">
                  <li>Updated Ui</li>
                  <li>Family Tree Management and Viewing</li>
                  <li>Up-to-date Game map</li>
                </ul>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
