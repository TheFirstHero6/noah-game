"use client";

import { useEffect } from "react";

export default function Chatbot() {
  useEffect(() => {
    // Ensure the chatbot script is loaded and positioned correctly
    const style = document.createElement("style");
    style.textContent = `
  
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
