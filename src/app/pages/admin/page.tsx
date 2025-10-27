"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useNotification } from "@/components/Notification";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface City {
  id: string;
  name: string;
  ownerId: string;
  upgradeTier: number;
  localWealth: number;
  taxRate: number;
}

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newCityName, setNewCityName] = useState("");
  const [cityTier, setCityTier] = useState(1);
  const [isCreatingCity, setIsCreatingCity] = useState(false);
  const [isAdvancingTurn, setIsAdvancingTurn] = useState(false);
  const [showTurnModal, setShowTurnModal] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const { addNotification, NotificationContainer } = useNotification();

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserRole();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (userRole === "ADMIN") {
      fetchUsers();
      fetchCities();
    }
  }, [userRole]);

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

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        addNotification("error", "Failed to load users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      addNotification("error", "Failed to load users");
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch("/api/admin/cities");
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities);
      } else {
        addNotification("error", "Failed to load cities");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      addNotification("error", "Failed to load cities");
    }
  };

  const createCity = async () => {
    if (!selectedUser || !newCityName.trim()) {
      addNotification("error", "Please select a user and enter a city name");
      return;
    }

    setIsCreatingCity(true);
    try {
      const response = await fetch("/api/admin/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          name: newCityName.trim(),
          tier: cityTier,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification("success", data.message);
        setNewCityName("");
        setSelectedUser("");
        fetchCities();
      } else {
        addNotification("error", data.error || "Failed to create city");
      }
    } catch (error) {
      console.error("Error creating city:", error);
      addNotification("error", "Failed to create city");
    } finally {
      setIsCreatingCity(false);
    }
  };

  const advanceTurn = async () => {
    setIsAdvancingTurn(true);
    try {
      const response = await fetch("/api/admin/advance-turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        addNotification("success", data.message);
        fetchCities(); // Refresh cities to see updated wealth
      } else {
        addNotification("error", data.error || "Failed to advance turn");
      }
    } catch (error) {
      console.error("Error advancing turn:", error);
      addNotification("error", "Failed to advance turn");
    } finally {
      setIsAdvancingTurn(false);
      setShowTurnModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medieval-gold-600 mx-auto mb-4"></div>
          <p className="text-xl text-medieval-gold-300">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-medieval-steel-300">
            Please sign in to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  if (userRole !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="medieval-title mb-4 glow-text">🚫 Access Denied</h1>
          <p className="text-xl text-medieval-steel-300">
            You do not have permission to access the admin panel.
          </p>
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
        <div className="text-center mb-12">
          <h1 className="medieval-title mb-4 glow-text">👑 Admin Panel</h1>
          <p className="medieval-subtitle italic">
            Manage the realm, grant cities, and advance the turn
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Grant City */}
          <div className="medieval-card p-6">
            <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
              Grant City
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-medieval text-lg text-medieval-gold-300 mb-2">
                  Select User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="medieval-input w-full"
                >
                  <option value="">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medieval text-lg text-medieval-gold-300 mb-2">
                  City Name
                </label>
                <input
                  type="text"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  className="medieval-input w-full"
                  placeholder="Enter city name"
                />
              </div>

              <div>
                <label className="block font-medieval text-lg text-medieval-gold-300 mb-2">
                  City Tier
                </label>
                <select
                  value={cityTier}
                  onChange={(e) => setCityTier(parseInt(e.target.value))}
                  className="medieval-input w-full"
                >
                  <option value={1}>Tier 1 (10 income/turn)</option>
                  <option value={2}>Tier 2 (15 income/turn)</option>
                  <option value={3}>Tier 3 (40 income/turn)</option>
                  <option value={4}>Tier 4 (55 income/turn)</option>
                  <option value={5}>Tier 5 (70 income/turn)</option>
                </select>
              </div>

              <button
                onClick={createCity}
                disabled={
                  isCreatingCity || !selectedUser || !newCityName.trim()
                }
                className="medieval-button w-full"
              >
                {isCreatingCity ? "Creating..." : "Grant City"}
              </button>
            </div>
          </div>

          {/* Turn Management */}
          <div className="medieval-card p-6">
            <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
              Turn Management
            </h2>

            <div className="space-y-4">
              <p className="text-medieval-steel-300">
                Advance to the next turn to process income, taxes, and resource
                generation for all players.
              </p>

              <button
                onClick={() => setShowTurnModal(true)}
                disabled={isAdvancingTurn}
                className="medieval-button w-full"
              >
                {isAdvancingTurn ? "Processing..." : "Advance to Next Turn"}
              </button>
            </div>
          </div>
        </div>

        {/* Cities Overview */}
        <div className="medieval-card p-6 mt-8">
          <h2 className="font-medieval text-xl text-medieval-gold-300 mb-4">
            Cities Overview
          </h2>

          {cities.length === 0 ? (
            <p className="text-medieval-steel-400 text-center py-4">
              No cities have been created yet
            </p>
          ) : (
            <div className="grid gap-4">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between p-4 bg-medieval-steel-800 rounded border"
                >
                  <div>
                    <div className="font-medieval text-lg text-medieval-gold-300">
                      {city.name}
                    </div>
                    <div className="text-sm text-medieval-steel-400">
                      Tier {city.upgradeTier} • {city.taxRate}% Tax •{" "}
                      {(city.localWealth || 0).toFixed(1)} Wealth
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Turn Confirmation Modal */}
        {showTurnModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="medieval-card p-6 max-w-md mx-4">
              <h3 className="font-medieval text-xl text-medieval-gold-300 mb-4">
                Advance to Next Turn
              </h3>
              <p className="text-medieval-steel-300 mb-6">
                Are you sure you want to go to the next turn? This will mint new
                resources and income for all players.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowTurnModal(false)}
                  className="medieval-button-secondary flex-1"
                >
                  No
                </button>
                <button
                  onClick={advanceTurn}
                  className="medieval-button flex-1"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
