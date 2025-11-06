"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useNotification } from "@/components/Notification";
import { useRealm } from "@/contexts/RealmContext";
import RealmRequirement from "@/components/RealmRequirement";

export default function ArmiesPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [armies, setArmies] = useState<any[]>([]);
  const [resources, setResources] = useState<any | null>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [newArmyName, setNewArmyName] = useState("");
  const [selectedArmyId, setSelectedArmyId] = useState<string>("");
  // Unit types and costs
  const unitTypes = [
    "Militia-At-Arms",
    "Pike Men",
    "Swordsmen",
    "Matchlocks",
    "Flintlocks",
    "Light Calvary",
    "Dragoons",
    "Heavy Calvary",
    "Banner Guard",
    "Light Artilery",
    "Medium Artilery",
    "Heavy Artilery",
  ] as const;
  type UnitType = (typeof unitTypes)[number];
  const [unitType, setUnitType] = useState<UnitType>("Militia-At-Arms");
  const [quantity, setQuantity] = useState<number>(1);

  const { addNotification, NotificationContainer } = useNotification();
  const { currentRealm } = useRealm();

  useEffect(() => {
    if (isLoaded && user && currentRealm) {
      Promise.all([
        fetchUserRole(),
        fetchResources(),
        fetchArmies(),
        fetchCities(),
      ]).finally(() => setLoading(false));
    } else if (isLoaded && !user) {
      setLoading(false);
    } else if (isLoaded && user && !currentRealm) {
      setLoading(false);
      addNotification("info", "Please select a realm to view armies");
    }
  }, [isLoaded, user, currentRealm]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch("/api/dashboard/user-data");
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    if (!currentRealm) return;
    try {
      const res = await fetch(`/api/dashboard/resources?realmId=${currentRealm.id}`);
      if (res.ok) {
        const data = await res.json();
        // Endpoint returns the resource object directly
        setResources(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchArmies = async () => {
    if (!currentRealm) return;
    try {
      const res = await fetch(`/api/armies?realmId=${currentRealm.id}`);
      if (res.ok) {
        const data = await res.json();
        setArmies(data.armies || []);
        const firstId = data.armies?.[0]?.id || "";
        // Ensure we always have a valid selection if possible
        if (!firstId) {
          setSelectedArmyId("");
        } else if (!selectedArmyId || !data.armies.some((a: any) => a.id === selectedArmyId)) {
          setSelectedArmyId(firstId);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCities = async () => {
    if (!currentRealm) return;
    try {
      const res = await fetch(`/api/cities?realmId=${currentRealm.id}`);
      if (res.ok) {
        const data = await res.json();
        setCities(data.cities || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const populationCap = useMemo(() => {
    // Keep in sync with POPULATION_UNIT_CAP_BY_TIER
    const capByTier: Record<number, number> = {
      1: 2,
      2: 3,
      3: 7,
      4: 10,
      5: 15,
    };
    return cities.reduce((acc, c) => acc + (capByTier[c.upgradeTier] || 0), 0);
  }, [cities]);

  const totalUnits = useMemo(() => {
    return armies.reduce(
      (sum, a) =>
        sum + (a.units?.reduce((s: number, u: any) => s + u.quantity, 0) || 0),
      0
    );
  }, [armies]);

  // Map unit types to images stored in /public
  const unitImageMap: Record<string, string> = {
    Flintlocks: "/flintlocks.png",
    Swordsmen: "/swordsman.png",
    "Pike Men": "/Pikeman.png",
    Matchlocks: "/Matchlocks.png",
    "Militia-At-Arms": "/Militia.png",
    "Light Calvary": "/light cav.png",
    "Heavy Calvary": "/heavy cav.png",
    Dragoons: "/dragoons.png",
    "Banner Guard": "/banner guard.png",
    "Light Artilery": "/light artillery.png",
    "Medium Artilery": "/medium artillery.png",
    "Heavy Artilery": "/Heavy artillery.png",
  };

  // Import unit costs from config
  const unitCosts: Record<
    UnitType,
    {
      currency: number;
      wood: number;
      stone: number;
      metal: number;
      food: number;
      livestock: number;
    }
  > = {
    "Militia-At-Arms": {
      currency: 50,
      wood: 3,
      stone: 3,
      metal: 0,
      food: 0,
      livestock: 0,
    },
    "Pike Men": {
      currency: 100,
      wood: 8,
      stone: 2,
      metal: 0,
      food: 0,
      livestock: 0,
    },
    Swordsmen: {
      currency: 150,
      wood: 3,
      stone: 0,
      metal: 6,
      food: 0,
      livestock: 0,
    },
    Matchlocks: {
      currency: 100,
      wood: 4,
      stone: 0,
      metal: 4,
      food: 0,
      livestock: 0,
    },
    Flintlocks: {
      currency: 150,
      wood: 4,
      stone: 2,
      metal: 6,
      food: 0,
      livestock: 0,
    },
    "Light Calvary": {
      currency: 150,
      wood: 3,
      stone: 0,
      metal: 6,
      food: 0,
      livestock: 4,
    },
    Dragoons: {
      currency: 150,
      wood: 4,
      stone: 2,
      metal: 6,
      food: 0,
      livestock: 4,
    },
    "Heavy Calvary": {
      currency: 300,
      wood: 3,
      stone: 0,
      metal: 10,
      food: 0,
      livestock: 4,
    },
    "Banner Guard": {
      currency: 500,
      wood: 3,
      stone: 0,
      metal: 12,
      food: 0,
      livestock: 4,
    },
    "Light Artilery": {
      currency: 150,
      wood: 10,
      stone: 5,
      metal: 5,
      food: 0,
      livestock: 0,
    },
    "Medium Artilery": {
      currency: 300,
      wood: 10,
      stone: 5,
      metal: 8,
      food: 0,
      livestock: 1,
    },
    "Heavy Artilery": {
      currency: 500,
      wood: 10,
      stone: 5,
      metal: 12,
      food: 0,
      livestock: 2,
    },
  };

  const totalCost = useMemo(() => {
    const per = unitCosts[unitType];
    return {
      currency: per.currency * quantity,
      wood: per.wood * quantity,
      stone: per.stone * quantity,
      metal: per.metal * quantity,
      food: per.food * quantity,
      livestock: per.livestock * quantity,
    };
  }, [unitType, quantity]);

  const hasResources = useMemo(() => {
    if (!resources) return false;
    return (
      resources.currency >= totalCost.currency &&
      resources.wood >= totalCost.wood &&
      resources.stone >= totalCost.stone &&
      resources.metal >= totalCost.metal &&
      resources.food >= totalCost.food &&
      resources.livestock >= totalCost.livestock
    );
  }, [resources, totalCost]);

  const atOrOverCap = useMemo(
    () => totalUnits >= populationCap,
    [totalUnits, populationCap]
  );

  const createArmy = async () => {
    if (!newArmyName.trim()) {
      addNotification("error", "Please enter an army name");
      return;
    }
    if (!currentRealm) {
      addNotification("error", "Please select a realm first");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/armies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newArmyName.trim(), realmId: currentRealm.id }),
      });
      if (res.ok) {
        addNotification("success", "Army created");
        setNewArmyName("");
        await fetchArmies();
      } else {
        const txt = await res.text();
        addNotification("error", txt || "Failed to create army");
      }
    } catch (e) {
      console.error(e);
      addNotification("error", "Error creating army");
    } finally {
      setCreating(false);
    }
  };

  const addUnits = async () => {
    // Resolve a valid army id at click time to avoid missing id in route
    const armyIdToUse = selectedArmyId || (armies[0]?.id ?? "");
    if (!armyIdToUse) {
      addNotification("info", "Create or select an army first");
      return;
    }
    if (atOrOverCap) {
      addNotification("error", "Population cap reached");
      return;
    }
    if (!hasResources) {
      addNotification("error", "Insufficient resources");
      return;
    }
    try {
      const res = await fetch(`/api/armies/${armyIdToUse}/units`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitType, quantity }),
      });
      if (res.ok) {
        addNotification("success", "Units recruited");
        await Promise.all([fetchResources(), fetchArmies()]);
      } else {
        const txt = await res.text();
        addNotification("error", txt || "Failed to add units");
      }
    } catch (e) {
      console.error(e);
      addNotification("error", "Error adding units");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medieval-gold-600 mx-auto mb-4"></div>
          <p className="medieval-text text-medieval-gold-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="medieval-title mb-4 glow-text">⚔️ Armies</h1>
          <p className="medieval-text text-lg text-medieval-steel-300 mb-8">
            Please sign in to access the armies section.
          </p>
        </div>
      </div>
    );
  }

  return (
    <RealmRequirement>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-medieval-pattern opacity-5"></div>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="medieval-title mb-4 glow-text">⚔️ Armies</h1>
          <p className="medieval-subtitle italic">
            Command your forces, recruit units, and wage war across the realm
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Army Overview */}
          <div className="medieval-card p-6">
            <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
              Your Armies
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  className="medieval-input flex-1"
                  placeholder="New army name"
                  value={newArmyName}
                  onChange={(e) => setNewArmyName(e.target.value)}
                />
                <button
                  disabled={creating}
                  onClick={createArmy}
                  className="medieval-button"
                >
                  {creating ? "Creating..." : "Create New Army"}
                </button>
              </div>

              <div className="space-y-2">
                {armies.length === 0 && (
                  <p className="medieval-text text-medieval-steel-300">
                    No armies yet.
                  </p>
                )}
                {armies.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => setSelectedArmyId(a.id)}
                    className={`p-3 border rounded-md cursor-pointer ${
                      selectedArmyId === a.id
                        ? "border-medieval-gold-400"
                        : "border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medieval text-medieval-gold-300">
                        {a.name}
                      </div>
                      <div className="text-sm text-medieval-steel-300">
                        {a.units?.reduce(
                          (s: number, u: any) => s + u.quantity,
                          0
                        ) || 0}{" "}
                        units
                      </div>
                    </div>
                    {a.units && a.units.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {a.units.map((u: any) => {
                          const src = unitImageMap[u.unitType];
                          if (src) {
                            return (
                              <div
                                key={u.id}
                                className="relative inline-block text-center"
                              >
                                <Image
                                  src={encodeURI(src)}
                                  alt={u.unitType}
                                  width={56}
                                  height={56}
                                  className="rounded-md border border-medieval-gold-600 bg-medieval-steel-900"
                                />
                                <span className="absolute -top-2 -right-2 bg-medieval-gold-600 text-medieval-steel-900 text-xs font-bold px-2 py-0.5 rounded-full border border-medieval-gold-700">
                                  {u.quantity}
                                </span>
                                <div className="mt-1 text-xs text-medieval-steel-300 whitespace-nowrap max-w-[72px] truncate">
                                  {u.unitType}
                                </div>
                              </div>
                            );
                          }
                          return (
                            <span
                              key={u.id}
                              className="text-sm text-medieval-steel-300 mr-3"
                            >
                              {u.unitType}: {u.quantity}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-medieval-steel-300">
                <div>
                  Total units: {totalUnits} / Cap: {populationCap}
                </div>
              </div>
            </div>
          </div>

          {/* Unit Recruitment */}
          <div className="medieval-card p-6">
            <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
              Unit Recruitment
            </h2>
            <div className="space-y-4">
              {resources && (
                <div className="text-lg text-medieval-steel-200">
                  <div className="mb-2 font-medieval text-medieval-gold-300">
                    Your Resources
                  </div>
                  <div className="leading-relaxed">
                    <span className="mr-4">
                      Currency:{" "}
                      <span className="font-semibold">
                        {resources.currency ?? 0}
                      </span>
                    </span>
                    <span className="mr-4">
                      Food:{" "}
                      <span className="font-semibold">
                        {resources.food ?? 0}
                      </span>
                    </span>
                    <span className="mr-4">
                      Wood:{" "}
                      <span className="font-semibold">
                        {resources.wood ?? 0}
                      </span>
                    </span>
                    <span className="mr-4">
                      Stone:{" "}
                      <span className="font-semibold">
                        {resources.stone ?? 0}
                      </span>
                    </span>
                    <span className="mr-4">
                      Metal:{" "}
                      <span className="font-semibold">
                        {resources.metal ?? 0}
                      </span>
                    </span>
                    <span>
                      Livestock:{" "}
                      <span className="font-semibold">
                        {resources.livestock ?? 0}
                      </span>
                    </span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="medieval-text text-sm">Army</label>
                  <select
                    className="medieval-input w-full"
                    value={selectedArmyId}
                    onChange={(e) => setSelectedArmyId(e.target.value)}
                  >
                    <option value="">Select army</option>
                    {armies.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="medieval-text text-sm">Unit Type</label>
                  <select
                    className="medieval-input w-full"
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value as UnitType)}
                  >
                    {unitTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="medieval-text text-sm">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    className="medieval-input w-full"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, parseInt(e.target.value || "1", 10))
                      )
                    }
                  />
                </div>
                <div className="self-end">
                  <button
                    className="medieval-button w-full"
                    onClick={addUnits}
                    disabled={!resources || !selectedArmyId}
                  >
                    Recruit Units
                  </button>
                </div>
              </div>

              <div className="text-lg text-medieval-steel-200">
                <div className="mb-2 font-medieval text-medieval-gold-300">
                  Cost
                </div>
                <div className="leading-relaxed">
                  <span className="mr-4">
                    Currency:{" "}
                    <span className="font-semibold">{totalCost.currency}</span>
                  </span>
                  <span className="mr-4">
                    Food:{" "}
                    <span className="font-semibold">{totalCost.food}</span>
                  </span>
                  <span className="mr-4">
                    Wood:{" "}
                    <span className="font-semibold">{totalCost.wood}</span>
                  </span>
                  <span className="mr-4">
                    Stone:{" "}
                    <span className="font-semibold">{totalCost.stone}</span>
                  </span>
                  <span className="mr-4">
                    Metal:{" "}
                    <span className="font-semibold">{totalCost.metal}</span>
                  </span>
                  <span>
                    Livestock:{" "}
                    <span className="font-semibold">{totalCost.livestock}</span>
                  </span>
                </div>
                {!hasResources && (
                  <div className="text-red-400 mt-2">
                    Insufficient resources
                  </div>
                )}
                {atOrOverCap && (
                  <div className="text-red-400 mt-1">
                    Population cap reached
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Army Management */}
        <div className="medieval-card p-6 mt-8">
          <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
            Army Management
          </h2>
          {!selectedArmyId ? (
            <p className="medieval-text text-medieval-steel-300">
              Select an army above to view its composition.
            </p>
          ) : (
            <div>
              {armies
                .filter((a) => a.id === selectedArmyId)
                .map((a) => (
                  <div key={a.id}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medieval text-medieval-gold-300 text-lg">
                        {a.name}
                      </div>
                      <div className="text-sm text-medieval-steel-300">
                        {a.units?.reduce(
                          (s: number, u: any) => s + u.quantity,
                          0
                        ) || 0}{" "}
                        units
                      </div>
                    </div>
                    {a.units && a.units.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {a.units.map((u: any) => {
                          const src = unitImageMap[u.unitType];
                          if (src) {
                            return (
                              <div
                                key={u.id}
                                className="relative inline-block text-center"
                              >
                                <Image
                                  src={encodeURI(src)}
                                  alt={u.unitType}
                                  width={64}
                                  height={64}
                                  className="rounded-md border border-medieval-gold-600 bg-medieval-steel-900"
                                />
                                <span className="absolute -top-2 -right-2 bg-medieval-gold-600 text-medieval-steel-900 text-xs font-bold px-2 py-0.5 rounded-full border border-medieval-gold-700">
                                  {u.quantity}
                                </span>
                                <div className="mt-1 text-xs text-medieval-steel-300 whitespace-nowrap max-w-[96px] truncate">
                                  {u.unitType}
                                </div>
                              </div>
                            );
                          }
                          return (
                            <span
                              key={u.id}
                              className="text-sm text-medieval-steel-300 mr-3"
                            >
                              {u.unitType}: {u.quantity}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="medieval-text text-medieval-steel-300">
                        No units in this army yet.
                      </p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Unit Types Overview */}
        <div className="medieval-card p-6 mt-8">
          <h2 className="font-medieval text-xl text-medieval-gold-300 mb-6">
            Available Unit Types
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unitTypes.map((t) => {
              const img = unitImageMap[t];
              const costs = unitCosts[t];
              return (
                <div
                  key={t}
                  className="bg-gradient-to-br from-background/50 to-background/30 p-4 rounded-lg border border-primary/30"
                >
                  <div className="flex items-center mb-3">
                    {img ? (
                      <Image
                        src={encodeURI(img)}
                        alt={t}
                        width={48}
                        height={48}
                        className="rounded-md border border-medieval-gold-600 bg-medieval-steel-900 mr-3"
                      />
                    ) : (
                      <span className="text-2xl mr-3">⚔️</span>
                    )}
                    <h3 className="font-medieval text-lg text-medieval-gold-300">
                      {t}
                    </h3>
                  </div>
                  <div className="text-sm text-medieval-steel-300">
                    <div>
                      Cost:{" "}
                      <span className="font-semibold">{costs.currency}</span>{" "}
                      Currency,{" "}
                      <span className="font-semibold">{costs.food}</span> Food,{" "}
                      <span className="font-semibold">{costs.wood}</span> Wood,{" "}
                      <span className="font-semibold">{costs.stone}</span>{" "}
                      Stone,{" "}
                      <span className="font-semibold">{costs.metal}</span>{" "}
                      Metal,{" "}
                      <span className="font-semibold">{costs.livestock}</span>{" "}
                      Livestock
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
      </div>

      <NotificationContainer />
    </div>
    </RealmRequirement>
  );
}
