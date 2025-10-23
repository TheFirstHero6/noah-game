"use client";

import { useState, useEffect, use } from "react";
import { User } from "@/types";
import Image from "next/image";
export default function Dashboard() {
  const [resources, setResources] = useState({
    wood: 0,
    stone: 0,
    food: 0,
    ducats: 0,
  });
  const [username, setUsername] = useState("");

  const [userpic, setUserpic] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [amount, setAmount] = useState(0);
  const [toUser, setToUser] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [resource, setResource] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const [role, setRole] = useState("");

  let fetchedUsers = false;
  let fetchedResources = false;
  let fetchedUsername = false;
  let fetchedUserpic = false;
  let fetchedUserRole = false;

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/dashboard/resources");
      const data = await response.json();
      setResources(data);
      fetchedResources = true;
      if (!response.ok) throw new Error("Failed to fetch resources");
    } catch (error) {
      throw new Error("Failed to fetch resources");
    }
  };

  const fetchUsername = async () => {
    try {
      const response = await fetch("/api/dashboard/username");
      const data = await response.json();
      setUsername(data);
      fetchedUsername = true;
      if (!response.ok) throw new Error("Failed to fetch username");
    } catch (error) {
      throw new Error("Failed to fetch username");
    }
  };
  const fetchUserPic = async () => {
    try {
      const response = await fetch("/api/dashboard/userpic");
      const data = await response.json();
      setUserpic(data);
      fetchedUserpic = true;
      if (!response.ok) throw new Error("Failed to fetch userpic");
    } catch (error) {
      throw new Error("Failed to fetch userpic");
    }
  };
  const fetchAllUsers = async () => {
    try {
      const response = await fetch("/api/dashboard/all-users");
      const data = await response.json();
      setUsers(data);
      if (!response.ok) throw new Error("Failed to fetch userbase");
    } catch (error) {
      throw new Error("Failed to fetch userbase");
    }
  };
  const fetchUserRole = async () => {
    try {
      const response = await fetch("/api/dashboard/roles");
      const data = await response.json();
      setRole(data);
    } catch (error) {
      throw new Error("Role cannot be fetched");
    }
  };

  const transferResources = async () => {
    if (amount <= 0) {
      throw new Error("Enter valid amount");
    }
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

      if (!response.ok || response.status === 400) {
        alert(`Sorry m'lord, I don't think you have enough for this one`);
        throw new Error(`Insufficient resources`);
      } else {
        alert("Boon sent succesfully");
        closeModal();
      }
    } catch (error) {
      alert(
        `These horses aren't what they used to be, we couldn't send your boon`
      );
      throw new Error(
        `These horses aren't what they used to be, we couldn't send your boon`
      );
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
  const openAdminModal = (user: any, userID: any) => {
    setModalOpen(true);
    setToUser(user);
    setToUserId(userID);
  };

  const closeAdminModal = () => {
    setModalOpen(false);
    setToUser("");
    setToUserId("");
  };
  const fetchUsersOnce = async () => {
    if (!fetchedUsers) fetchAllUsers();
  };
  const fetchUsernameOnce = async () => {
    if (!fetchedUsername) fetchUsername();
  };
  const fetchResourcesOnce = async () => {
    if (!fetchedResources) fetchResources();
  };
  const fetchUserpicOnce = async () => {
    if (!fetchedUserpic) fetchUserPic();
  };
  const fetchRoleOnce = async () => {
    if (!fetchedUserRole) fetchUserRole();
  };

  useEffect(() => {
    fetchUsernameOnce();
    fetchResourcesOnce();
    fetchUserpicOnce();
    fetchUsersOnce();
    fetchRoleOnce();
  }, []);

  const welcomePrefix = username ? `${username}'s` : "";
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-medieval-steel-900 via-medieval-steel-800 to-medieval-steel-900 text-medieval-steel-100 p-8 flex flex-col items-center pt-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-medieval-pattern opacity-5"></div>

      <div className="relative w-full max-w-6xl">
        {/* Main Dashboard Card */}
        <div className="medieval-card p-12 animate-fade-in">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12 mb-12">
            <div className="relative group">
              <img
                src={userpic}
                alt="Noble Portrait"
                className="h-32 w-32 rounded-full border-4 border-medieval-gold-600 shadow-glow-gold transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-medieval-gold-400 to-medieval-gold-600 rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500"></div>
            </div>

            <div className="text-center lg:text-left">
              <h1 className="medieval-title mb-4 glow-text">
                {welcomePrefix} Royal Court
              </h1>
              <p className="medieval-subtitle italic">
                "Make your decisions carefully, young lord... The realm depends
                on your wisdom."
              </p>
            </div>
          </div>

          <div className="medieval-divider"></div>

          {/* Resources Section */}
          <div className="mb-12">
            <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
              💰 Royal Treasury
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="resource-card text-center group">
                <div className="text-4xl mb-4 group-hover:animate-float">
                  🌲
                </div>
                <span className="block text-3xl font-medieval font-bold text-medieval-gold-300 mb-2">
                  {resources.wood}
                </span>
                <span className="text-lg text-medieval-steel-300 font-serif">
                  Wood
                </span>
              </div>

              <div className="resource-card text-center group">
                <div className="text-4xl mb-4 group-hover:animate-float">
                  🗿
                </div>
                <span className="block text-3xl font-medieval font-bold text-medieval-gold-300 mb-2">
                  {resources.stone}
                </span>
                <span className="text-lg text-medieval-steel-300 font-serif">
                  Stone
                </span>
              </div>

              <div className="resource-card text-center group">
                <div className="text-4xl mb-4 group-hover:animate-float">
                  🍞
                </div>
                <span className="block text-3xl font-medieval font-bold text-medieval-gold-300 mb-2">
                  {resources.food}
                </span>
                <span className="text-lg text-medieval-steel-300 font-serif">
                  Food
                </span>
              </div>

              <div className="resource-card text-center group">
                <div className="text-4xl mb-4 group-hover:animate-float">
                  🪙
                </div>
                <span className="block text-3xl font-medieval font-bold text-medieval-gold-300 mb-2">
                  {resources.ducats}
                </span>
                <span className="text-lg text-medieval-steel-300 font-serif">
                  Ducats
                </span>
              </div>
            </div>
          </div>
          <div className="medieval-divider"></div>

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
            <h2 className="font-medieval text-3xl text-medieval-gold-300 mb-8 glow-text text-center">
              👑 Noble Houses of the Realm
            </h2>
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
                        {user.name}
                      </h3>
                      <p className="text-medieval-steel-300 italic">
                        "A noble house of great renown"
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => openModal(user.name, user.id)}
                        className="medieval-button group"
                      >
                        <span className="flex items-center space-x-2">
                          <span>🎁</span>
                          <span>Send Boon</span>
                        </span>
                      </button>

                      {role === "ADMIN" && (
                        <button
                          onClick={() => openAdminModal(user.name, user.id)}
                          className="medieval-button-secondary group"
                        >
                          <span className="flex items-center space-x-2">
                            <span>⚡</span>
                            <span>Manage Resources</span>
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                      <option value="ducats">🪙 Ducats</option>
                    </select>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      onClick={transferResources}
                      className="medieval-button group"
                    >
                      <span className="flex items-center space-x-2">
                        <span>⚔️</span>
                        <span>Send Your Boon</span>
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
              <div className="modal-content p-8 animate-slide-up">
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
                      placeholder="How many shall you bestow or remove?"
                    />
                  </div>

                  <div>
                    <label className="block font-medieval text-lg text-medieval-gold-300 mb-3">
                      🏺 Choose the Resource Type
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
                      <option value="ducats">🪙 Ducats</option>
                    </select>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button className="medieval-button-secondary group">
                      <span className="flex items-center space-x-2">
                        <span>👑</span>
                        <span>Execute Administrative Action</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
