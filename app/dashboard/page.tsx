"use client";

import { useState } from "react";
import {
  Home,
  Package,
  BookOpen,
  Truck,
  BarChart2,
  LogOut,
  Menu,
  X,
  Bell,
  Plus,
  DollarSign,
  Box,
  PackageOpen,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Dashboard", icon: Home },
  { name: "My Products", icon: Package },
  { name: "My Story", icon: BookOpen },
  { name: "Orders", icon: Truck },
  { name: "Analytics", icon: BarChart2 },
];

export default function ArtisanDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const userName = "Sarah Miller";

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-sm">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full z-40 bg-white border-r transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-0 md:w-64"} overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-amber-700 flex items-center justify-center text-white font-bold">
              CH
            </div>
            <div>
              <div className="text-base font-semibold">CraftHub</div>
              <div className="text-xs text-gray-400">Artisan Portal</div>
            </div>
          </div>
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {navItems.map((item) => {
            const active = item.name === "Dashboard";
            return (
              <a
                key={item.name}
                href="#"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  active
                    ? "bg-amber-100 text-amber-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}>
                <item.icon
                  className={`w-5 h-5 ${
                    active ? "text-amber-700" : "text-gray-500"
                  }`}
                />
                <span className="font-medium">{item.name}</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pb-6">
          <div className="mt-8 flex items-center gap-3">
            <img
              src="/images/sarah-avatar.jpg"
              alt="Sarah"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-medium">Sarah Miller</div>
              <div className="text-xs text-gray-400">Ceramic Artist</div>
            </div>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 w-full flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-full shadow p-2"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar">
        <Menu className="w-5 h-5 text-amber-700" />
      </button>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:ml-64">
        <div className="px-6 py-6 border-b bg-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold">
                Welcome back, Sarah <span className="inline-block">👋</span>
              </h2>
              <p className="text-sm text-gray-500">
                Here's what's happening with your craft business today
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-md hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-0.5 -right-0.5 text-xs bg-rose-500 text-white rounded-full px-1">
                  3
                </span>
              </button>
              <button
                onClick={() => alert("Quick Add")}
                className="flex items-center gap-2 bg-amber-700 text-white px-3 py-2 rounded-md shadow">
                <Plus className="w-4 h-4" />
                Quick Add
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Total Sales</div>
                  <div className="text-xl font-bold">$2,847</div>
                  <div className="text-xs text-green-600 mt-1">
                    +12.5% from last month
                  </div>
                </div>
                <div className="bg-emerald-100 rounded-md p-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Products</div>
                  <div className="text-xl font-bold">24</div>
                  <div className="text-xs text-blue-600 mt-1">
                    +3 new this week
                  </div>
                </div>
                <div className="bg-blue-50 rounded-md p-2">
                  <Box className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Orders</div>
                  <div className="text-xl font-bold">18</div>
                  <div className="text-xs text-amber-600 mt-1">
                    5 pending · 2 shipped today
                  </div>
                </div>
                <div className="bg-pink-50 rounded-md p-2">
                  <PackageOpen className="w-5 h-5 text-pink-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Views</div>
                  <div className="text-xl font-bold">1,247</div>
                  <div className="text-xs text-rose-500 mt-1">
                    +8.2% from last week
                  </div>
                </div>
                <div className="bg-orange-50 rounded-md p-2">
                  <Eye className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Quick Action</div>
                  <h3 className="text-lg font-bold mt-1">
                    Instant Product Listing
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Upload photos and set prices for your crafts in minutes. Our
                    smart pricing suggestions help you stay competitive.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full bg-amber-700 text-white py-3 rounded-md">
                  + Add New Product
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">AI Powered</div>
                  <h3 className="text-lg font-bold mt-1">My Story Builder</h3>
                  <p className="text-gray-500 mt-2">
                    Let AI help you craft compelling stories about your artisan
                    journey. Engage customers with your unique narrative.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full bg-indigo-600 text-white py-3 rounded-md">
                  Create My Story
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">5 Pending</div>
                  <h3 className="text-lg font-bold mt-1">Orders & Logistics</h3>
                  <p className="text-gray-500 mt-2">
                    Track your orders, manage shipping, and keep customers
                    updated with real-time delivery information.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full bg-emerald-600 text-white py-3 rounded-md">
                  Manage Orders
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Updated</div>
                  <h3 className="text-lg font-bold mt-1">
                    Analytics Dashboard
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Deep insights into your sales performance, customer reach,
                    and product popularity to grow your business.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full bg-purple-600 text-white py-3 rounded-md">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
