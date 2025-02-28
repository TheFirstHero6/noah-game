"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";
import Image from "next/image";
import { transferResources } from "@/app/lib/resources";
import logo from "@/app/pages/logo.gif";
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
  const [selectedUserId, setSelectedUserId] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState("");
  let fetchedUsers = false;
  let fetchedResources = false;
  let fetchedUsername = false;
  let fetchedUserpic = false;

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

  // const handleTransfer = async () => {
  //   if (amount <= 0) {
  //     throw new Error("Enter valid amount");
  //   }

  //   try {
  //     const response = await fetch("/api/dashboard/transations", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         toUserId: selectedUserId,
  //         amount: amount,
  //         resource: resourceType,
  //       }),
  //     });

  //     const data = await response.json();
  //     if (!response.ok) {
  //       throw (
  //         (new Error(
  //           `These horses aren't what they used to be, They couldn't send your resource`,
  //         ),
  //         alert(
  //           `These horses aren't what they used to be, They couldn't send your resource`,
  //         ))
  //       );
  //     }
  //     alert(`Your resources have been sent, my lord`);
  //   } catch (error) {
  //     throw new Error(
  //       `These horses aren't what they used to be, They couldn't send your resources`,
  //     );
  //   }
  // };
  const modalOpener = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUsername(userName);
    setIsModalOpen(true);
  };
  const modalCloser = () => {
    setIsModalOpen(false);
    setSelectedUserId("");
    setSelectedUsername("");
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

  useEffect(() => {
    fetchUsernameOnce();
    fetchResourcesOnce();
    fetchUserpicOnce();
    fetchUsersOnce();
  }, []);

  const welcomePrefix = username ? `${username}'s` : "";
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  console.log();
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
            placeholder="Search amongst the lords..."
            className="w-full p-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* User List */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-3xl font-semibold mb-6 border-b border-yellow-600 pb-2 text-yellow-300">
            lords
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
                {/* <button
                  onClick={() => modalOpener(user.id, user.name)}
                  className="active:translate-y-0.5 active:shadow-sm relative px-5 py-2 text-lg font-medium text-tan-300 bg-gradient-to-b from-red-900 to-red-700 border border-red-600 rounded-lg shadow-md hover:from-red-800 hover:to-red-600 hover:border-red-500 hover:text-tan-200 transition-all duration-200 ease-in-out active:scale-95 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Send Resources
                </button> */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
