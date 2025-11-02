"use client";

import { RealmProvider } from "@/contexts/RealmContext";

export default function RealmProviderWrapper({ children }: { children: React.ReactNode }) {
  return <RealmProvider>{children}</RealmProvider>;
}

