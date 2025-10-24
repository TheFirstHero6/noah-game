"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useNotification } from "@/components/Notification";
import Link from "next/link";
import { MAX_BUILDINGS_PER_CITY } from "@/app/lib/game-config";

interface City {
  id: string;
  name: string;
  upgradeTier: number;
  localWealth: number;
  taxRate: number;
  buildings: Building[];
}

interface Building {
  id: string;
  name: string;
  rarity: string;
  tier: number;
}

interface BuildingTemplate {
  name: string;
  rarity: string;
  cost: {
    currency: number;
    wood: number;
    stone: number;
    metal: number;
    food: number;
    livestock: number;
  };
}

const BUILDING_INDEX: BuildingTemplate[] = [
  {
    name: "Sawmill",
    rarity: "Common",
    cost: { currency: 100, wood: 0, stone: 0, metal: 0, food: 0, livestock: 0 },
  },
  {
    name: "Quarry",
    rarity: "Common",
    cost: { currency: 100, wood: 0, stone: 0, metal: 0, food: 0, livestock: 0 },
  },
  {
    name: "Forge",
    rarity: "Common",
    cost: {
      currency: 150,
      wood: 50,
      stone: 0,
      metal: 0,
      food: 0,
      livestock: 0,
    },
  },
  {
    name: "Farm",
    rarity: "Common",
    cost: { currency: 80, wood: 20, stone: 0, metal: 0, food: 0, livestock: 0 },
  },
  {
    name: "Market",
    rarity: "Rare",
    cost: {
      currency: 200,
      wood: 100,
      stone: 50,
      metal: 0,
      food: 0,
      livestock: 0,
    },
  },
];

export default function CityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cityId = params.id as string;

  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [taxRate, setTaxRate] = useState(5);
  const [isUpdatingTax, setIsUpdatingTax] = useState(false);
  const [isBuilding, setIsBuilding] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isUpgradingBuilding, setIsUpgradingBuilding] = useState<string | null>(
    null
  );

  const { addNotification, NotificationContainer } = useNotification();

  useEffect(() => {
    if (cityId) {
      fetchCity();
    }
  }, [cityId]);

  const fetchCity = async () => {
    try {
      const response = await fetch(`/api/cities/${cityId}`);
      if (response.ok) {
        const data = await response.json();
        setCity(data.city);
        setNewName(data.city.name);
        setTaxRate(data.city.taxRate);
      } else {
        addNotification("error", "Failed to load city details");
        router.push("/pages/cities");
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      addNotification("error", "Failed to load city details");
    } finally {
      setLoading(false);
    }
  };

  const updateCityName = async () => {
    if (!newName.trim()) {
      addNotification("error", "City name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`/api/cities/${cityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (response.ok) {
        setCity((prev) => (prev ? { ...prev, name: newName.trim() } : null));
        setIsEditingName(false);
        addNotification("success", "City name updated successfully");
      } else {
        const data = await response.json();
        addNotification("error", data.error || "Failed to update city name");
      }
    } catch (error) {
      console.error("Error updating city name:", error);
      addNotification("error", "Failed to update city name");
    }
  };

  const updateTaxRate = async () => {
    if (taxRate < 0 || taxRate > 100 || !Number.isInteger(taxRate)) {
      addNotification(
        "error",
        "Tax rate must be a whole number between 0% and 100%"
      );
      return;
    }

    setIsUpdatingTax(true);
    try {
      const response = await fetch(`/api/cities/${cityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taxRate }),
      });

      if (response.ok) {
        setCity((prev) => (prev ? { ...prev, taxRate } : null));
        addNotification("success", "Tax rate updated successfully");
      } else {
        const data = await response.json();
        addNotification("error", data.error || "Failed to update tax rate");
      }
    } catch (error) {
      console.error("Error updating tax rate:", error);
      addNotification("error", "Failed to update tax rate");
    } finally {
      setIsUpdatingTax(false);
    }
  };

  const buildBuilding = async (buildingTemplate: BuildingTemplate) => {
    setIsBuilding(buildingTemplate.name);
    try {
      const response = await fetch(`/api/cities/${cityId}/build`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: buildingTemplate.name,
          rarity: buildingTemplate.rarity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification("success", data.message);
        fetchCity(); // Refresh city data
      } else {
        addNotification("error", data.error || "Failed to build structure");
      }
    } catch (error) {
      console.error("Error building structure:", error);
      addNotification("error", "Failed to build structure");
    } finally {
      setIsBuilding(null);
    }
  };

  const upgradeCity = async () => {
    if (city.upgradeTier >= 5) {
      addNotification("error", "City is already at maximum tier (5)");
      return;
    }

    const nextTier = city.upgradeTier + 1;
    const upgradeCosts = {
      2: { currency: 100, wood: 20, stone: 20 },
      3: { currency: 300, wood: 40, stone: 40 },
      4: { currency: 900, wood: 90, stone: 90 },
      5: { currency: 2700, wood: 180, stone: 180 },
    };

    const costs = upgradeCosts[nextTier];
    if (!costs) {
      addNotification("error", "Invalid upgrade tier");
      return;
    }

    setIsUpgrading(true);
    try {
      const response = await fetch(`/api/cities/${cityId}/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetTier: nextTier }),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification("success", data.message);
        fetchCity(); // Refresh city data
      } else {
        addNotification("error", data.error || "Failed to upgrade city");
      }
    } catch (error) {
      console.error("Error upgrading city:", error);
      addNotification("error", "Failed to upgrade city");
    } finally {
      setIsUpgrading(false);
    }
  };

  const upgradeBuilding = async (buildingId: string, currentTier: number) => {
    if (currentTier >= 3) {
      addNotification("error", "Building is already at maximum tier (3)");
      return;
    }

    setIsUpgradingBuilding(buildingId);
    try {
      const response = await fetch(
        `/api/cities/${cityId}/buildings/${buildingId}/upgrade`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok) {
        addNotification("success", data.message);
        fetchCity(); // Refresh city data
      } else {
        addNotification("error", data.error || "Failed to upgrade building");
      }
    } catch (error) {
      console.error("Error upgrading building:", error);
      addNotification("error", "Failed to upgrade building");
    } finally {
      setIsUpgradingBuilding(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medieval-gold-600 mx-auto mb-4"></div>
          <p className="text-xl text-medieval-gold-300">
            Loading city details...
          </p>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-medieval-steel-300">City not found</p>
          <Link
            href="/pages/cities"
            className="text-medieval-gold-300 hover:text-medieval-gold-200"
          >
            Return to Cities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8">
      <NotificationContainer />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-medieval-pattern opacity-5"></div>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/pages/cities"
              className="text-medieval-gold-300 hover:text-medieval-gold-200 mb-2 inline-block"
            >
              ← Back to Cities
            </Link>
            <h1 className="medieval-title glow-text">{city.name}</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* City Details */}
          <div className="medieval-card p-6">
            <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
              City Information
            </h2>

            {/* City Name */}
            <div className="mb-6">
              <label className="block font-medieval text-lg text-medieval-gold-300 mb-2">
                City Name
              </label>
              {isEditingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="medieval-input flex-1"
                    placeholder="Enter city name"
                  />
                  <button onClick={updateCityName} className="medieval-button">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setNewName(city.name);
                    }}
                    className="medieval-button-secondary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{city.name}</span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-medieval-gold-300 hover:text-medieval-gold-200"
                  >
                    ✏️
                  </button>
                </div>
              )}
            </div>

            {/* City Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-medieval-steel-800 rounded border">
                <div className="text-2xl font-bold text-medieval-gold-300">
                  Tier {city.upgradeTier}
                </div>
                <div className="text-sm text-medieval-steel-400">
                  Upgrade Level
                </div>
              </div>
              <div className="text-center p-4 bg-medieval-steel-800 rounded border">
                <div className="text-2xl font-bold text-medieval-gold-300">
                  {(city.localWealth || 0).toFixed(1)}
                </div>
                <div className="text-sm text-medieval-steel-400">
                  Local Wealth
                </div>
              </div>
              <div className="text-center p-4 bg-medieval-steel-800 rounded border">
                <div className="text-2xl font-bold text-medieval-gold-300">
                  {city.buildings.length}/{MAX_BUILDINGS_PER_CITY}
                </div>
                <div className="text-sm text-medieval-steel-400">Buildings</div>
              </div>
            </div>

            {/* City Upgrade */}
            {city.upgradeTier < 5 && (
              <div className="mb-6">
                <h3 className="font-medieval text-lg text-medieval-gold-300 mb-3">
                  City Upgrade
                </h3>
                <div className="bg-gradient-to-r from-background/30 to-background/30 p-4 rounded-lg border border-primary/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medieval text-medieval-gold-300">
                        Upgrade to Tier {city.upgradeTier + 1}
                      </div>
                      <div className="text-sm text-medieval-steel-400">
                        {(() => {
                          const nextTier = city.upgradeTier + 1;
                          const costs = {
                            2: { currency: 100, wood: 20, stone: 20 },
                            3: { currency: 300, wood: 40, stone: 40 },
                            4: { currency: 900, wood: 90, stone: 90 },
                            5: { currency: 2700, wood: 180, stone: 180 },
                          }[nextTier];
                          return costs
                            ? `Cost: ${costs.currency} currency, ${costs.wood} wood, ${costs.stone} stone`
                            : "";
                        })()}
                      </div>
                    </div>
                    <button
                      onClick={upgradeCity}
                      disabled={isUpgrading}
                      className="medieval-button"
                    >
                      {isUpgrading ? "Upgrading..." : "Upgrade City"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tax Rate */}
            <div className="mb-6">
              <label className="block font-medieval text-lg text-medieval-gold-300 mb-2">
                Tax Rate: {taxRate}%
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="medieval-input w-20 text-center"
                />
                <button
                  onClick={updateTaxRate}
                  disabled={isUpdatingTax}
                  className="medieval-button"
                >
                  {isUpdatingTax ? "Updating..." : "Update"}
                </button>
              </div>
              <p className="text-sm text-medieval-steel-400 mt-1">
                Tax rate can be set to any whole number between 0% and 100%
              </p>
            </div>
          </div>

          {/* Buildings */}
          <div className="medieval-card p-6">
            <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
              Buildings ({city.buildings.length})
            </h2>

            {city.buildings.length === 0 ? (
              <p className="text-medieval-steel-400 text-center py-4">
                No buildings constructed yet
              </p>
            ) : (
              <div className="space-y-2">
                {city.buildings.map((building) => (
                  <div
                    key={building.id}
                    className="flex items-center justify-between p-3 bg-medieval-steel-800 rounded border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medieval text-medieval-gold-300">
                          {building.name}
                        </span>
                        <span className="text-sm text-medieval-steel-400">
                          ({building.rarity})
                        </span>
                        <span className="text-xs bg-medieval-gold-600 text-medieval-gold-100 px-2 py-1 rounded">
                          Tier {building.tier}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {building.tier < 3 && (
                        <button
                          onClick={() =>
                            upgradeBuilding(building.id, building.tier)
                          }
                          disabled={isUpgradingBuilding === building.id}
                          className="px-3 py-1 bg-medieval-gold-600 hover:bg-medieval-gold-700 text-medieval-gold-100 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpgradingBuilding === building.id
                            ? "Upgrading..."
                            : `Upgrade to T${building.tier + 1}`}
                        </button>
                      )}
                      {building.tier >= 3 && (
                        <span className="text-xs text-medieval-steel-400">
                          Max Tier
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Building Construction */}
        <div className="medieval-card p-6 mt-8">
          <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
            Construct Buildings
          </h2>

          {/* Building Limits Warning */}
          {city.buildings.length >= MAX_BUILDINGS_PER_CITY && (
            <div className="mb-4 p-4 bg-medieval-red-900 border border-medieval-red-600 rounded">
              <div className="flex items-center">
                <span className="text-medieval-red-300 mr-2">⚠️</span>
                <div>
                  <div className="font-medieval text-medieval-red-300">
                    Building Limit Reached
                  </div>
                  <div className="text-sm text-medieval-red-400">
                    This city has reached its maximum capacity of{" "}
                    {MAX_BUILDINGS_PER_CITY} buildings. All cities can have
                    exactly {MAX_BUILDINGS_PER_CITY} buildings.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {BUILDING_INDEX.map((building) => (
              <div
                key={building.name}
                className="flex items-center justify-between p-4 bg-medieval-steel-800 rounded border"
              >
                <div className="flex-1">
                  <div className="font-medieval text-lg text-medieval-gold-300">
                    {building.name}
                  </div>
                  <div className="text-sm text-medieval-steel-400 mb-2">
                    {building.rarity} Building
                  </div>
                  <div className="text-sm text-medieval-steel-300">
                    Cost:{" "}
                    {Object.entries(building.cost)
                      .filter(([_, value]) => value > 0)
                      .map(([resource, value]) => `${value} ${resource}`)
                      .join(", ")}
                  </div>
                </div>
                <button
                  onClick={() => buildBuilding(building)}
                  disabled={
                    isBuilding === building.name ||
                    city.buildings.length >= MAX_BUILDINGS_PER_CITY
                  }
                  className="medieval-button"
                >
                  {isBuilding === building.name
                    ? "Building..."
                    : city.buildings.length >= MAX_BUILDINGS_PER_CITY
                    ? "Limit Reached"
                    : "Build"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
