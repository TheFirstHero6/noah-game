"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { transferResources } from "@/app/lib/resources";
export default function Dashboard() {
  const [resources, setResources] = useState({
    wood: 0,
    stone: 0,
    food: 0,
    ducats: 0,
  });
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState(0);
  const [userpic, setUserpic] = useState("");

  const fetchResources = async () => {
    const now = Date.now();
    if (now - lastUpdate < 1000) return;
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/resources");
      const data = await response.json();
      setResources(data);
      setLastUpdate(now);
      if (!response.ok) throw new Error("Failed to fetch resources");
    } catch (error) {
      throw new Error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsername = async () => {
    const now = Date.now();
    if (now - lastUpdate < 1000) return;
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/username");
      const data = await response.json();
      setUsername(data);
      setLoading(false);
      if (!response.ok) throw new Error("Failed to fetch username");
    } catch (error) {
      throw new Error("Failed to fetch username");
    }
  };
  const fetchUserPic = async () => {
    const now = Date.now();
    if (now - lastUpdate < 1000) return;
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/userpic");
      const data = await response.json();
      setUserpic(data);
      setLoading(false);
      if (!response.ok) throw new Error("Failed to fetch userpic");
    } catch (error) {
      throw new Error("Failed to fetch userpic");
    }
  };

  useEffect(() => {
    fetchResources();
    fetchUsername();
    fetchUserPic();
  }, []);
  const welcomePrefix = `${username}'s`;
  console.log(userpic);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black text-white p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gray-900 p-8 rounded-lg shadow-2xl border-2 border-yellow-600">
        <img
          src={userpic}
          alt="userpic"
          className="h-20 w-20 rounded-full border-2 border-yellow-400"
        />

        <h1 className="text-5xl font-bold text-center mb-6 font-serif tracking-wider text-yellow-300">
          {welcomePrefix} Dashboard
        </h1>
        <p className="text-center text-yellow-400 mb-8 italic">
          Make your decisions carefully young lord...
        </p>

        {/* Resources Section */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
          <h2 className="text-3xl font-semibold mb-6 border-b border-yellow-600 pb-2 text-yellow-300">
            Your Resources
          </h2>
          <ul className="grid grid-cols-2 gap-6">
            <li className="p-4 rounded text-center bg-orange-700 shadow-md">
              <span className="block text-3xl font-bold">{resources.wood}</span>
              <span className="text-xl">Wood</span>
            </li>
            <li className="p-4 rounded text-center bg-gray-600 shadow-md">
              <span className="block text-3xl font-bold">
                {resources.stone}
              </span>
              <span className="text-xl">Stone</span>
            </li>
            <li className="p-4 rounded text-center bg-green-700 shadow-md">
              <span className="block text-3xl font-bold">{resources.food}</span>
              <span className="text-xl">Food</span>
            </li>
            <li className="p-4 rounded text-center bg-yellow-600 shadow-md">
              <span className="block text-3xl font-bold">
                {resources.ducats}
              </span>
              <span className="text-xl">Ducats</span>
            </li>
          </ul>
        </div>
        {/* User Search Section */}
        <div className="mb-8">
          {/* <input
            type="text"
            placeholder="Search for a user..."
            className="w-full p-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          /> */}
        </div>
        {/* User List */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-3xl font-semibold mb-6 border-b border-yellow-600 pb-2 text-yellow-300">
            Users
          </h2>
          {/* {filteredUsers.length > 0 ? (
            <ul className="space-y-6">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center space-x-6 bg-gray-700 p-4 rounded-lg shadow-md"
                >
                  <img
                    src={user.imageUrl || "/default-avatar.png"}
                    alt={user.name || "User"}
                    className="w-16 h-16 rounded-full border-2 border-yellow-600"
                  />
                  <span className="text-2xl font-semibold text-yellow-200">
                    {user.name || "Unnamed User"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No users found.</p>
          )} */}
        </div>
      </div>
    </div>
  );
}
