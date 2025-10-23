"use client";

import { useState, useEffect } from "react";

interface NotificationProps {
  type: "success" | "error" | "info";
  message: string;
  details?: string;
  onClose: () => void;
  duration?: number;
}

export default function Notification({
  type,
  message,
  details,
  onClose,
  duration = 5000,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-medieval-emerald-800 to-medieval-emerald-700 border-medieval-emerald-600 text-medieval-emerald-100";
      case "error":
        return "bg-gradient-to-r from-medieval-crimson-800 to-medieval-crimson-700 border-medieval-crimson-600 text-medieval-crimson-100";
      case "info":
        return "bg-gradient-to-r from-medieval-royal-800 to-medieval-royal-700 border-medieval-royal-600 text-medieval-royal-100";
      default:
        return "bg-gradient-to-r from-medieval-steel-800 to-medieval-steel-700 border-medieval-steel-600 text-medieval-steel-100";
    }
  };

  return (
    <div
      className={`fixed top-24 right-4 z-50 max-w-md w-full mx-4 transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className={`medieval-card p-6 border-2 ${getStyles()} shadow-2xl`}>
        <div className="flex items-start space-x-4">
          <div className="text-2xl flex-shrink-0">{getIcon()}</div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medieval text-lg font-semibold mb-2">
              {type === "success" && "Boon Sent Successfully!"}
              {type === "error" && "Transaction Failed!"}
              {type === "info" && "Information"}
            </h3>

            <p className="medieval-text text-sm leading-relaxed">{message}</p>

            {details && (
              <p className="text-xs opacity-80 mt-2 italic">{details}</p>
            )}
          </div>

          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 text-lg hover:text-medieval-gold-300 transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for managing notifications
export function useNotification() {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info";
      message: string;
      details?: string;
      duration?: number;
    }>
  >([]);

  const addNotification = (
    type: "success" | "error" | "info",
    message: string,
    details?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [
      ...prev,
      { id, type, message, details, duration },
    ]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const NotificationContainer = () => (
    <div className="fixed top-0 right-0 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          details={notification.details}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );

  return {
    addNotification,
    removeNotification,
    NotificationContainer,
  };
}
