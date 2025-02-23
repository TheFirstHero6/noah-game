"use client";

import { useState } from "react";
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
  const fetchResources = async () => {
    try {
      const response = await fetch("/api/dashboard/resources");
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setResources(data);
      }
      if (!response.ok) throw new Error("Failed to fetch resources");
    } catch (error) {
      throw new Error("Failed to fetch resources");
    }
  };
  const fetchUsername = async () => {
    try {
      const response = await fetch("/api/dashboard/username");
      const data = await response.json();
      if (response.ok) {
        setUsername(data);
      }
      if (!response.ok) throw new Error("Failed to fetch username");
    } catch (error) {
      throw new Error("Failed to fetch username");
    }
  };

  if (resources) {
    fetchResources();
  }
  if (username) {
    fetchUsername();
  }
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
