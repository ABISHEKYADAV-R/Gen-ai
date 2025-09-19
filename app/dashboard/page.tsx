"use client";

import { useState, useEffect } from "react";
import { Bell, Plus, LogOut, LayoutDashboard, Package, BookOpen, ShoppingCart, BarChart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string>("Artisan");
  const router = useRouter();

  useEffect(() => {
    // Load name from localStorage
    const storedName = localStorage.getItem("artisanName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-sm">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "fixed w-64" : "w-0"
        } md:static md:w-64 h-screen flex flex-col justify-between bg-white border-r transition-all duration-300 overflow-hidden z-40`}
      >
        {/* Top Section (Logo + Nav) */}
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <h1 className="text-lg font-extrabold text-amber-700">CraftHub</h1>
          </div>

          <nav className="mt-6 px-3 space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-amber-50 text-amber-700 font-medium">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </a>
            <a 
              href="/instant-product-listing" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50"
              onClick={(e) => {
                e.preventDefault();
                router.push("/instant-product-listing");
              }}
            >
              <Package className="w-4 h-4" /> My Products
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50">
              <BookOpen className="w-4 h-4" /> My Story
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50">
              <ShoppingCart className="w-4 h-4" /> Orders
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50">
              <BarChart className="w-4 h-4" /> Analytics
            </a>
          </nav>
        </div>

        {/* Bottom Section (Profile + Logout) */}
        <div className="px-4 pb-6 border-t">
          <div className="flex items-center gap-3">
            <img
              src="/images/sarah-avatar.jpg"
              alt={userName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-medium">{userName}</div>
              <div className="text-xs text-gray-400">Ceramic Artist</div>
            </div>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 w-full flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-6 border-b bg-white flex items-center justify-between">
          {/* Left section: Avatar + Welcome */}
          <div className="flex items-center gap-4">
            <img
              src="/images/sarah-avatar.jpg"
              alt={userName}
              className="w-12 h-12 rounded-full border-2 border-amber-700"
            />
            <div>
              <h2 className="text-xl font-extrabold">
                Welcome back, {userName} <span className="inline-block">👋</span>
              </h2>
              <p className="text-sm text-gray-500">
                Here's what's happening with your craft business today
              </p>
            </div>
          </div>

          {/* Right section: Notification + Quick Add */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-md hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 text-xs bg-rose-500 text-white rounded-full px-1">
                3
              </span>
            </button>
            <button 
              className="flex items-center gap-2 bg-amber-700 text-white px-3 py-2 rounded-md shadow"
              onClick={() => router.push("/instant-product-listing")}
            >
              <Plus className="w-4 h-4" />
              Quick Add
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* KPI Cards */}
          <div className="p-4 bg-white rounded-lg border shadow-sm">
            <p className="text-gray-500 text-sm">Total Sales</p>
            <h3 className="text-2xl font-bold">$2,847</h3>
            <p className="text-green-600 text-sm mt-1">+12.5% from last month</p>
          </div>
          <div className="p-4 bg-white rounded-lg border shadow-sm">
            <p className="text-gray-500 text-sm">Products</p>
            <h3 className="text-2xl font-bold">24</h3>
            <p className="text-blue-600 text-sm mt-1">+3 new this week</p>
          </div>
          <div className="p-4 bg-white rounded-lg border shadow-sm">
            <p className="text-gray-500 text-sm">Orders</p>
            <h3 className="text-2xl font-bold">18</h3>
            <p className="text-purple-600 text-sm mt-1">5 pending · 2 shipped today</p>
          </div>
          <div className="p-4 bg-white rounded-lg border shadow-sm">
            <p className="text-gray-500 text-sm">Views</p>
            <h3 className="text-2xl font-bold">1,247</h3>
            <p className="text-red-600 text-sm mt-1">+8.2% from last week</p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-700 text-white flex items-center justify-center rounded">
                ⬆
              </span>
              Instant Product Listing
            </h3>
            <p className="text-gray-600 mt-2">
              Upload photos and set prices for your crafts in minutes. Our smart
              pricing suggestions help you stay competitive.
            </p>
            <button 
              className="mt-4 w-full bg-amber-700 text-white py-2 rounded-md"
              onClick={() => router.push("/instant-product-listing")}
            >
              + Add New Product
            </button>
          </div>
          <div className="p-6 bg-white rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center rounded">
                ✨
              </span>
              My Story Builder
            </h3>
            <p className="text-gray-600 mt-2">
              Let AI help you craft compelling stories about your artisan
              journey. Engage customers with your unique narrative.
            </p>
            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md"
              onClick={() => router.push("/story-builder")}
            >
              ✎ Create My Story
            </button>
          </div>
          <div className="p-6 bg-white rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-6 h-6 bg-green-600 text-white flex items-center justify-center rounded">
                🚚
              </span>
              Orders & Logistics
            </h3>
            <p className="text-gray-600 mt-2">
              Track your orders, manage shipping, and keep customers updated
              with real-time delivery information.
            </p>
            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md">
              📦 Manage Orders
            </button>
          </div>
          <div className="p-6 bg-white rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-600 text-white flex items-center justify-center rounded">
                📊
              </span>
              Analytics Dashboard
            </h3>
            <p className="text-gray-600 mt-2">
              Deep insights into your sales performance, customer reach, and
              product popularity to grow your business.
            </p>
            <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-md">
              📈 View Analytics
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
