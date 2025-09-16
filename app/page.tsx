"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShoppingCart, Globe, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-3 shadow-md fixed top-0 left-0 right-0 bg-white z-50">
        <div className="text-xl font-bold text-purple-600">CraftAI</div>
        <nav className="space-x-6 text-gray-700 hidden md:flex">
          {[
            { name: "Home", target: "top" },
            { name: "Features", target: "features" },
            { name: "Stories", target: "dashboard" },
            { name: "Pricing", target: "cta" },
          ].map((item) => (
            <a
              key={item.name}
              href={"#" + item.target}
              className="relative transition-colors duration-200 hover:text-purple-600 group"
              onClick={(e) => {
                e.preventDefault();
                if (item.target === "top") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  const el = document.getElementById(item.target);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}>
              {item.name}
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
          ))}
        </nav>
        <div className="space-x-2">
          <Button
            variant="ghost"
            className="px-3 py-1 text-sm"
            onClick={() => router.push("/login")}>
            Sign In
          </Button>
          <Button
            className="bg-purple-600 text-white px-4 py-1 text-sm"
            onClick={() => router.push("/login")}>
            Get Started
          </Button>
        </div>
      </header>
      <div className="pt-[72px]"></div>{" "}
      {/* Increased padding to 72px for better spacing */}
      {/* Hero Section */}
      <section className="px-10 py-10 bg-[#f8f3fc]">
        <div className="grid md:grid-cols-2 gap-10 h-full items-center">
          <div className="flex flex-col justify-center h-full">
            <div className="mb-6">
              <span className="inline-flex items-center px-5 py-2 rounded-full bg-white shadow text-purple-700 font-medium text-base">
                <svg
                  className="mr-2"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h4v4" />
                </svg>
                AI-Powered Craft Platform
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Transform Your{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent">
                Craft
              </span>{" "}
              Into Global Success
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              Empower artisans with AI storytelling, smart commerce tools, and
              global marketplace access. No technical skills required.
            </p>
            <div className="flex space-x-4">
              <Button className="bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 shadow">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path d="M2 12l10 7 10-7-10-7-10 7z" />
                </svg>
                Start Selling Now
              </Button>
              <Button
                variant="outline"
                className="px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 border-gray-300 shadow">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center h-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-full max-w-lg">
              <Card className="rounded-2xl shadow-xl bg-white p-0">
                <div className="w-full aspect-[16/9] bg-gray-100 overflow-hidden rounded-t-2xl">
                  <img
                    src="/images/hero-image.jpg"
                    alt="Craft sample"
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-1 text-left">
                    Maya's Ceramic Art
                  </h3>
                  <p className="text-gray-600 text-left mb-4">
                    Hand-crafted with 200+ years of family tradition
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl text-left">$89</span>
                    <span className="flex items-center gap-2 text-yellow-500 font-medium text-base">
                      <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.174 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                      </svg>
                      4.9
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-gray-500 text-sm">
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="2"
                      viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2v20" />
                    </svg>
                    Ships globally
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Features */}
      <section id="features" className="py-10 px-10 text-center">
        <h2 className="text-3xl font-bold mb-6">Heritage Meets Technology</h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
          Our AI-powered platform bridges traditional craftsmanship with modern
          commerce, creating opportunities for artisans worldwide.
        </p>
        <div className="grid md:grid-cols-3 gap-8 justify-center">
          {/* AI Storytelling */}
          <Card className="p-8 flex flex-col items-center text-center">
            <div className="bg-purple-500 rounded-xl p-4 mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-2xl mb-2">AI Storytelling</h3>
            <p className="text-gray-600 mb-4">
              Transform simple product photos and voice notes into compelling
              stories that connect with global buyers.
            </p>
            <ul className="space-y-2 mt-2">
              <li className="flex items-center justify-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span> Voice-to-story
                conversion
              </li>
              <li className="flex items-center justify-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span> Multi-language
                support
              </li>
              <li className="flex items-center justify-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span> Cultural context
                awareness
              </li>
            </ul>
          </Card>

          {/* Smart Commerce */}
          <Card className="p-8 flex flex-col items-center text-center">
            <div className="bg-orange-500 rounded-xl p-4 mb-6">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-2xl mb-2">Smart Commerce</h3>
            <p className="text-gray-600 mb-4">
              Auto-generated storefronts with integrated payments, shipping, and
              marketing campaigns.
            </p>
            <ul className="space-y-2 mt-2">
              <li className="flex items-center justify-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span> Instant
                storefront creation
              </li>
              <li className="flex items-center justify-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span> Global payment
                processing
              </li>
              <li className="flex items-center justify-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span> Automated
                marketing
              </li>
            </ul>
          </Card>

          {/* Global Reach */}
          <Card className="p-8 flex flex-col items-center text-center">
            <div className="bg-pink-500 rounded-xl p-4 mb-6">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-2xl mb-2">Global Reach</h3>
            <p className="text-gray-600 mb-4">
              Connect with buyers worldwide through our curated marketplace and
              recommendation engine.
            </p>
            <ul className="space-y-2 mt-2">
              <li className="flex items-center justify-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span> AI-powered
                recommendations
              </li>
              <li className="flex items-center justify-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span> International
                shipping
              </li>
              <li className="flex items-center justify-center text-gray-700">
                <span className="text-green-500 mr-2">✓</span> Cultural
                authenticity badges
              </li>
            </ul>
          </Card>
        </div>
      </section>
      {/* Dashboard Section */}
      <section
        id="dashboard"
        className="py-10 px-4 md:px-10 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-center mb-1">
          Simple Dashboard for Artisans
        </h2>
        <p className="text-lg text-gray-600 text-center mb-6">
          Upload your craft, let AI create your story, and watch sales grow
          globally
        </p>
        <div className="w-full max-w-4xl">
          <div className="rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-6 flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src="/images/maya-profile.jpg"
                  alt="Maya profile"
                  className="w-12 h-12 rounded-full border-2 border-white mr-4"
                />
                <div>
                  <div className="text-white font-semibold">
                    Welcome back, Maya!
                  </div>
                  <div className="text-white text-sm opacity-80">
                    Ceramic Artist from Indonesia
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">$2,847</div>
                <div className="text-white text-sm opacity-80">
                  This month's earnings
                </div>
              </div>
            </div>
            <div className="bg-white px-8 py-8 grid md:grid-cols-3 gap-8">
              {/* Quick Upload */}
              <div>
                <div className="font-semibold mb-3 flex items-center gap-2">
                  <img
                    src="/images/upload-icon.png"
                    alt="Upload"
                    className="w-5 h-5"
                  />
                  Quick Upload
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-8">
                  <img
                    src="/images/camera-icon.png"
                    alt="Camera"
                    className="w-10 h-10 mb-2 opacity-60"
                  />
                  <div className="text-gray-500 mb-2">
                    Take a photo of your craft
                  </div>
                  <a href="#" className="text-purple-600 font-semibold">
                    Choose Image
                  </a>
                </div>
              </div>
              {/* AI Generated Story */}
              <div>
                <div className="font-semibold mb-3 flex items-center gap-2">
                  <img
                    src="/images/story-icon.png"
                    alt="Story"
                    className="w-5 h-5"
                  />
                  AI Generated Story
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm mb-2">
                  "This beautiful ceramic bowl carries the wisdom of my
                  grandmother's hands, shaped by centuries of Javanese pottery
                  traditions..."
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Generated in 3 seconds</span>
                  <a href="#" className="text-purple-600 font-semibold">
                    Edit Story
                  </a>
                </div>
              </div>
              {/* Performance */}
              <div>
                <div className="font-semibold mb-3 flex items-center gap-2">
                  <img
                    src="/images/performance-icon.png"
                    alt="Performance"
                    className="w-5 h-5"
                  />
                  <span className="text-pink-500">Performance</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Products Listed</span>
                    <span className="font-bold text-gray-900">24</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Global Views</span>
                    <span className="font-bold text-gray-900">1,847</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Sales This Week</span>
                    <span className="font-bold text-green-500">+18</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Marketplace */}
      <section id="marketplace" className="py-10 px-10 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-1">Global Marketplace</h2>
        <p className="text-gray-500 text-lg mb-6">
          Discover authentic crafts from artisans around the world
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              name: "Traditional Ikat Textile",
              price: "$145",
              img: "/images/ikat-textile.jpg",
              subtitle: "By Sari from Bali",
              rating: 4.8,
              contain: false,
            },
            {
              name: "Hand-Carved Sculpture",
              price: "$289",
              img: "/images/hand-carved-sculpture.jpg",
              subtitle: "By Carlos from Mexico",
              rating: 4.9,
              contain: true,
            },
            {
              name: "Silver Bead Necklace",
              price: "$67",
              img: "/images/silver-bead-necklace.jpg",
              subtitle: "By Amara from Morocco",
              rating: 4.7,
              contain: false,
            },
            {
              name: "Woven Storage Basket",
              price: "$34",
              img: "/images/woven-storage-basket.jpg",
              subtitle: "By Kemi from Ghana",
              rating: 5.0,
              contain: false,
            },
          ].map((item, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.05 }}>
              <Card className="shadow-md rounded-2xl overflow-hidden relative bg-white">
                <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className={
                      item.contain
                        ? "object-contain w-full h-full"
                        : "object-cover w-full h-full"
                    }
                  />
                </div>
                <CardContent className="pt-4 pb-2 px-4">
                  <h3 className="font-semibold text-lg text-left">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-left text-sm">
                    {item.subtitle}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-xl">{item.price}</span>
                    <span className="flex items-center gap-1 text-yellow-500 font-medium text-sm">
                      <svg
                        width="18"
                        height="18"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.174 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                      </svg>
                      {item.rating}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <Button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl text-lg">
          Explore All Products
        </Button>
      </section>
      {/* CTA */}
      <section
        id="cta"
        className="py-10 px-10 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Transform Your Craft?
        </h2>
        <p className="text-lg mb-4">
          Join thousands of artisans already selling globally with AI-powered
          storytelling.
        </p>
        <div className="flex justify-center space-x-6">
          <Button className="bg-white text-purple-600 px-6 py-3 rounded-xl text-lg">
            Start Free Trial
          </Button>
          <Button
            variant="outline"
            className="border-white text-purple-600 px-6 py-3 rounded-xl text-lg">
            Schedule Demo
          </Button>
        </div>
      </section>
    </div>
  );
}
