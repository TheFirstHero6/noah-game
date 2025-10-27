"use client";

import { useEffect } from "react";

export default function Chatbot() {
  useEffect(() => {
    // Ensure the chatbot script is loaded and positioned correctly
    const style = document.createElement("style");
    style.textContent = `
      /* JotForm Chatbot Positioning */
      .jotform-agent-widget {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 9999 !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(234, 179, 8, 0.3) !important;
      }
      
      /* Chatbot button styling to match medieval theme */
      .jotform-agent-widget button {
        background: linear-gradient(135deg, rgba(234, 179, 8, 0.9) 0%, rgba(202, 138, 4, 0.9) 100%) !important;
        border: 2px solid rgba(234, 179, 8, 0.6) !important;
        border-radius: 12px !important;
        color: #1e293b !important;
        font-weight: bold !important;
        box-shadow: 0 4px 20px rgba(234, 179, 8, 0.3) !important;
        transition: all 0.3s ease !important;
      }
      
      .jotform-agent-widget button:hover {
        transform: translateY(-2px) scale(1.05) !important;
        box-shadow: 0 8px 25px rgba(234, 179, 8, 0.4) !important;
        border-color: rgba(234, 179, 8, 0.8) !important;
      }
      
      /* Chatbot window styling */
      .jotform-agent-widget .chat-window {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%) !important;
        border: 1px solid rgba(234, 179, 8, 0.3) !important;
        border-radius: 12px !important;
        backdrop-filter: blur(10px) !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
      }
      
      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .jotform-agent-widget {
          bottom: 15px !important;
          right: 15px !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove the style when component unmounts
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}
