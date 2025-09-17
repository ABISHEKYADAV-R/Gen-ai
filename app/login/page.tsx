"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    // Save name to localStorage for dashboard
    localStorage.setItem("artisanName", name);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center">
        <div className="mb-8 text-center">
          <span className="text-3xl font-extrabold text-purple-600">
            CraftAI
          </span>
          <div className="text-base font-semibold text-gray-500 mt-1">
            Artisan Login
          </div>
        </div>
        <h2 className="text-2xl font-extrabold mb-4 text-gray-800">
          Sign in to your dashboard
        </h2>
        <div className="w-full mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </div>
        <div className="w-full mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow hover:scale-105 transition-transform">
          Login
        </Button>
      </form>
    </div>
  );
}
