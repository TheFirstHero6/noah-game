"use client";

import { useState } from "react";

export default function Dashboard() {
  const fetchResources = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) console.log(await response.json());

      if (!response.ok) throw new Error("Failed to fetch resources");
    } catch (error) {
      throw new Error("Failed to fetch resources");
    }
  };
  console.log("Resources fetched successfully");
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>
      <button onClick={fetchResources}>Fetch Resources</button>
    </div>
  );
}
