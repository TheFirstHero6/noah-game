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
        `These horses aren't what they used to be, we couldn't send your boon`,
      );
      throw new Error(
        `These horses aren't what they used to be, we couldn't send your boon`,
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

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const welcomePrefix = username ? `${username}'s` : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black text-white p-8 flex flex-col items-center pt-24">
      <div className="w-full max-w-4xl bg-gray-900 p-8 rounded-lg shadow-2xl border-2 border-yellow-600">
        <img
          src={userpic}
          alt="userpic"
          className="h-20 w-20 rounded-full border-2 border-yellow-400"
        />

        <h1 className="text-5xl font-bold text-center mb-6 font-serif tracking-wider text-yellow-300">
          {welcomePrefix} Dashboard
        </h1>
        <p className="text-center text-yellow-400 mb-8 italic">
          Make your decisions carefully young lord...
        </p>

        {/* Resources Section */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
          <h2 className="text-3xl font-semibold mb-6 border-b border-yellow-600 pb-2 text-yellow-300">
            Your Resources
          </h2>
          <ul className="grid grid-cols-2 gap-6">
            <li className="p-4 rounded text-center bg-orange-700 shadow-md">
              <span className="block text-3xl font-bold">{resources.wood}</span>
              <span className="text-xl">Wood</span>
            </li>
            <li className="p-4 rounded text-center bg-gray-600 shadow-md">
              <span className="block text-3xl font-bold">
                {resources.stone}
              </span>
              <span className="text-xl">Stone</span>
            </li>
            <li className="p-4 rounded text-center bg-green-700 shadow-md">
              <span className="block text-3xl font-bold">{resources.food}</span>
              <span className="text-xl">Food</span>
            </li>
            <li className="p-4 rounded text-center bg-yellow-600 shadow-md">
              <span className="block text-3xl font-bold">
                {resources.ducats}
              </span>
              <span className="text-xl">Ducats</span>
            </li>
          </ul>
        </div>
        {/* User Search Section */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search amongst the lords."
            className="w-full p-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* User List */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-3xl font-serif font-semibold mb-6 border-b border-yellow-600 pb-2 text-yellow-300">
            Users
          </h2>
          <ul className="space-y-4">
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <img
                  src={user.imageUrl}
                  alt={user.name || "User"}
                  className="h-20 w-20 rounded-full border-2 border-yellow-400"
                />
                <span className="text-xl text-white">{user.name}</span>
                <button
                  onClick={() => openModal(user.name, user.id)}
                  className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                >
                  Send Boon
                </button>
                {role === "ADMIN" && (
                  <button
                    onClick={() => openAdminModal(user.name, user.id)}
                    className=""
                  >
                    Manage Resources
                  </button>
                )}
              </li>
            ))}
          </ul>
          {/* Tranfer Modal */}
          <div className="flex items-center justify-center min-h-screen bg-gray-900">
            {modalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="relative bg-gray-800 text-yellow-300 p-6 rounded-lg shadow-xl border-4 border-yellow-700 max-w-lg w-full">
                  <button
                    className="absolute top-2 right-2 text-yellow-300 hover:text-red-500 text-2xl"
                    onClick={() => setModalOpen(false)}
                  >
                    ×
                  </button>
                  <h2 className="text-3xl font-bold font-serif text-center border-b-2 border-yellow-600 pb-2 mb-4">
                    Send your Boon to {toUser}
                  </h2>
                  <p className="text-lg font-serif text-center mb-4">
                    Select the resource and amount
                  </p>

                  <div className="mb-4">
                    <label className="block text-yellow-400 font-bold mb-2">
                      Enter Amount
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 rounded bg-gray-700 border border-yellow-600 text-yellow-300"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="How many?"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-yellow-400 font-bold mb-2">
                      Choose the type of boon:
                    </label>
                    <select
                      value={resource}
                      onChange={(e) => setResource(e.target.value)}
                      className="w-full p-2 rounded bg-gray-700 border border-yellow-600 text-yellow-300"
                    >
                      <option value="wood">Wood</option>
                      <option value="stone">Stone</option>
                      <option value="food">Food</option>
                      <option value="ducats">Ducats</option>
                    </select>

                    <button
                      onClick={transferResources}
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                    >
                      Send your Resources!
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Admin Modal*/}
          <div className="flex items-center justify-center min-h-screen bg-gray-900">
            {adminModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="relative bg-gray-800 text-yellow-300 p-6 rounded-lg shadow-xl border-4 border-yellow-700 max-w-lg w-full">
                  <button
                    className="absolute top-2 right-2 text-yellow-300 hover:text-red-500 text-2xl"
                    onClick={() => closeAdminModal()}
                  >
                    ×
                  </button>
                  <h2 className="text-3xl font-bold font-serif text-center border-b-2 border-yellow-600 pb-2 mb-4">
                    Manage {toUser}'s Resources
                  </h2>
                  <p className="text-lg font-serif text-center mb-4">
                    Select the resource and amount you'd like to add or remove
                  </p>

                  <div className="mb-4">
                    <label className="block text-yellow-400 font-bold mb-2">
                      Enter Amount
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 rounded bg-gray-700 border border-yellow-600 text-yellow-300"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="How many?"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-yellow-400 font-bold mb-2">
                      Choose the type of boon:
                    </label>
                    <select
                      value={resource}
                      onChange={(e) => setResource(e.target.value)}
                      className="w-full p-2 rounded bg-gray-700 border border-yellow-600 text-yellow-300"
                    >
                      <option value="wood">Wood</option>
                      <option value="stone">Stone</option>
                      <option value="food">Food</option>
                      <option value="ducats">Ducats</option>
                    </select>

                    <button className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                      Send your Resources!
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
