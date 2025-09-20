'use client';

import { Button } from "@/components/ui/button";
import { Palette, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../backend/firebase/authService";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0];

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">CraftAI</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex space-x-10 text-gray-700 font-medium">
          <a href="#features" className="hover:text-purple-600 transition-colors">
            Features
          </a>
          <a href="#marketplace" className="hover:text-purple-600 transition-colors">
            Marketplace
          </a>
          {user && (
            <Link href="/dashboard" className="hover:text-purple-600 transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="flex items-center space-x-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName || "User"}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-medium text-sm">
                      {displayName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {displayName}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg px-5">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
