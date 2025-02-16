import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import logo from "./logo.png";
import Link from "next/link";
import GameInfo from "./game-info";
export default function Navbar() {
  return (
    <div className="sticky top-0 z-30 border-b bg-background px-4 sm:px-6">
      <div className="auth-containter flex items-center justify-between mx-auto max-w-4xl h-20">
        <Link href="/">
          <Image
            src={logo}
            alt="logo"
            className="h-16 w-16 rounded-full object-cover"
          />
        </Link>

        <Link href="/dashboard">
          <h1 className="hover:text-gray-600 transition duration-300">
            Dashboard
          </h1>
        </Link>

        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton showName />
        </SignedIn>
      </div>
    </div>
  );
}
