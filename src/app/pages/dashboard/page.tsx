"use client";

import { useState, useEffect } from "react";
export default function Dashboard() {
  const [resources, setResources] = useState({
    wood: 0,
    stone: 0,
    food: 0,
    ducats: 0,
  });
  const [username, setUsername] = useState({
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState(0);

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

  useEffect(() => {
    fetchResources();
    fetchUsername();
  }, []);
  const welcomePrefix = `${username}'s`;
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          {welcomePrefix} Dashboard
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Welcome to the dashboard!
        </p>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Resources:</h2>
          <ul className="space-y-2">
            <li className="bg-gray-600 p-2 rounded">
              🌲 {resources.wood} Wood
            </li>
            <li className="bg-gray-600 p-2 rounded">
              🪨 {resources.stone} Stone
            </li>
            <li className="bg-gray-600 p-2 rounded">
              🌾 {resources.food} Food
            </li>
            <li className="bg-gray-600 p-2 rounded">
              💰 {resources.ducats} Ducats
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
