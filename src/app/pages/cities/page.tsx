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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-4 sm:p-6 lg:p-8 pt-20">
      <NotificationContainer />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-medieval-pattern opacity-5"></div>

      <div className="relative w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="medieval-title mb-4 glow-text animate-text-glow">
            🏰 City Management
          </h1>
          <p className="medieval-subtitle italic animate-slide-up">
            Manage your cities, construct buildings, and oversee your realm's
            prosperity
          </p>
        </div>

        {/* Cities List */}
        <div className="medieval-card p-6 sm:p-8 lg:p-10 animate-slide-up">
          <h2 className="font-medieval text-2xl sm:text-3xl text-medieval-gold-300 mb-8 text-center glow-text">
            Your Cities
          </h2>

          {cities.length === 0 ? (
            <div className="text-center py-16 animate-scale-in">
              <div className="text-6xl sm:text-7xl mb-6 animate-bounce-gentle">
                🏰
              </div>
              <p className="text-xl sm:text-2xl text-medieval-steel-300 mb-4 font-medieval">
                You don't own any cities yet
              </p>
              <p className="text-medieval-steel-400 text-lg">
                Contact an administrator to grant you a city
              </p>
            </div>
          ) : (
            <div className="responsive-grid-lg">
              {cities.map((city, index) => (
                <Link
                  key={city.id}
                  href={`/pages/cities/${city.id}`}
                  className="city-card group block animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medieval text-xl sm:text-2xl text-medieval-gold-300 group-hover:text-medieval-gold-200 transition-colors duration-300">
                        {city.name}
                      </h3>
                      <div className="text-medieval-gold-400 group-hover:text-medieval-gold-300 transition-colors duration-300 text-2xl">
                        →
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-medieval-steel-800/50 rounded-xl border border-medieval-gold-600">
                        <div className="text-lg sm:text-xl text-medieval-gold-300 font-bold">
                          Tier {city.upgradeTier}
                        </div>
                        <div className="text-xs sm:text-sm text-medieval-steel-400">
                          Upgrade Level
                        </div>
                      </div>
                      <div className="text-center p-3 bg-medieval-steel-800/50 rounded-xl border border-medieval-gold-600">
                        <div className="text-lg sm:text-xl text-medieval-gold-300 font-bold">
                          {(city.localWealth || 0).toFixed(1)}
                        </div>
                        <div className="text-xs sm:text-sm text-medieval-steel-400">
                          Local Wealth
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-medieval-steel-800/50 rounded-xl border border-medieval-gold-600">
                        <div className="text-lg sm:text-xl text-medieval-gold-300 font-bold">
                          {city.taxRate}%
                        </div>
                        <div className="text-xs sm:text-sm text-medieval-steel-400">
                          Tax Rate
                        </div>
                      </div>
                      <div className="text-center p-3 bg-medieval-steel-800/50 rounded-xl border border-medieval-gold-600">
                        <div className="text-lg sm:text-xl text-medieval-gold-300 font-bold">
                          {city.buildings.length}
                        </div>
                        <div className="text-xs sm:text-sm text-medieval-steel-400">
                          Buildings
                        </div>
                      </div>
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
