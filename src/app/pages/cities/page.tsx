"use client";

import { useState, useEffect } from "react";
import { useNotification } from "@/components/Notification";
import Link from "next/link";

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
}

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification, NotificationContainer } = useNotification();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch("/api/cities");
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities);
      } else {
        addNotification("error", "Failed to load cities");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      addNotification("error", "Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medieval-gold-600 mx-auto mb-4"></div>
          <p className="text-xl text-medieval-gold-300">
            Loading your cities...
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
          <h1 className="medieval-title mb-4 glow-text">🏰 City Management</h1>
          <p className="medieval-subtitle italic">
            Manage your cities, construct buildings, and oversee your realm's
            prosperity
          </p>
        </div>

        {/* Cities List */}
        <div className="medieval-card p-8">
          <h2 className="font-medieval text-2xl text-medieval-gold-300 mb-6 text-center">
            Your Cities
          </h2>

          {cities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏰</div>
              <p className="text-xl text-medieval-steel-300 mb-4">
                You don't own any cities yet
              </p>
              <p className="text-medieval-steel-400">
                Contact an administrator to grant you a city
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/pages/cities/${city.id}`}
                  className="city-card group block"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medieval text-xl text-medieval-gold-300 mb-2 group-hover:text-medieval-gold-200 transition-colors">
                        {city.name}
                      </h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-medieval-gold-300 font-bold">
                            Tier {city.upgradeTier}
                          </div>
                          <div className="text-medieval-steel-400">
                            Upgrade Level
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-medieval-gold-300 font-bold">
                            {(city.localWealth || 0).toFixed(1)}
                          </div>
                          <div className="text-medieval-steel-400">
                            Local Wealth
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-medieval-gold-300 font-bold">
                            {city.taxRate}%
                          </div>
                          <div className="text-medieval-steel-400">
                            Tax Rate
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="text-right">
                        <div className="text-medieval-gold-300 font-bold">
                          {city.buildings.length}
                        </div>
                        <div className="text-medieval-steel-400 text-sm">
                          Buildings
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-medieval-gold-400 group-hover:text-medieval-gold-300 transition-colors">
                      →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
