"use client";

import { useState, useEffect } from "react";

import { User } from "@/types";

import { useNotification } from "@/components/Notification";

import { motion, AnimatePresence } from "framer-motion";

import { AnimatedCard } from "@/components/AnimatedCard";

import { AnimatedButton } from "@/components/AnimatedButton";

import { AnimatedText } from "@/components/AnimatedText";

import { StaggeredContainer } from "@/components/StaggeredContainer";

import { cn } from "@/lib/design-system";

import { Input } from "@/components/ui/input";

import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [resources, setResources] = useState({
    wood: 0,

    stone: 0,

    food: 0,

    currency: 0,

    metal: 0,

    livestock: 0,
  });

  const [userpic, setUserpic] = useState("");

  const [username, setUsername] = useState("");

  const [users, setUsers] = useState<User[]>([]);

  const [allUsersWithResources, setAllUsersWithResources] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [amount, setAmount] = useState(0);

  const [toUser, setToUser] = useState("");

  const [toUserId, setToUserId] = useState("");

  const [resource, setResource] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const [adminResourceValues, setAdminResourceValues] = useState({
    wood: 0,

    stone: 0,

    food: 0,

    currency: 0,

    metal: 0,

    livestock: 0,
  });

  const [targetUserResources, setTargetUserResources] = useState({
    wood: 0,

    stone: 0,

    food: 0,

    currency: 0,

    metal: 0,

    livestock: 0,
  });

  const [isUpdatingResources, setIsUpdatingResources] = useState(false);

  const [isLoadingUserResources, setIsLoadingUserResources] = useState(false);

  const [role, setRole] = useState("");

  const [isCleaningNames, setIsCleaningNames] = useState(false);

  const [isTransferring, setIsTransferring] = useState(false);

  // Notification system

  const { addNotification, NotificationContainer } = useNotification();

  let fetchedUsers = false;

  let fetchedResources = false;

  let fetchedUserpic = false;

  let fetchedUserRole = false;

  const fetchUserData = async () => {
    try {
      console.log("Dashboard: Fetching user data...");

      const response = await fetch("/api/dashboard/user-data");

      console.log("Dashboard: Response status:", response.status);

      if (!response.ok) {
        console.error(
          "Dashboard: API response not OK:",

          response.status,

          response.statusText
        );

        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      console.log("Dashboard: Received data:", data);

      // Set all the data from the single API call

      setResources(
        data.resources || {
          wood: 0,

          stone: 0,

          food: 0,

          currency: 0,

          metal: 0,

          livestock: 0,
        }
      );

      setUserpic(data.userpic || "");

      setUsername(data.username || "Noble");

      setUsers(data.allUsers || []);

      setRole(data.role || "BASIC");

      // Mark all as fetched

      fetchedResources = true;

      fetchedUserpic = true;

      fetchedUsers = true;

      fetchedUserRole = true;

      console.log("Dashboard: Data set successfully");
    } catch (error) {
      console.error("Error fetching user data:", error);

      addNotification(
        "error",

        "Failed to load dashboard data. Please refresh the page."
      );

      throw new Error("Failed to fetch user data");
    }
  };

  const fetchAllUsersWithResources = async () => {
    if (role !== "ADMIN") return;

    try {
      const response = await fetch("/api/dashboard/all-users-resources");

      if (!response.ok) {
        // Avoid parsing non-JSON responses (e.g., HTML for 401/403)

        return;
      }

      const data = await response.json();

      setAllUsersWithResources(data.users);
    } catch (error) {
      console.error("Error fetching all users with resources:", error);
    }
  };

  const transferResources = async () => {
    // Validate input

    if (amount <= 0) {
      addNotification("error", "Please enter a valid amount greater than 0.");

      return;
    }

    if (!resource) {
      addNotification("error", "Please select a resource type.");

      return;
    }

    if (!toUserId) {
      addNotification("error", "Please select a recipient.");

      return;
    }

    setIsTransferring(true);

    try {
      const response = await fetch("/api/dashboard/transfering", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          toUserId: toUserId,

          amount: amount,

          resource: resource,
        }),
      });

      if (!response.ok) {
        // Try to parse JSON error response, but handle HTML errors gracefully

        let data;

        try {
          data = await response.json();
        } catch (e) {
          addNotification(
            "error",

            `Transaction failed with status ${response.status}. Please try again.`
          );

          return;
        }

        // Handle specific error cases

        if (response.status === 400) {
          if (data.currentAmount !== undefined) {
            addNotification(
              "error",

              `Insufficient ${data.resource}. You have ${data.currentAmount} but need ${data.requestedAmount}.`,

              "Please check your resources and try again."
            );
          } else {
            addNotification(
              "error",

              data.error || "Transaction failed. Please try again."
            );
          }
        } else if (response.status === 404) {
          addNotification("error", "Recipient not found. Please try again.");
        } else if (response.status === 401) {
          addNotification(
            "error",

            "You are not authorized. Please log in again."
          );
        } else {
          addNotification(
            "error",

            data.error || "Transaction failed. Please try again."
          );
        }

        return;
      }

      // Parse JSON for success response

      const data = await response.json();

      // Success case

      if (data.success) {
        addNotification(
          "success",

          `Success: You sent ${data.amount} ${data.resource} to ${toUser}.`,

          "Your boon has been delivered successfully!"
        );

        // Close modal and reset form

        closeModal();

        setAmount(0);

        setResource("");

        // Refresh user data to show updated amounts

        fetchUserData();
      } else {
        addNotification(
          "error",

          "Transaction completed but with unexpected results. Please check your resources."
        );
      }
    } catch (error) {
      console.error("Transfer error:", error);

      addNotification(
        "error",

        "Connection lost. Please check your internet connection and try again.",

        "If the problem persists, please contact support."
      );
    } finally {
      setIsTransferring(false);
    }
  };

  const openModal = (user: any, userID: any) => {
    setModalOpen(true);

    setToUser(user);

    setToUserId(userID);
  };

  const closeModal = () => {
    setModalOpen(false);

    setToUser("");

    setToUserId("");
  };

  const fetchTargetUserResources = async (userId: string) => {
    setIsLoadingUserResources(true);

    try {
      const response = await fetch(
        `/api/dashboard/user-resources?userId=${userId}`
      );

      if (response.ok) {
        const data = await response.json();

        setTargetUserResources(data.resources);

        setAdminResourceValues(data.resources);
      } else {
        // If user has no resources, set defaults

        const defaultResources = {
          wood: 0,

          stone: 0,

          food: 0,

          currency: 0,

          metal: 0,

          livestock: 0,
        };

        setTargetUserResources(defaultResources);

        setAdminResourceValues(defaultResources);
      }
    } catch (error) {
      console.error("Error fetching user resources:", error);

      const defaultResources = {
        wood: 0,

        stone: 0,

        food: 0,

        currency: 0,

        metal: 0,

        livestock: 0,
      };

      setTargetUserResources(defaultResources);

      setAdminResourceValues(defaultResources);
    } finally {
      setIsLoadingUserResources(false);
    }
  };

  const openAdminModal = async (user: any, userID: any) => {
    setAdminModalOpen(true);

    setToUser(user);

    setToUserId(userID);

    await fetchTargetUserResources(userID);
  };

  const closeAdminModal = () => {
    setAdminModalOpen(false);

    setToUser("");

    setToUserId("");

    setAdminResourceValues({
      wood: 0,

      stone: 0,

      food: 0,

      currency: 0,

      metal: 0,

      livestock: 0,
    });
  };

  const updateUserResources = async () => {
    // Validate input

    const hasValidValues = Object.values(adminResourceValues).some(
      (value) => value > 0
    );

    if (!hasValidValues) {
      addNotification(
        "error",

        "Please enter at least one resource value greater than 0."
      );

      return;
    }

    setIsUpdatingResources(true);

    try {
      const response = await fetch("/api/dashboard/admin-resources", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          targetUserId: toUserId,

          ...adminResourceValues,
        }),
      });

      if (!response.ok) {
        // Try to parse JSON error response, but handle HTML errors gracefully

        let data;

        try {
          data = await response.json();
        } catch (e) {
          addNotification(
            "error",

            `Failed to update resources with status ${response.status}. Please try again.`
          );

          return;
        }

        addNotification(
          "error",

          data.error || "Failed to update resources. Please try again."
        );

        return;
      }

      // Parse JSON for success response

      const data = await response.json();

      // Success case

      addNotification(
        "success",

        `Executive Proclamation executed for ${toUser}!`,

        "The realm's treasury has been adjusted by your royal decree."
      );

      // Close modal and reset form

      closeAdminModal();

      // Refresh user data to show updated amounts

      fetchUserData();

      // Refresh admin dashboard if user is admin

      if (role === "ADMIN") {
        fetchAllUsersWithResources();
      }
    } catch (error) {
      console.error("Admin resource update error:", error);

      addNotification(
        "error",

        "Connection lost. Please check your internet connection and try again.",

        "If the problem persists, please contact support."
      );
    } finally {
      setIsUpdatingResources(false);
    }
  };

  const cleanupUserNames = async () => {
    if (role !== "ADMIN") return;

    setIsCleaningNames(true);

    try {
      const response = await fetch("/api/dashboard/cleanup-names", {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();

        alert(`Successfully cleaned up ${result.updatedUsers} user names!`);

        // Refresh the user data

        fetchUserData();
      } else {
        alert("Failed to clean up names. You may not have admin privileges.");
      }
    } catch (error) {
      alert("Error cleaning up names. Please try again.");
    } finally {
      setIsCleaningNames(false);
    }
  };

  const fetchUserDataOnce = async () => {
    if (
      !fetchedUsers ||
      !fetchedResources ||
      !fetchedUserpic ||
      !fetchedUserRole
    ) {
      try {
        console.log("Dashboard: Attempting to fetch user data...");

        await fetchUserData();

        console.log("Dashboard: User data fetched successfully");
      } catch (error) {
        console.error("Dashboard: Failed to fetch user data:", error);

        addNotification(
          "error",

          "Failed to load dashboard data. Please check your connection and try again."
        );
      }
    }
  };

  useEffect(() => {
    fetchUserDataOnce();
  }, []);

  useEffect(() => {
    if (role === "ADMIN") {
      fetchAllUsersWithResources();
    }
  }, [role]);

  // Clean up user names that might contain "null"

  const cleanUserName = (name: string) => {
    if (!name || name === "null" || name.trim() === "") {
      return "Noble";
    }

    return name.replace(/\s+null\s*$/, "").trim();
  };

  const filteredUsers = users.filter((user) => {
    const cleanName = cleanUserName(user.name);

    return (
      cleanName && cleanName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <motion.div
      className="min-h-screen bg-[var(--theme-bg)] text-foreground p-4 sm:p-6 lg:p-8 flex flex-col items-center pt-20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Notification Container */}

      <NotificationContainer />

      {/* Animated background pattern - Figma style */}

      <div className="fixed inset-0 opacity-5 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: `${(i * 61) % 100}%`, top: `${(i * 37) % 100}%` }}
          >
            <svg className="h-12 w-12" fill="none" viewBox="0 0 40 40">
              <path
                d="M36 34V30H34V34H30V36H34V40H36V36H40V34H36ZM36 4V0H34V4H30V6H34V10H36V6H40V4H36ZM6 34V30H4V34H0V36H4V40H6V36H10V34H6ZM6 4V0H4V4H0V6H4V10H6V6H10V4H6Z"
                fill="var(--theme-gold)"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-7xl space-y-8">
        {/* Main Dashboard Card */}

        <AnimatedCard
          className="p-6 sm:p-8 lg:p-12"
          variant="interactive"
          delay={0.1}
        >
          {/* Header Section */}

          <motion.div
            className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-12 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute -inset-3 bg-gradient-to-r from-[var(--theme-gold)]/20 via-[var(--theme-accent)]/30 to-[var(--theme-gold)]/20 rounded-full blur-lg"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <motion.img
                src={userpic || "/logo.png"}
                alt="Noble Portrait"
                className="relative rounded-full border-2 border-[var(--theme-accent)] object-cover"
                style={{
                  aspectRatio: "1/1",

                  width: "120px",

                  height: "120px",

                  minWidth: "120px",

                  minHeight: "120px",

                  maxWidth: "120px",

                  maxHeight: "120px",
                }}
                whileHover={{ rotate: 3, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--theme-gold)]/20 to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.h1
                className="font-[Cinzel] text-4xl sm:text-5xl lg:text-6xl text-[var(--theme-gold)] tracking-wider mb-4 uppercase"
                whileHover={{ textShadow: "0 0 20px rgba(234, 179, 8, 0.5)" }}
              >
                {username || "Noble"}'s Royal Court
              </motion.h1>

              <motion.p
                className="font-[Playfair_Display] text-xl md:text-2xl text-[var(--theme-gold)]/80 italic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {role === "ADMIN"
                  ? "Your Majesty, the realm bows to your royal authority... Command your subjects with wisdom and justice."
                  : "Make your decisions carefully, young lord... The realm depends on your wisdom."}
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative my-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="flex-1 border-t border-[var(--theme-border)]"></div>
            </div>
          </motion.div>

          {/* Resources Section */}

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <motion.h2
              className="font-[Cinzel] text-3xl sm:text-4xl text-[var(--theme-gold)] mb-8 text-center uppercase"
              whileHover={{ textShadow: "0 0 20px rgba(234, 179, 8, 0.5)" }}
            >
              💰 Royal Treasury
            </motion.h2>

            <StaggeredContainer
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
              staggerDelay={0.1}
            >
              {[
                {
                  icon: "🌲",

                  label: "Wood",

                  value: resources.wood,

                  color: "emerald",
                },

                {
                  icon: "🗿",

                  label: "Stone",

                  value: resources.stone,

                  color: "steel",
                },

                {
                  icon: "🍞",

                  label: "Food",

                  value: resources.food,

                  color: "amber",
                },

                {
                  icon: "💰",

                  label: "Currency",

                  value: (resources.currency || 0).toFixed(1),

                  color: "gold",
                },

                {
                  icon: "⚒️",

                  label: "Metal",

                  value: resources.metal,

                  color: "steel",
                },

                {
                  icon: "🐄",

                  label: "Livestock",

                  value: resources.livestock,

                  color: "emerald",
                },
              ].map((resource, index) => (
                <Card
                  key={resource.label}
                  className="relative cursor-pointer overflow-hidden rounded-lg p-6 backdrop-blur-sm bg-[var(--theme-card-bg)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] transition-all duration-300 group"
                >
                  <motion.div
                    className="text-4xl sm:text-5xl mb-4 text-center"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {resource.icon}
                  </motion.div>

                  <motion.span
                    className="block text-2xl sm:text-3xl font-[Cinzel] font-bold text-white mb-2 text-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {resource.value}
                  </motion.span>

                  <span className="text-base sm:text-lg text-gray-300 font-[Playfair_Display] text-center block">
                    {resource.label}
                  </span>
                </Card>
              ))}
            </StaggeredContainer>
          </motion.div>

          <motion.div
            className="relative my-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="flex-1 border-t border-[var(--theme-border)]"></div>
            </div>
          </motion.div>

          {/* Admin Dashboard - Replace normal list for admins */}

          {role === "ADMIN" ? (
            <AnimatedCard className="p-8" variant="interactive" delay={1.4}>
              <motion.div
                className="flex flex-col lg:flex-row justify-between items-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                <motion.h2
                  className="font-[Cinzel] text-3xl text-[var(--theme-gold)] text-center lg:text-left uppercase"
                  whileHover={{
                    textShadow: "0 0 20px rgba(245, 158, 11, 0.5)",
                  }}
                >
                  👑 Noble Houses of the Realm
                </motion.h2>
              </motion.div>

              {/* Admin Search Section */}

              <div className="mb-8">
                <h3 className="font-[Cinzel] text-2xl text-[var(--theme-gold)] mb-6 text-center uppercase">
                  👑 Search Amongst the Noble Houses
                </h3>

                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Seek out your allies and rivals..."
                    className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--theme-gold)] pointer-events-none">
                    🔍
                  </div>
                </div>
              </div>

              {/* Admin Resource Cards Grid */}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allUsersWithResources

                  .filter((user) => {
                    const cleanName = cleanUserName(user.name);

                    return (
                      cleanName &&
                      cleanName

                        .toLowerCase()

                        .includes(searchQuery.toLowerCase())
                    );
                  })

                  .map((user) => (
                    <Card
                      key={user.id}
                      className="backdrop-blur-sm bg-[var(--theme-card-bg)] rounded-lg border border-[var(--theme-border)] p-6 hover:border-[var(--theme-accent)] transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="relative group/avatar">
                          <img
                            src={user.imageUrl}
                            alt={user.name || "Noble"}
                            className="h-16 w-16 rounded-full border-2 border-[var(--theme-accent)] transform transition-all duration-300 group-hover/avatar:scale-110"
                          />

                          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--theme-gold)] to-[var(--theme-accent)] rounded-full opacity-0 group-hover/avatar:opacity-20 blur-lg transition-opacity duration-300"></div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-[Cinzel] text-lg text-[var(--theme-gold)] mb-1 uppercase">
                            {cleanUserName(user.name)}
                          </h3>

                          <p className="text-sm text-gray-400 font-[Playfair_Display]">
                            {user.role === "ADMIN" ? "👑 Admin" : "🏰 Noble"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center">
                          <div className="text-2xl mb-1">🌲</div>

                          <div className="text-sm font-[Cinzel] text-[var(--theme-gold)]">
                            {user.resources.wood}
                          </div>

                          <div className="text-xs text-gray-400">Wood</div>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl mb-1">🗿</div>

                          <div className="text-sm font-[Cinzel] text-[var(--theme-gold)]">
                            {user.resources.stone}
                          </div>

                          <div className="text-xs text-gray-400">Stone</div>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl mb-1">🍞</div>

                          <div className="text-sm font-[Cinzel] text-[var(--theme-gold)]">
                            {user.resources.food}
                          </div>

                          <div className="text-xs text-gray-400">Food</div>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl mb-1">💰</div>

                          <div className="text-sm font-[Cinzel] text-[var(--theme-gold)]">
                            {(user.resources.currency || 0).toFixed(1)}
                          </div>

                          <div className="text-xs text-gray-400">Currency</div>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl mb-1">⚒️</div>

                          <div className="text-sm font-[Cinzel] text-[var(--theme-gold)]">
                            {user.resources.metal}
                          </div>

                          <div className="text-xs text-gray-400">Metal</div>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl mb-1">🐄</div>

                          <div className="text-sm font-[Cinzel] text-[var(--theme-gold)]">
                            {user.resources.livestock}
                          </div>

                          <div className="text-xs text-gray-400">Livestock</div>
                        </div>
                      </div>

                      {/* Action Buttons */}

                      <div className="flex flex-col gap-2">
                        <AnimatedButton
                          onClick={() =>
                            openModal(cleanUserName(user.name), user.id)
                          }
                          variant="success"
                          size="sm"
                          className="w-full"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span>🎁</span>

                            <span>SEND BOON</span>
                          </span>
                        </AnimatedButton>

                        <AnimatedButton
                          onClick={() =>
                            openAdminModal(cleanUserName(user.name), user.id)
                          }
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span>⚡</span>

                            <span>Manage Resources</span>
                          </span>
                        </AnimatedButton>
                      </div>
                    </Card>
                  ))}
              </div>
            </AnimatedCard>
          ) : (
            /* Normal User List for Non-Admins */

            <AnimatedCard className="p-8" variant="interactive" delay={1.4}>
              {/* Noble Search Section */}

              <div className="mb-12">
                <h2 className="font-[Cinzel] text-2xl text-[var(--theme-gold)] mb-6 text-center uppercase">
                  🔍 Search Amongst the Noble Houses
                </h2>

                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Seek out your allies and rivals..."
                    className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--theme-gold)] pointer-events-none">
                    🔍
                  </div>
                </div>
              </div>

              {/* Noble Houses List */}

              <div className="backdrop-blur-sm bg-[var(--theme-card-bg)] rounded-lg border border-[var(--theme-border)] p-8">
                <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
                  <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] text-center lg:text-left uppercase">
                    👑 Noble Houses of the Realm
                  </h2>
                </div>

                <div className="grid gap-6">
                  {filteredUsers.map((user) => (
                    <Card
                      key={user.id}
                      className="backdrop-blur-sm bg-[var(--theme-card-bg)] rounded-lg border border-[var(--theme-border)] p-6 hover:border-[var(--theme-accent)] transition-all duration-300 group"
                    >
                      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
                        <div className="relative group/avatar">
                          <img
                            src={user.imageUrl}
                            alt={user.name || "Noble"}
                            className="h-24 w-24 rounded-full border-4 border-[var(--theme-accent)] transform transition-all duration-300 group-hover/avatar:scale-110 group-hover/avatar:rotate-3"
                          />

                          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--theme-gold)] to-[var(--theme-accent)] rounded-full opacity-0 group-hover/avatar:opacity-20 blur-lg transition-opacity duration-300"></div>
                        </div>

                        <div className="flex-1 text-center lg:text-left">
                          <h3 className="font-[Cinzel] text-2xl text-white mb-2 uppercase">
                            {cleanUserName(user.name)}
                          </h3>

                          <p className="text-gray-300 font-[Playfair_Display] italic">
                            "A noble house of great renown"
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <AnimatedButton
                            onClick={() =>
                              openModal(cleanUserName(user.name), user.id)
                            }
                            variant="success"
                          >
                            <span className="flex items-center gap-2">
                              <span>🎁</span>

                              <span>SEND BOON</span>
                            </span>
                          </AnimatedButton>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          )}

          {/* Transfer Modal */}

          {modalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="relative backdrop-blur-sm bg-[var(--theme-card-bg)]/95 border border-[var(--theme-border)] rounded-lg shadow-2xl max-w-lg w-full mx-4 p-8 overflow-hidden">
                <button
                  className="absolute top-4 right-4 text-[var(--theme-gold)] hover:text-red-400 text-3xl transition-colors duration-300"
                  onClick={() => setModalOpen(false)}
                >
                  ✕
                </button>

                <div className="text-center mb-8">
                  <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-4 uppercase">
                    🎁 Send Your Boon to {toUser}
                  </h2>

                  <p className="font-[Playfair_Display] text-gray-200 text-lg italic">
                    "A gift from one noble house to another strengthens the
                    bonds of the realm"
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                      💰 Enter the Amount
                    </label>

                    <Input
                      type="number"
                      className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="How many shall you bestow?"
                    />
                  </div>

                  <div>
                    <label className="block font-[Cinzel] text-lg text-[var(--theme-gold)] mb-3">
                      👑 Choose the Type of Boon
                    </label>

                    <select
                      value={resource}
                      onChange={(e) => setResource(e.target.value)}
                      className="w-full text-lg bg-[var(--theme-card-bg)] border border-[var(--theme-border)] text-[var(--theme-gold)]/80 rounded-xl backdrop-blur-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]"
                    >
                      <option value="">Select a resource...</option>

                      <option value="wood">🌲 Wood</option>

                      <option value="stone">🗿 Stone</option>

                      <option value="food">🍞 Food</option>

                      <option value="currency">💰 Currency</option>

                      <option value="metal">⚒️ Metal</option>

                      <option value="livestock">🐄 Livestock</option>
                    </select>
                  </div>

                  <div className="flex justify-center pt-4">
                    <AnimatedButton
                      onClick={transferResources}
                      disabled={isTransferring}
                      variant="primary"
                      loading={isTransferring}
                    >
                      <span className="flex items-center gap-2">
                        <span>{isTransferring ? "â³" : "âš”ï¸"}</span>

                        <span>
                          {isTransferring ? "Sending..." : "Send Your Boon"}
                        </span>
                      </span>
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Modal */}

          {adminModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="relative backdrop-blur-sm bg-[var(--theme-card-bg)]/95 border border-[var(--theme-border)] rounded-lg shadow-2xl max-w-2xl w-full mx-4 p-8 overflow-hidden">
                <button
                  className="absolute top-4 right-4 text-[var(--theme-gold)] hover:text-red-400 text-3xl transition-colors duration-300"
                  onClick={() => closeAdminModal()}
                >
                  ✕
                </button>

                <div className="text-center mb-8">
                  <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-4 uppercase">
                    ⚡ Manage {toUser}'s Resources
                  </h2>

                  <p className="font-[Playfair_Display] text-gray-200 text-lg italic">
                    "As the realm's overseer, you hold the power to shape the
                    fortunes of noble houses"
                  </p>

                  {isLoadingUserResources ? (
                    <div className="mt-4 text-[var(--theme-gold)]">
                      <span className="animate-pulse">
                        â³ Loading current resources...
                      </span>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-[var(--theme-card-bg)] rounded-lg border border-[var(--theme-border)]">
                      <p className="text-[var(--theme-gold)] font-[Cinzel] text-lg mb-2">
                        Current Resources:
                      </p>

                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                        <div className="text-center">
                          <span className="text-[var(--theme-gold)]">🌲</span>

                          <div className="text-gray-300">
                            {targetUserResources.wood}
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-[var(--theme-gold)]">🗿</span>

                          <div className="text-gray-300">
                            {targetUserResources.stone}
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-[var(--theme-gold)]">🍞</span>

                          <div className="text-gray-300">
                            {targetUserResources.food}
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-[var(--theme-gold)]">💰</span>

                          <div className="text-gray-300">
                            {(targetUserResources.currency || 0).toFixed(1)}
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-[var(--theme-gold)]">⚒️</span>

                          <div className="text-gray-300">
                            {targetUserResources.metal}
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-[var(--theme-gold)]">👑</span>

                          <div className="text-gray-300">
                            {targetUserResources.livestock}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block font-[Cinzel] text-lg text-[var(--theme-gold)] mb-3">
                        🌲 Wood
                      </label>

                      <Input
                        type="number"
                        min="0"
                        className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                        value={adminResourceValues.wood}
                        onChange={(e) =>
                          setAdminResourceValues((prev) => ({
                            ...prev,

                            wood: Number(e.target.value) || 0,
                          }))
                        }
                        placeholder="Set wood amount"
                      />
                    </div>

                    <div>
                      <label className="block font-[Cinzel] text-lg text-[var(--theme-gold)] mb-3">
                        🗿 Stone
                      </label>

                      <Input
                        type="number"
                        min="0"
                        className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                        value={adminResourceValues.stone}
                        onChange={(e) =>
                          setAdminResourceValues((prev) => ({
                            ...prev,

                            stone: Number(e.target.value) || 0,
                          }))
                        }
                        placeholder="Set stone amount"
                      />
                    </div>

                    <div>
                      <label className="block font-[Cinzel] text-lg text-[var(--theme-gold)] mb-3">
                        🍞 Food
                      </label>

                      <Input
                        type="number"
                        min="0"
                        className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                        value={adminResourceValues.food}
                        onChange={(e) =>
                          setAdminResourceValues((prev) => ({
                            ...prev,

                            food: Number(e.target.value) || 0,
                          }))
                        }
                        placeholder="Set food amount"
                      />
                    </div>

                    <div>
                      <label className="block font-[Cinzel] text-lg text-[var(--theme-gold)] mb-3">
                        💰 Currency
                      </label>

                      <Input
                        type="number"
                        min="0"
                        className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                        value={adminResourceValues.currency}
                        onChange={(e) =>
                          setAdminResourceValues((prev) => ({
                            ...prev,

                            currency: Number(e.target.value) || 0,
                          }))
                        }
                        placeholder="Set currency amount"
                      />
                    </div>

                    <div>
                      <label className="block font-[Cinzel] text-lg text-[var(--theme-gold)] mb-3">
                        ⚒️ Metal
                      </label>

                      <Input
                        type="number"
                        min="0"
                        className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                        value={adminResourceValues.metal}
                        onChange={(e) =>
                          setAdminResourceValues((prev) => ({
                            ...prev,

                            metal: Number(e.target.value) || 0,
                          }))
                        }
                        placeholder="Set metal amount"
                      />
                    </div>

                    <div>
                      <label className="block font-[Cinzel] text-lg text-[var(--theme-gold)] mb-3">
                        👑 Livestock
                      </label>

                      <Input
                        type="number"
                        min="0"
                        className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                        value={adminResourceValues.livestock}
                        onChange={(e) =>
                          setAdminResourceValues((prev) => ({
                            ...prev,

                            livestock: Number(e.target.value) || 0,
                          }))
                        }
                        placeholder="Set livestock amount"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <AnimatedButton
                      onClick={updateUserResources}
                      disabled={isUpdatingResources}
                      variant="secondary"
                      loading={isUpdatingResources}
                    >
                      <span className="flex items-center gap-2">
                        <span>{isUpdatingResources ? "â³" : "👑"}</span>

                        <span>
                          {isUpdatingResources
                            ? "Proclaiming..."
                            : "Make Executive Proclamation"}
                        </span>
                      </span>
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transfer Modal */}

          {modalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="relative backdrop-blur-sm bg-[var(--theme-card-bg)]/95 border border-[var(--theme-border)] rounded-lg shadow-2xl max-w-lg w-full mx-4 p-8 overflow-hidden">
                <button
                  className="absolute top-4 right-4 text-[var(--theme-gold)] hover:text-red-400 text-3xl transition-colors duration-300"
                  onClick={() => setModalOpen(false)}
                >
                  ✕
                </button>

                <div className="text-center mb-8">
                  <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-4 uppercase">
                    🎁 Send Your Boon to {toUser}
                  </h2>

                  <p className="font-[Playfair_Display] text-gray-200 text-lg italic">
                    "A gift from one noble house to another strengthens the
                    bonds of the realm"
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                      💰 Enter the Amount
                    </label>

                    <Input
                      type="number"
                      className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="How many shall you bestow?"
                    />
                  </div>

                  <div>
                    <label className="block font-[Cinzel] text-lg text-[var(--theme-gold)] mb-3">
                      👑 Choose the Type of Boon
                    </label>

                    <select
                      value={resource}
                      onChange={(e) => setResource(e.target.value)}
                      className="w-full text-lg bg-[var(--theme-card-bg)] border border-[var(--theme-border)] text-[var(--theme-gold)]/80 rounded-xl backdrop-blur-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]"
                    >
                      <option value="">Select a resource...</option>

                      <option value="wood">🌲 Wood</option>

                      <option value="stone">🗿 Stone</option>

                      <option value="food">🍞 Food</option>

                      <option value="currency">👑Currency</option>

                      <option value="metal">⚒️ Metal</option>

                      <option value="livestock">👑 Livestock</option>
                    </select>
                  </div>

                  <div className="flex justify-center pt-4">
                    <AnimatedButton
                      onClick={transferResources}
                      disabled={isTransferring}
                      variant="primary"
                      loading={isTransferring}
                    >
                      <span className="flex items-center gap-2">
                        <span>{isTransferring ? "â³" : "âš”ï¸"}</span>

                        <span>
                          {isTransferring ? "Sending..." : "Send Your Boon"}
                        </span>
                      </span>
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Modal */}

          {adminModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="relative backdrop-blur-sm bg-[var(--theme-card-bg)]/95 border border-[var(--theme-border)] rounded-lg shadow-2xl max-w-2xl w-full mx-4 p-8 overflow-hidden">
                <button
                  className="absolute top-4 right-4 text-[var(--theme-gold)] hover:text-red-400 text-3xl transition-colors duration-300"
                  onClick={() => closeAdminModal()}
                >
                  ✕
                </button>

                <div className="text-center mb-8">
                  <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-4 uppercase">
                    ⚡ Manage {toUser}'s Resources
                  </h2>

                  <p className="font-[Playfair_Display] text-gray-200 text-lg italic">
                    "As the realm's overseer, you hold the power to shape the
                    fortunes of noble houses"
                  </p>

                  {isLoadingUserResources ? (
                    <div className="mt-4 text-[var(--theme-gold)]">
                      <span className="animate-pulse">
                        â³ Loading current resources...
                      </span>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-[var(--theme-card-bg)] rounded-lg border border-[var(--theme-border)]">
                      <p className="text-[var(--theme-gold)] font-[Cinzel] text-lg mb-2">
                        Current Resources:
                      </p>

                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                        <div className="text-center">
                          <span className="text-[var(--theme-gold)]">🌲</span>

                          <div className="text-gray-300">
                            {targetUserResources.wood}
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-[var(--theme-gold)]">🗿</span>

                          <div className="text-gray-300">
                            {targetUserResources.stone}
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-[var(--theme-gold)]">🍞</span>

                          <div className="text-gray-300">
                            {targetUserResources.food}
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-[var(--theme-gold)]">💰</span>

                          <div className="text-gray-300">
                            {(targetUserResources.currency || 0).toFixed(1)}
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-[var(--theme-gold)]">⚒️</span>

                          <div className="text-gray-300">
                            {targetUserResources.metal}
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-[var(--theme-gold)]">👑</span>

                          <div className="text-gray-300">
                            {targetUserResources.livestock}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                      🌲 Wood
                    </label>

                    <input
                      type="number"
                      min="0"
                      className="medieval-input w-full text-lg"
                      value={adminResourceValues.wood}
                      onChange={(e) =>
                        setAdminResourceValues((prev) => ({
                          ...prev,

                          wood: Number(e.target.value) || 0,
                        }))
                      }
                      placeholder="Set wood amount"
                    />
                  </div>

                  <div>
                    <label className="block font-[Cinzel] text-lg text-[var(--theme-gold)] mb-3">
                      🗿 Stone
                    </label>

                    <Input
                      type="number"
                      min="0"
                      className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                      value={adminResourceValues.stone}
                      onChange={(e) =>
                        setAdminResourceValues((prev) => ({
                          ...prev,

                          stone: Number(e.target.value) || 0,
                        }))
                      }
                      placeholder="Set stone amount"
                    />
                  </div>

                  <div>
                    <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                      🍞 Food
                    </label>

                    <Input
                      type="number"
                      min="0"
                      className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                      value={adminResourceValues.food}
                      onChange={(e) =>
                        setAdminResourceValues((prev) => ({
                          ...prev,

                          food: Number(e.target.value) || 0,
                        }))
                      }
                      placeholder="Set food amount"
                    />
                  </div>

                  <div>
                    <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                      👑 Currency
                    </label>

                    <Input
                      type="number"
                      min="0"
                      className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                      value={adminResourceValues.currency}
                      onChange={(e) =>
                        setAdminResourceValues((prev) => ({
                          ...prev,

                          currency: Number(e.target.value) || 0,
                        }))
                      }
                      placeholder="Set currency amount"
                    />
                  </div>

                  <div>
                    <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                      ⚒️ Metal
                    </label>

                    <Input
                      type="number"
                      min="0"
                      className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                      value={adminResourceValues.metal}
                      onChange={(e) =>
                        setAdminResourceValues((prev) => ({
                          ...prev,

                          metal: Number(e.target.value) || 0,
                        }))
                      }
                      placeholder="Set metal amount"
                    />
                  </div>

                  <div>
                    <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                      👑 Livestock
                    </label>

                    <Input
                      type="number"
                      min="0"
                      className="w-full text-lg bg-[var(--theme-card-bg)] border-[var(--theme-border)] text-[var(--theme-gold)]/80 placeholder:text-[var(--theme-gold)]/50 rounded-xl backdrop-blur-sm"
                      value={adminResourceValues.livestock}
                      onChange={(e) =>
                        setAdminResourceValues((prev) => ({
                          ...prev,

                          livestock: Number(e.target.value) || 0,
                        }))
                      }
                      placeholder="Set livestock amount"
                    />
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    onClick={updateUserResources}
                    disabled={isUpdatingResources}
                    className="medieval-button-secondary group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center space-x-2">
                      <span>{isUpdatingResources ? "â³" : "👑"}</span>

                      <span>
                        {isUpdatingResources
                          ? "Proclaiming..."
                          : "Make Executive Proclamation"}
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Non-Admin Section */}

          {role !== "ADMIN" && (
            <AnimatedCard className="p-8" variant="interactive" delay={1.4}>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                <h2 className="font-[Cinzel] text-3xl text-[var(--theme-gold)] mb-4 uppercase">
                  🏰 Your Noble House
                </h2>

                <p className="text-gray-300 text-lg font-[Playfair_Display]">
                  Welcome to your personal realm. Manage your resources and
                  build your legacy.
                </p>
              </motion.div>
            </AnimatedCard>
          )}
        </AnimatedCard>
      </div>
    </motion.div>
  );
}
