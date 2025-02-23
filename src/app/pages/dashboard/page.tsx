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
    username: null,
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
    <div>
      <h1>{welcomePrefix} Dashboard</h1>

      <p>Welcome to the dashboard!</p>
      <p>you have: </p>
      <u>
        <p>{resources.wood} Wood</p>
        <p>{resources.stone} stone</p>
        <p>{resources.food} food</p>
        <p>{resources.ducats} ducats</p>
      </u>
    </div>
  );
}
