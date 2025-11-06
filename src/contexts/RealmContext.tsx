"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Realm {
  id: string;
  name: string;
  code: string;
  logo: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string | null;
    imageUrl: string | null;
  };
  members: Array<{
    id: string;
    role: "OWNER" | "ADMIN" | "BASIC";
    joinedAt: string;
    user: {
      id: string;
      name: string | null;
      imageUrl: string | null;
    };
  }>;
  memberRole?: "OWNER" | "ADMIN" | "BASIC";
}

interface RealmContextType {
  currentRealm: Realm | null;
  setCurrentRealm: (realm: Realm | null) => void;
  userRealms: Realm[];
  setUserRealms: (realms: Realm[]) => void;
  isLoading: boolean;
  refreshRealms: () => Promise<void>;
}

const RealmContext = createContext<RealmContextType | undefined>(undefined);

export function RealmProvider({ children }: { children: ReactNode }) {
  const [currentRealm, setCurrentRealmState] = useState<Realm | null>(null);
  const [userRealms, setUserRealms] = useState<Realm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshRealms = async () => {
    try {
      const response = await fetch("/api/realms");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserRealms(data.realms);

          // If current realm is set, update it with fresh data
          const currentRealmId = currentRealm?.id || localStorage.getItem("currentRealmId");
          if (currentRealmId) {
            const updated = data.realms.find((r: Realm) => r.id === currentRealmId);
            if (updated) {
              setCurrentRealmState(updated);
            } else {
              // Current realm no longer exists or user lost access
              // Auto-select "Imperium Fragmentum" if available, otherwise first realm
              const imperiumRealm = data.realms.find((r: Realm) => r.name === "Imperium Fragmentum");
              if (imperiumRealm) {
                setCurrentRealmState(imperiumRealm);
                localStorage.setItem("currentRealmId", imperiumRealm.id);
              } else if (data.realms.length > 0) {
                setCurrentRealmState(data.realms[0]);
                localStorage.setItem("currentRealmId", data.realms[0].id);
              } else {
                setCurrentRealmState(null);
                localStorage.removeItem("currentRealmId");
              }
            }
          } else if (data.realms.length > 0) {
            // No realm selected - auto-select "Imperium Fragmentum" if available
            const imperiumRealm = data.realms.find((r: Realm) => r.name === "Imperium Fragmentum");
            if (imperiumRealm) {
              setCurrentRealmState(imperiumRealm);
              localStorage.setItem("currentRealmId", imperiumRealm.id);
            } else if (data.realms.length > 0) {
              // Fallback to first realm
              setCurrentRealmState(data.realms[0]);
              localStorage.setItem("currentRealmId", data.realms[0].id);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error refreshing realms:", error);
    }
  };

  // Load current realm from localStorage on mount
  useEffect(() => {
    const loadCurrentRealm = async () => {
      try {
        const storedRealmId = localStorage.getItem("currentRealmId");
        
        if (storedRealmId) {
          try {
            const response = await fetch(`/api/realms/${storedRealmId}`);
            if (response.ok) {
              const contentType = response.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (data.success) {
                  setCurrentRealmState(data.realm);
                } else {
                  localStorage.removeItem("currentRealmId");
                }
              } else {
                localStorage.removeItem("currentRealmId");
              }
            } else {
              localStorage.removeItem("currentRealmId");
            }
          } catch (error) {
            console.error("Error loading realm:", error);
            localStorage.removeItem("currentRealmId");
          }
        }

        // Load all user realms
        try {
          const realmsResponse = await fetch("/api/realms");
          if (realmsResponse.ok) {
            const contentType = realmsResponse.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const realmsData = await realmsResponse.json();
              if (realmsData.success) {
                setUserRealms(realmsData.realms);

                // If no realm is selected but user has realms, automatically select "Imperium Fragmentum"
                if (!storedRealmId && realmsData.realms.length > 0) {
                  const imperiumRealm = realmsData.realms.find((r: Realm) => r.name === "Imperium Fragmentum");
                  if (imperiumRealm) {
                    setCurrentRealmState(imperiumRealm);
                    localStorage.setItem("currentRealmId", imperiumRealm.id);
                  } else if (realmsData.realms.length > 0) {
                    // Fallback to first realm if Imperium Fragmentum doesn't exist
                    setCurrentRealmState(realmsData.realms[0]);
                    localStorage.setItem("currentRealmId", realmsData.realms[0].id);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Error loading realms:", error);
        }
      } catch (error) {
        console.error("Error loading realm:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentRealm();
  }, []);

  const setCurrentRealm = (realm: Realm | null) => {
    setCurrentRealmState(realm);
    if (realm) {
      localStorage.setItem("currentRealmId", realm.id);
    } else {
      localStorage.removeItem("currentRealmId");
    }
  };

  return (
    <RealmContext.Provider
      value={{
        currentRealm,
        setCurrentRealm,
        userRealms,
        setUserRealms,
        isLoading,
        refreshRealms,
      }}
    >
      {children}
    </RealmContext.Provider>
  );
}

export function useRealm() {
  const context = useContext(RealmContext);
  if (context === undefined) {
    throw new Error("useRealm must be used within a RealmProvider");
  }
  return context;
}

