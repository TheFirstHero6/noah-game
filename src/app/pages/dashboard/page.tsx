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
      const data = await response.json();

      if (response.ok) {
        setAllUsersWithResources(data.users);
      }
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

      const data = await response.json();

      if (!response.ok) {
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
      const data = await response.json();

      if (response.ok) {
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

      const data = await response.json();

      if (!response.ok) {
        addNotification(
          "error",
          data.error || "Failed to update resources. Please try again."
        );
        return;
      }

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
      const result = await response.json();

      if (response.ok) {
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
      className="min-h-screen bg-gradient-to-br from-steel-900 via-steel-800 to-steel-900 text-foreground p-4 sm:p-6 lg:p-8 flex flex-col items-center pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Notification Container */}
      <NotificationContainer />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-medieval-pattern opacity-5"></div>

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
                className="absolute -inset-3 bg-gradient-to-r from-gold-400/20 via-gold-600/30 to-gold-400/20 rounded-full blur-lg"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.img
                src={userpic}
                alt="Noble Portrait"
                className="relative rounded-full border-2 border-gold-600 shadow-lg object-cover"
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
                className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-600/20 to-transparent"
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
                className="font-medieval text-4xl sm:text-5xl lg:text-6xl text-gold-300 tracking-wider mb-4"
                whileHover={{ textShadow: "0 0 20px rgba(245, 158, 11, 0.5)" }}
              >
                {username || "Noble"}'s Royal Court
              </motion.h1>
              <motion.p
                className="font-script text-xl md:text-2xl text-gold-200 italic"
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
              <div className="flex-1 border-t border-gold-600/30"></div>
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
              className="font-medieval text-3xl sm:text-4xl text-gold-300 mb-8 text-center"
              whileHover={{ textShadow: "0 0 20px rgba(245, 158, 11, 0.5)" }}
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
                <motion.div
                  key={resource.label}
                  className="relative cursor-pointer overflow-hidden rounded-xl p-6 bg-gradient-to-br from-steel-800/50 via-steel-700/30 to-steel-800/50 backdrop-blur-sm border border-gold-600/30 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="text-4xl sm:text-5xl mb-4 text-center"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {resource.icon}
                  </motion.div>
                  <motion.span
                    className="block text-2xl sm:text-3xl font-medieval font-bold text-gold-300 mb-2 text-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {resource.value}
                  </motion.span>
                  <span className="text-base sm:text-lg text-steel-300 font-serif text-center block">
                    {resource.label}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-gold-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                </motion.div>
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
              <div className="flex-1 border-t border-gold-600/30"></div>
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
                  className="font-medieval text-3xl text-gold-300 text-center lg:text-left"
                  whileHover={{
                    textShadow: "0 0 20px rgba(245, 158, 11, 0.5)",
                  }}
                >
                  👑 Noble Houses of the Realm
                </motion.h2>
              </motion.div>

              {/* Admin Search Section */}
              <div className="mb-8">
                <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-6 glow-text text-center">
                  🔍 Search Amongst the Noble Houses
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Seek out your allies and rivals..."
                    className="medieval-input w-full text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-medieval-gold-400">
                    🔍
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
                    <div key={user.id} className="admin-resource-card group">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="relative group/avatar">
                          <img
                            src={user.imageUrl}
                            alt={user.name || "Noble"}
                            className="h-16 w-16 rounded-full border-2 border-medieval-gold-600 shadow-glow-gold transform transition-all duration-300 group-hover/avatar:scale-110"
                          />
                          <div className="absolute -inset-1 bg-gradient-to-r from-medieval-gold-400 to-medieval-gold-600 rounded-full opacity-0 group-hover/avatar:opacity-20 blur-lg transition-opacity duration-300"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medieval text-lg text-medieval-gold-300 mb-1">
                            {cleanUserName(user.name)}
                          </h3>
                          <p className="text-sm text-medieval-steel-400">
                            {user.role === "ADMIN" ? "👑 Admin" : "🏰 Noble"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center">
                          <div className="text-2xl mb-1">🌲</div>
                          <div className="text-sm font-medieval text-medieval-gold-300">
                            {user.resources.wood}
                          </div>
                          <div className="text-xs text-medieval-steel-400">
                            Wood
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">🗿</div>
                          <div className="text-sm font-medieval text-medieval-gold-300">
                            {user.resources.stone}
                          </div>
                          <div className="text-xs text-medieval-steel-400">
                            Stone
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">🍞</div>
                          <div className="text-sm font-medieval text-medieval-gold-300">
                            {user.resources.food}
                          </div>
                          <div className="text-xs text-medieval-steel-400">
                            Food
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">💰</div>
                          <div className="text-sm font-medieval text-medieval-gold-300">
                            {(user.resources.currency || 0).toFixed(1)}
                          </div>
                          <div className="text-xs text-medieval-steel-400">
                            Currency
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">⚒️</div>
                          <div className="text-sm font-medieval text-medieval-gold-300">
                            {user.resources.metal}
                          </div>
                          <div className="text-xs text-medieval-steel-400">
                            Metal
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">🐄</div>
                          <div className="text-sm font-medieval text-medieval-gold-300">
                            {user.resources.livestock}
                          </div>
                          <div className="text-xs text-medieval-steel-400">
                            Livestock
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            openModal(cleanUserName(user.name), user.id)
                          }
                          className="medieval-button group w-full text-sm"
                        >
                          <span className="flex items-center justify-center space-x-2">
                            <span>🎁</span>
                            <span>Send Boon</span>
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            openAdminModal(cleanUserName(user.name), user.id)
                          }
                          className="medieval-button-secondary group w-full text-sm"
                        >
                          <span className="flex items-center justify-center space-x-2">
                            <span>⚡</span>
                            <span>Manage Resources</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </AnimatedCard>
          ) : (
            /* Normal User List for Non-Admins */
            <AnimatedCard className="p-8" variant="interactive" delay={1.4}>
              {/* Noble Search Section */}
              <div className="mb-12">
                <h2 className="font-medieval text-2xl text-medieval-gold-300 mb-6 glow-text text-center">
                  🔍 Search Amongst the Noble Houses
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Seek out your allies and rivals..."
                    className="medieval-input w-full text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-medieval-gold-400">
                    🔍
                  </div>
                </div>
              </div>

              {/* Noble Houses List */}
              <div className="medieval-card p-8">
                <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
                  <h2 className="font-medieval text-3xl text-medieval-gold-300 glow-text text-center lg:text-left">
                    👑 Noble Houses of the Realm
                  </h2>
                </div>
                <div className="grid gap-6">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="user-card group">
                      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
                        <div className="relative group/avatar">
                          <img
                            src={user.imageUrl}
                            alt={user.name || "Noble"}
                            className="h-24 w-24 rounded-full border-4 border-medieval-gold-600 shadow-glow-gold transform transition-all duration-300 group-hover/avatar:scale-110 group-hover/avatar:rotate-3"
                          />
                          <div className="absolute -inset-1 bg-gradient-to-r from-medieval-gold-400 to-medieval-gold-600 rounded-full opacity-0 group-hover/avatar:opacity-20 blur-lg transition-opacity duration-300"></div>
                        </div>

                        <div className="flex-1 text-center lg:text-left">
                          <h3 className="font-medieval text-2xl text-medieval-gold-300 mb-2">
                            {cleanUserName(user.name)}
                          </h3>
                          <p className="text-medieval-steel-300 italic">
                            "A noble house of great renown"
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() =>
                              openModal(cleanUserName(user.name), user.id)
                            }
                            className="medieval-button group"
                          >
                            <span className="flex items-center space-x-2">
                              <span>🎁</span>
                              <span>Send Boon</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          )}
          {/* Transfer Modal */}
          {modalOpen && (
            <div className="modal-overlay">
              <div className="modal-content p-8 animate-slide-up">
                <button
                  className="absolute top-4 right-4 text-medieval-gold-300 hover:text-medieval-crimson-400 text-3xl transition-colors duration-300"
                  onClick={() => setModalOpen(false)}
                >
                  ✕
                </button>

                <div className="text-center mb-8">
                  <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-4 glow-text">
                    🎁 Send Your Boon to {toUser}
                  </h2>
                  <p className="medieval-text text-lg italic">
                    "A gift from one noble house to another strengthens the
                    bonds of the realm"
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                      💰 Enter the Amount
                    </label>
                    <input
                      type="number"
                      className="medieval-input w-full text-lg"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="How many shall you bestow?"
                    />
                  </div>

                  <div>
                    <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                      🏺 Choose the Type of Boon
                    </label>
                    <select
                      value={resource}
                      onChange={(e) => setResource(e.target.value)}
                      className="medieval-input w-full text-lg"
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
                    <button
                      onClick={transferResources}
                      disabled={isTransferring}
                      className="medieval-button group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center space-x-2">
                        <span>{isTransferring ? "⏳" : "⚔️"}</span>
                        <span>
                          {isTransferring ? "Sending..." : "Send Your Boon"}
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Admin Modal */}
          {adminModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content p-8 animate-slide-up max-w-2xl">
                <button
                  className="absolute top-4 right-4 text-medieval-gold-300 hover:text-medieval-crimson-400 text-3xl transition-colors duration-300"
                  onClick={() => closeAdminModal()}
                >
                  ✕
                </button>

                <div className="text-center mb-8">
                  <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-4 glow-text">
                    ⚡ Manage {toUser}'s Resources
                  </h2>
                  <p className="medieval-text text-lg italic">
                    "As the realm's overseer, you hold the power to shape the
                    fortunes of noble houses"
                  </p>
                  {isLoadingUserResources ? (
                    <div className="mt-4 text-medieval-gold-300">
                      <span className="animate-pulse">
                        ⏳ Loading current resources...
                      </span>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-medieval-steel-800 rounded-lg border border-medieval-gold-600">
                      <p className="text-medieval-gold-300 font-medieval text-lg mb-2">
                        Current Resources:
                      </p>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                        <div className="text-center">
                          <span className="text-medieval-gold-300">🌲</span>
                          <div className="text-medieval-steel-300">
                            {targetUserResources.wood}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-medieval-gold-300">🗿</span>
                          <div className="text-medieval-steel-300">
                            {targetUserResources.stone}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-medieval-gold-300">🍞</span>
                          <div className="text-medieval-steel-300">
                            {targetUserResources.food}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-medieval-gold-300">💰</span>
                          <div className="text-medieval-steel-300">
                            {(targetUserResources.currency || 0).toFixed(1)}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-medieval-gold-300">⚒️</span>
                          <div className="text-medieval-steel-300">
                            {targetUserResources.metal}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-medieval-gold-300">🐄</span>
                          <div className="text-medieval-steel-300">
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
                      <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                        🗿 Stone
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="medieval-input w-full text-lg"
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
                      <input
                        type="number"
                        min="0"
                        className="medieval-input w-full text-lg"
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
                        💰 Currency
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="medieval-input w-full text-lg"
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
                      <input
                        type="number"
                        min="0"
                        className="medieval-input w-full text-lg"
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
                        🐄 Livestock
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="medieval-input w-full text-lg"
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
                        <span>{isUpdatingResources ? "⏳" : "👑"}</span>
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
            </div>
          )}
          {/* Transfer Modal */}
          {modalOpen && (
            <div className="modal-overlay">
              <div className="modal-content p-8 animate-slide-up">
                <button
                  className="absolute top-4 right-4 text-medieval-gold-300 hover:text-medieval-crimson-400 text-3xl transition-colors duration-300"
                  onClick={() => setModalOpen(false)}
                >
                  ✕
                </button>

                <div className="text-center mb-8">
                  <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-4 glow-text">
                    🎁 Send Your Boon to {toUser}
                  </h2>
                  <p className="medieval-text text-lg italic">
                    "A gift from one noble house to another strengthens the
                    bonds of the realm"
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                      💰 Enter the Amount
                    </label>
                    <input
                      type="number"
                      className="medieval-input w-full text-lg"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="How many shall you bestow?"
                    />
                  </div>

                  <div>
                    <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                      🏺 Choose the Type of Boon
                    </label>
                    <select
                      value={resource}
                      onChange={(e) => setResource(e.target.value)}
                      className="medieval-input w-full text-lg"
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
                    <button
                      onClick={transferResources}
                      disabled={isTransferring}
                      className="medieval-button group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center space-x-2">
                        <span>{isTransferring ? "⏳" : "⚔️"}</span>
                        <span>
                          {isTransferring ? "Sending..." : "Send Your Boon"}
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Admin Modal */}
          {adminModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content p-8 animate-slide-up max-w-2xl">
                <button
                  className="absolute top-4 right-4 text-medieval-gold-300 hover:text-medieval-crimson-400 text-3xl transition-colors duration-300"
                  onClick={() => closeAdminModal()}
                >
                  ✕
                </button>

                <div className="text-center mb-8">
                  <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-4 glow-text">
                    ⚡ Manage {toUser}'s Resources
                  </h2>
                  <p className="medieval-text text-lg italic">
                    "As the realm's overseer, you hold the power to shape the
                    fortunes of noble houses"
                  </p>
                  {isLoadingUserResources ? (
                    <div className="mt-4 text-medieval-gold-300">
                      <span className="animate-pulse">
                        ⏳ Loading current resources...
                      </span>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-medieval-steel-800 rounded-lg border border-medieval-gold-600">
                      <p className="text-medieval-gold-300 font-medieval text-lg mb-2">
                        Current Resources:
                      </p>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                        <div className="text-center">
                          <span className="text-medieval-gold-300">🌲</span>
                          <div className="text-medieval-steel-300">
                            {targetUserResources.wood}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-medieval-gold-300">🗿</span>
                          <div className="text-medieval-steel-300">
                            {targetUserResources.stone}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-medieval-gold-300">🍞</span>
                          <div className="text-medieval-steel-300">
                            {targetUserResources.food}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-medieval-gold-300">💰</span>
                          <div className="text-medieval-steel-300">
                            {(targetUserResources.currency || 0).toFixed(1)}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-medieval-gold-300">⚒️</span>
                          <div className="text-medieval-steel-300">
                            {targetUserResources.metal}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-medieval-gold-300">🐄</span>
                          <div className="text-medieval-steel-300">
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
                    <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                      🗿 Stone
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="medieval-input w-full text-lg"
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
                    <input
                      type="number"
                      min="0"
                      className="medieval-input w-full text-lg"
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
                      💰 Currency
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="medieval-input w-full text-lg"
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
                    <input
                      type="number"
                      min="0"
                      className="medieval-input w-full text-lg"
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
                      🐄 Livestock
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="medieval-input w-full text-lg"
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
                      <span>{isUpdatingResources ? "⏳" : "👑"}</span>
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
                <h2 className="font-medieval text-3xl text-gold-300 mb-4">
                  🏰 Your Noble House
                </h2>
                <p className="text-steel-300 text-lg">
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
