"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRealm } from "@/contexts/RealmContext";
import { useUser } from "@clerk/nextjs";

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

export default function RealmsPage() {
  const {
    currentRealm,
    setCurrentRealm,
    userRealms,
    refreshRealms,
    isLoading,
  } = useRealm();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [realmName, setRealmName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refresh realms on mount to ensure we have the latest data
  useEffect(() => {
    if (!isLoading) {
      refreshRealms();
    }
  }, []);

  const handleCreateRealm = async () => {
    if (!realmName.trim()) {
      setError("Realm name is required");
      return;
    }

    setIsCreating(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/realms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: realmName.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`Realm "${data.realm.name}" created successfully!`);
        setRealmName("");
        setShowCreateModal(false);
        // Refresh realms first to update the list
        await refreshRealms();
        // Then switch to the new realm (which should now be in the list)
        setCurrentRealm(data.realm);
        // Force a small delay to ensure state updates
        setTimeout(() => {
          refreshRealms(); // Refresh again to ensure list is up to date
        }, 100);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to create realm");
      }
    } catch (error) {
      console.error("Error creating realm:", error);
      setError("Failed to create realm. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRealm = async () => {
    if (!joinCode.trim()) {
      setError("Join code is required");
      return;
    }

    setIsJoining(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/realms/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: joinCode.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`Joined realm "${data.realm.name}" successfully!`);
        setJoinCode("");
        setShowJoinModal(false);
        await refreshRealms();
        // Automatically switch to the joined realm
        setCurrentRealm(data.realm);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to join realm");
      }
    } catch (error) {
      console.error("Error joining realm:", error);
      setError("Failed to join realm. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleSwitchRealm = (realm: Realm) => {
    setCurrentRealm(realm);
    setSuccess(`Switched to realm "${realm.name}"`);
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleLeaveRealm = async (realmId: string) => {
    if (
      !confirm(
        "Are you sure you want to leave this realm? All your cities, armies, and resources in this realm will be deleted."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/realms/${realmId}/leave`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await refreshRealms();
        // If leaving the current realm, clear selection
        if (currentRealm?.id === realmId) {
          setCurrentRealm(null);
        }
        setSuccess("Left realm successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to leave realm");
      }
    } catch (error) {
      console.error("Error leaving realm:", error);
      setError("Failed to leave realm. Please try again.");
    }
  };

  const handleKickPlayer = async (
    realmId: string,
    userId: string,
    userName: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to kick ${userName} from this realm? All their cities, armies, and resources in this realm will be deleted.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/realms/${realmId}/kick`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await refreshRealms();
        setSuccess(`Kicked ${userName} from realm successfully`);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to kick player");
      }
    } catch (error) {
      console.error("Error kicking player:", error);
      setError("Failed to kick player. Please try again.");
    }
  };

  const handlePromoteToAdmin = async (
    realmId: string,
    userId: string,
    userName: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to promote ${userName} to admin? They will be able to manage members and kick players.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/realms/${realmId}/promote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await refreshRealms();
        setSuccess(`Promoted ${userName} to admin successfully`);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to promote player");
      }
    } catch (error) {
      console.error("Error promoting player:", error);
      setError("Failed to promote player. Please try again.");
    }
  };

  const handleLogoUpload = async (realmId: string, file: File) => {
    setIsUploadingLogo(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("logo", file);

      const response = await fetch(`/api/realms/${realmId}/logo`, {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        setError("Server returned an invalid response. Please try again.");
        setIsUploadingLogo(false);
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Logo uploaded successfully!");
        await refreshRealms();
        // Update current realm if it's the one being updated
        if (currentRealm?.id === realmId) {
          setCurrentRealm(data.realm);
        }
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to upload logo");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      setError("Failed to upload logo. Please try again.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFileChange = (
    realmId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleLogoUpload(realmId, file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-medieval-gold-600 mx-auto mb-4"></div>
          <p className="text-xl text-medieval-gold-300">Loading realms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 flex flex-col items-center pt-32">
      <div className="absolute inset-0 bg-medieval-pattern opacity-5"></div>

      <div className="relative w-full max-w-4xl">
        <div className="medieval-card p-12 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="medieval-title mb-4 glow-text">🌍 Realms</h1>
            <p className="medieval-subtitle italic">
              "Manage your kingdoms and join others in battle"
            </p>
          </div>

          <div className="medieval-divider"></div>

          {/* Current Realm Display */}
          {currentRealm && (
            <section className="mb-8">
              <h2 className="font-medieval text-2xl text-medieval-gold-300 mb-4">
                Current Realm
              </h2>
              <div className="medieval-card bg-medieval-gold-900/20 border-2 border-medieval-gold-600">
                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Realm Logo */}
                      <div className="relative">
                        {currentRealm.logo ? (
                          <Image
                            src={currentRealm.logo}
                            alt={`${currentRealm.name} logo`}
                            width={64}
                            height={64}
                            className="rounded-full border-2 border-medieval-gold-600 object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full border-2 border-medieval-gold-600 bg-medieval-gold-900/30 flex items-center justify-center text-2xl">
                            🌍
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medieval text-xl text-medieval-gold-300 mb-2">
                          {currentRealm.name}
                        </h3>
                        {(currentRealm.memberRole === "OWNER" ||
                          currentRealm.memberRole === "ADMIN") && (
                          <p className="text-sm text-foreground mb-1">
                            Code:{" "}
                            <span className="font-mono font-bold">
                              {currentRealm.code}
                            </span>
                          </p>
                        )}
                        <p className="text-sm text-foreground mt-1">
                          Role:{" "}
                          <span className="capitalize">
                            {currentRealm.memberRole || "BASIC"}
                          </span>
                        </p>
                      </div>
                    </div>
                    {/* Logo Upload Button (Owner Only) */}
                    {currentRealm.memberRole === "OWNER" && (
                      <div className="flex flex-col items-end gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                          className="hidden"
                          onChange={(e) => handleFileChange(currentRealm.id, e)}
                          disabled={isUploadingLogo}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingLogo}
                          className="text-sm text-medieval-gold-300 hover:text-medieval-gold-200 px-3 py-1 border border-medieval-gold-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUploadingLogo ? "Uploading..." : "📷 Upload Logo"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-lg border-2 border-red-500 bg-red-900/20 text-red-300 text-center">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg border-2 border-green-500 bg-green-900/20 text-green-300 text-center">
              ✅ {success}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowCreateModal(true);
                setShowJoinModal(false);
                setError("");
                setSuccess("");
              }}
              className="medieval-button group"
              type="button"
            >
              <span className="flex items-center space-x-2">
                <span>➕</span>
                <span>Create Realm</span>
              </span>
            </button>

            <button
              onClick={() => {
                setShowJoinModal(true);
                setShowCreateModal(false);
                setError("");
                setSuccess("");
              }}
              className="medieval-button-secondary group"
            >
              <span className="flex items-center space-x-2">
                <span>🔑</span>
                <span>Join Realm</span>
              </span>
            </button>
          </div>

          <div className="medieval-divider"></div>

          {/* Realms List */}
          <section className="mt-8">
            <h2 className="font-medieval text-2xl text-medieval-gold-300 mb-6">
              Your Realms ({userRealms.length})
            </h2>

            {userRealms.length === 0 ? (
              <div className="text-center py-12 text-foreground">
                <p className="text-lg mb-4">
                  You haven't joined any realms yet.
                </p>
                <p>Create a new realm or join one with a code!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userRealms.map((realm) => (
                  <div
                    key={realm.id}
                    className={`medieval-card ${
                      currentRealm?.id === realm.id
                        ? "border-2 border-medieval-gold-500 bg-medieval-gold-900/20"
                        : ""
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medieval text-xl text-medieval-gold-300">
                              {realm.name}
                            </h3>
                            {realm.memberRole === "OWNER" && (
                              <span className="text-xs bg-medieval-gold-600 text-slate-900 px-2 py-1 rounded uppercase font-bold">
                                Owner
                              </span>
                            )}
                          </div>
                          {(realm.memberRole === "OWNER" ||
                            realm.memberRole === "ADMIN") && (
                            <p className="text-sm text-foreground mb-1">
                              Code:{" "}
                              <span className="font-mono font-bold">
                                {realm.code}
                              </span>
                              <span className="ml-2 text-xs bg-medieval-gold-600/20 text-medieval-gold-300 px-2 py-1 rounded border border-medieval-gold-600">
                                Share this code to invite others
                              </span>
                            </p>
                          )}
                          <p className="text-sm text-foreground mb-1">
                            Members: {realm.members.length + 1}{" "}
                            {/* +1 for owner */}
                          </p>
                          <p className="text-sm text-foreground">
                            Role:{" "}
                            <span className="capitalize">
                              {realm.memberRole || "BASIC"}
                            </span>
                          </p>
                          {(realm.memberRole === "OWNER" ||
                            realm.memberRole === "ADMIN") && (
                            <>
                              <div className="mt-2 p-2 bg-medieval-gold-900/20 border border-medieval-gold-600 rounded">
                                <p className="text-xs text-medieval-gold-300 mb-1">
                                  Join Code (Admin/Owner):
                                </p>
                                <p className="font-mono font-bold text-medieval-gold-400 text-lg">
                                  {realm.code}
                                </p>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(realm.code);
                                    setSuccess(
                                      `Code ${realm.code} copied to clipboard!`
                                    );
                                    setTimeout(() => setSuccess(""), 2000);
                                  }}
                                  className="mt-2 text-xs text-medieval-gold-300 hover:text-medieval-gold-200 underline"
                                >
                                  Copy Code
                                </button>
                              </div>
                              <div className="mt-3 p-2 bg-slate-800/50 border border-slate-600 rounded">
                                <p className="text-xs text-medieval-gold-300 mb-2 font-bold">
                                  Members:
                                </p>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs text-foreground">
                                    <span>{realm.owner.name || "Owner"}</span>
                                    <span className="text-medieval-gold-300 font-bold">
                                      Owner
                                    </span>
                                  </div>
                                  {realm.members.map((member) => (
                                    <div
                                      key={member.id}
                                      className="flex items-center justify-between text-xs text-foreground"
                                    >
                                      <span>
                                        {member.user.name || "Member"}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="capitalize text-slate-400">
                                          {member.role}
                                        </span>
                                        {member.user.id !== realm.ownerId && (
                                          <>
                                            {member.role !== "ADMIN" && (
                                              <button
                                                onClick={() =>
                                                  handlePromoteToAdmin(
                                                    realm.id,
                                                    member.user.id,
                                                    member.user.name ||
                                                      "this player"
                                                  )
                                                }
                                                className="text-medieval-gold-400 hover:text-medieval-gold-300 px-2 py-1 border border-medieval-gold-500 rounded text-xs"
                                                title="Promote to Admin"
                                              >
                                                Promote
                                              </button>
                                            )}
                                            <button
                                              onClick={() =>
                                                handleKickPlayer(
                                                  realm.id,
                                                  member.user.id,
                                                  member.user.name ||
                                                    "this player"
                                                )
                                              }
                                              className="text-red-400 hover:text-red-300 px-2 py-1 border border-red-500 rounded text-xs"
                                              title="Kick from realm"
                                            >
                                              Kick
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          {currentRealm?.id !== realm.id ? (
                            <button
                              onClick={() => handleSwitchRealm(realm)}
                              className="medieval-button-secondary text-sm"
                            >
                              Switch
                            </button>
                          ) : (
                            <span className="text-sm text-medieval-gold-300 font-bold">
                              Active
                            </span>
                          )}
                          {realm.memberRole !== "OWNER" && (
                            <button
                              onClick={() => handleLeaveRealm(realm.id)}
                              className="text-sm text-red-400 hover:text-red-300 px-3 py-1 border border-red-500 rounded"
                            >
                              Leave
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="medieval-divider mt-8"></div>

          {/* Back Button */}
          <div className="flex justify-center mt-8">
            <Link
              href="/pages/dashboard"
              className="medieval-button-secondary group"
            >
              <span className="flex items-center space-x-2">
                <span>🏰</span>
                <span>Return to Dashboard</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Create Realm Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false);
              setRealmName("");
              setError("");
            }
          }}
        >
          <div
            className="medieval-card max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="font-medieval text-2xl text-medieval-gold-300 mb-4">
                Create New Realm
              </h2>
              {error && (
                <div className="mb-4 p-2 rounded border-2 border-red-500 bg-red-900/20 text-red-300 text-sm text-center">
                  {error}
                </div>
              )}
              <input
                type="text"
                value={realmName}
                onChange={(e) => setRealmName(e.target.value)}
                placeholder="Enter realm name..."
                className="w-full px-4 py-2 bg-slate-800 border border-medieval-gold-600 rounded text-foreground mb-4"
                onKeyPress={(e) =>
                  e.key === "Enter" && !isCreating && handleCreateRealm()
                }
                autoFocus
              />
              <div className="flex gap-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCreateRealm();
                  }}
                  disabled={isCreating || !realmName.trim()}
                  className="medieval-button flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Creating..." : "Create"}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowCreateModal(false);
                    setRealmName("");
                    setError("");
                  }}
                  className="medieval-button-secondary flex-1"
                  disabled={isCreating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Realm Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="medieval-card max-w-md w-full">
            <div className="p-6">
              <h2 className="font-medieval text-2xl text-medieval-gold-300 mb-4">
                Join Realm
              </h2>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter join code..."
                className="w-full px-4 py-2 bg-slate-800 border border-medieval-gold-600 rounded text-foreground mb-4 font-mono uppercase"
                onKeyPress={(e) => e.key === "Enter" && handleJoinRealm()}
                maxLength={6}
              />
              <div className="flex gap-4">
                <button
                  onClick={handleJoinRealm}
                  disabled={isJoining}
                  className="medieval-button flex-1 disabled:opacity-50"
                >
                  {isJoining ? "Joining..." : "Join"}
                </button>
                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinCode("");
                    setError("");
                  }}
                  className="medieval-button-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
