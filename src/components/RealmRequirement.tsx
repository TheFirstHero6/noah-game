"use client";

import { useRealm } from "@/contexts/RealmContext";
import Link from "next/link";

export default function RealmRequirement({ children }: { children: React.ReactNode }) {
  const { currentRealm, isLoading } = useRealm();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medieval-gold-600 mx-auto mb-4"></div>
          <p className="text-xl text-medieval-gold-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentRealm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex items-center justify-center">
        <div className="medieval-card p-12 max-w-2xl text-center animate-fade-in">
          <div className="text-6xl mb-6">🌍</div>
          <h1 className="medieval-title mb-4 glow-text">
            No Realm Selected
          </h1>
          <p className="medieval-subtitle mb-8 italic">
            "Looks like you're not currently in a realm. Join one or create one and invite your friends to start playing!"
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pages/realms" className="medieval-button group">
              <span className="flex items-center space-x-2">
                <span>🌍</span>
                <span>Go to Realms</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

