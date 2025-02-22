"use client";

import React from "react";
import { useState } from "react";

export default async function Dashboard() {
  const [resources, setResources] = useState({
    wood: "0",
    stone: "0",
    food: "0",
    ducats: "0",
  });
  console.log("Current Wood Count:", resources.wood);

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) console.log(await response.json());

      if (!response.ok) throw new Error("Failed to fetch resources");
      const data = await response.json();
      console.log(data);
      setResources(data);
    } catch (error) {
      throw new Error("Failed to fetch resources");
    }
  };

  const updateResources = async (newResources: any) => {
    setResources(newResources);
  };

  return (
    <div>
      <h2>Resource Counts:</h2>
      {Object.entries(resources).map(([resource, amount]) => (
        <div key={resource}>
          {resource}: {amount}
        </div>
      ))}
      <button onClick={fetchResources}>cheese</button>
    </div>
  );
}
