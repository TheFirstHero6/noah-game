"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsPage() {
  const { theme, setTheme, isLoading } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const themes = [
    {
      id: "royal-court",
      name: "Royal Court",
      description:
        "Majestic golden halls with regal crimson banners and polished steel armor",
      colors: ["#eab308", "#64748b", "#dc2626"],
      icon: "🏰",
    },
    {
      id: "forest-kingdom",
      name: "Forest Kingdom",
      description:
        "Vibrant emerald forests with golden sunlight filtering through ancient trees",
      colors: ["#22c55e", "#65a30d", "#eab308"],
      icon: "🌲",
    },
    {
      id: "mystical-wizard",
      name: "Mystical Wizard",
      description:
        "Enchanted purple mists with shimmering cyan magic and ethereal lavender glows",
      colors: ["#a855f7", "#c084fc", "#06b6d4"],
      icon: "🔮",
    },
    {
      id: "dragons-lair",
      name: "Dragon's Lair",
      description:
        "Blazing crimson flames with molten orange embers and deep volcanic shadows",
      colors: ["#dc2626", "#991b1b", "#ea580c"],
      icon: "🐉",
    },
  ];

  // Update selected theme when context theme changes
  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    console.log("Theme selected:", themeId);
  };

  const saveThemeToDatabase = async () => {
    setIsSaving(true);
    setSaveMessage("");

    try {
      console.log("Attempting to save theme:", selectedTheme);

      const response = await fetch("/api/dashboard/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme: selectedTheme }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          `Failed to save theme: ${response.status} - ${
            errorData.error || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      console.log("Theme saved successfully:", data);

      // Update the context theme
      setTheme(selectedTheme as any);

      setSaveMessage("Theme saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving theme:", error);
      setSaveMessage(
        `Failed to save theme: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setTimeout(() => setSaveMessage(""), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex flex-col items-center justify-center pt-32">
        <div className="medieval-card p-12 animate-fade-in">
          <div className="text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <h1 className="medieval-title mb-4 glow-text">
              Loading Settings...
            </h1>
            <p className="medieval-subtitle italic">
              "Preparing your realm's configuration"
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex flex-col items-center pt-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-medieval-pattern opacity-5"></div>

      <div className="relative w-full max-w-4xl">
        <div className="medieval-card p-12 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="medieval-title mb-4 glow-text">⚙️ Realm Settings</h1>
            <p className="medieval-subtitle italic">
              "Customize your kingdom's appearance to match your noble house's
              preferences"
            </p>
          </div>

          <div className="medieval-divider"></div>

          {/* Theme Selection Section */}
          <section className="mb-12">
            <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
              🎨 Theme Selection
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {themes.map((themeOption) => (
                <div
                  key={themeOption.id}
                  onClick={() => handleThemeChange(themeOption.id)}
                  className={`theme-card group cursor-pointer transition-all duration-300 ${
                    selectedTheme === themeOption.id
                      ? "ring-4 ring-medieval-gold-500 shadow-glow-gold"
                      : "hover:shadow-glow-gold"
                  }`}
                >
                  <div className="p-6">
                    {/* Theme Preview */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-4xl">{themeOption.icon}</div>
                      <div>
                        <h3 className="font-medieval text-xl text-medieval-gold-300 mb-2">
                          {themeOption.name}
                        </h3>
                        <p className="text-sm text-foreground">
                          {themeOption.description}
                        </p>
                      </div>
                    </div>

                    {/* Color Palette Preview */}
                    <div className="flex space-x-2 mb-4">
                      {themeOption.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-medieval-gold-600"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>

                    {/* Selection Indicator */}
                    <div className="flex items-center justify-center">
                      {selectedTheme === themeOption.id ? (
                        <div className="flex items-center space-x-2 text-primary">
                          <span className="text-xl">✓</span>
                          <span className="font-medieval">
                            {themeOption.id === theme ? "Active" : "Selected"}
                          </span>
                        </div>
                      ) : (
                        <div className="text-secondary">Click to select</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="medieval-divider"></div>

          {/* Save Message */}
          {saveMessage && (
            <div className="mb-6 p-4 rounded-lg border-2 text-center">
              {saveMessage.includes("successfully") ? (
                <div className="text-success font-medieval text-lg">
                  ✅ {saveMessage}
                </div>
              ) : (
                <div className="text-error font-medieval text-lg">
                  ❌ {saveMessage}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={saveThemeToDatabase}
              disabled={isSaving}
              className="medieval-button group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center space-x-2">
                <span>{isSaving ? "⏳" : "💾"}</span>
                <span>{isSaving ? "Saving..." : "Save Theme"}</span>
              </span>
            </button>

            <Link
              href="/pages/dashboard"
              className="medieval-button-secondary group"
            >
              <span className="flex items-center space-x-2">
                <span>🏰</span>
                <span>Return to Court</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
