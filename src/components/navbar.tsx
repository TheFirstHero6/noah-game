import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import logo from "./logo.png";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky justify-center top-0 z-30 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-yellow-600 px-4 sm:px-6 shadow-lg">
      <div className="flex items-center justify-between mx-auto max-w-4xl h-20">
        <Link href="/">
          <Image
            src={logo}
            alt="logo"
            className="h-16 w-16 rounded-full object-cover transform transition-transform duration-300 hover:scale-110"
          />
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/pages/dashboard">
            <h1 className="text-xl text-yellow-300 font-bold tracking-wider hover:text-yellow-500 transition-colors duration-300">
              Dashboard
            </h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox:
                    "border border-yellow-600 hover:scale-110 transition-transform duration-300",
                  userButtonPopoverCard: "bg-gray-800",
                },
              }}
              showName
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
