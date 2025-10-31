"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide global navbar on homepage (root path) - homepage has its own navbar
  if (pathname === "/") {
    return null;
  }
  
  return <Navbar />;
}

