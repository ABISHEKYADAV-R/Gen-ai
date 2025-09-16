"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center">
        <div className="mb-8 text-center">
          <span className="text-3xl font-extrabold text-purple-600">
            CraftAI
          </span>
          <div className="text-base font-semibold text-gray-500 mt-1">
            Smart AI Solutions
          </div>
        </div>
        <h2 className="text-2xl font-extrabold mb-4 text-gray-800">
          Sign in to your account
        </h2>
        <div className="flex gap-4 mb-6 w-full">
          <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow hover:scale-105 transition-transform">
            Google Login
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-400 text-white font-bold py-3 rounded-xl shadow hover:scale-105 transition-transform">
            Email Login
          </Button>
        </div>
        <Button
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow flex items-center justify-center gap-2 mb-4 hover:scale-105 transition-transform"
          onClick={() => router.push("/dashboard")}>
          <span className="text-lg font-bold">G</span>
          Continue with Google
        </Button>
        <div className="text-center text-gray-400 text-sm mt-2 mb-6 font-medium">
          Secure authentication with your Google account
        </div>
        <div className="border-t border-gray-200 my-4 w-full"></div>
        <div className="text-center text-gray-500 text-base font-medium">
          Don't have an account?{" "}
          <a href="#" className="text-purple-600 font-bold hover:underline">
            Sign up for free
          </a>
        </div>
      </div>
    </div>
  );
}
