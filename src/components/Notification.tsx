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
      className={`fixed top-24 right-4 z-50 max-w-md w-full mx-4 transform transition-all duration-500 ease-out animate-slide-left ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`relative p-4 rounded-xl border backdrop-blur-md shadow-2xl overflow-hidden ${getStyles()}`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                type === "success"
                  ? "bg-emerald-500/20"
                  : type === "error"
                  ? "bg-red-500/20"
                  : "bg-blue-500/20"
              }`}
            >
              <span
                className={`text-lg ${
                  type === "success"
                    ? "text-emerald-400"
                    : type === "error"
                    ? "text-red-400"
                    : "text-blue-400"
                }`}
              >
                {getIcon()}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medieval text-base font-semibold mb-1">
              {type === "success" && "Success!"}
              {type === "error" && "Error!"}
              {type === "info" && "Information"}
            </h3>

            <p className="text-sm leading-relaxed opacity-90">{message}</p>

            {details && (
              <p className="text-xs opacity-70 mt-1 italic">{details}</p>
            )}
          </div>

          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 text-lg hover:opacity-100 opacity-60 transition-opacity duration-200"
          >
            ×
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20 rounded-b-xl overflow-hidden">
          <div
            className="h-full bg-current opacity-60 transition-all duration-100 ease-linear"
            style={{
              width: `${
                ((duration - (Date.now() - Date.now())) / duration) * 100
              }%`,
            }}
          />
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
    <div className="fixed top-24 right-4 z-50 space-y-3">
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
