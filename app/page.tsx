"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShoppingCart, Globe, Sparkles, Star, ArrowRight, Check } from "lucide-react";
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
                const offset = 72; // height of navbar (px)
                if (item.target === "top") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  const el = document.getElementById(item.target);
                  if (el) {
                    // For "Pricing", scroll to the CTA section, not the image
                    if (item.target === "cta") {
                      const y =
                        el.getBoundingClientRect().top +
                        window.scrollY -
                        offset;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    } else {
                      const y =
                        el.getBoundingClientRect().top +
                        window.scrollY -
                        offset;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }
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
      {/* Hero Section */}
      <section className="relative px-10 pt-24 pb-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative grid md:grid-cols-2 gap-16 max-w-7xl mx-auto items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-8">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg shadow-lg"
              >
                <Sparkles className="mr-3 w-5 h-5" />
                AI-Powered Craft Platform
              </motion.span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl md:text-7xl font-black leading-tight mb-8"
            >
              Transform Your{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Craft
              </span>{" "}
              Into Global Success
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-700 mb-10 max-w-2xl leading-relaxed"
            >
              Empower artisans with AI storytelling, smart commerce tools, and
              global marketplace access. Turn your passion into profit with zero technical skills required.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Button 
                onClick={() => router.push("/login")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="mr-3 w-6 h-6" />
                Start Selling Now
              </Button>
              <Button
                variant="outline"
                className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-10 py-6 rounded-2xl text-xl font-bold hover:border-purple-400 transition-all duration-300"
              >
                <ArrowRight className="mr-3 w-6 h-6" />
                Watch Demo
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-8 mt-12"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <img src="/images/maya-profile.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                  <img src="/images/sarah-avatar.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                  <img src="/images/hero-image.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-purple-500 flex items-center justify-center text-white text-sm font-bold">+2K</div>
                </div>
                <span className="text-gray-600 font-medium">2,000+ artisans</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-gray-600 font-medium">4.9/5 rating</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="relative z-10"
              >
                <Card className="rounded-3xl shadow-2xl bg-white border-0 overflow-hidden">
                  <div className="w-full h-80 bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden">
                    <img
                      src="/images/hero-image.jpg"
                      alt="Beautiful ceramic art"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <img src="/images/maya-profile.jpg" alt="Maya" className="w-12 h-12 rounded-full" />
                      <div>
                        <h3 className="font-bold text-xl">Maya's Ceramic Art</h3>
                        <p className="text-gray-500">Ceramic Artist from Indonesia</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Hand-crafted with 200+ years of family tradition, each piece tells a story of heritage and artistry.
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-black text-3xl text-purple-600">$89</span>
                      <div className="flex items-center gap-2 text-yellow-500">
                        <Star className="w-6 h-6 fill-current" />
                        <span className="font-bold text-xl">4.9</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-green-600 font-semibold">
                      <Globe className="w-5 h-5" />
                      Ships globally • In stock
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Heritage Meets Technology
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our AI-powered platform bridges traditional craftsmanship with modern
              commerce, creating unlimited opportunities for artisans worldwide.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Sparkles className="w-12 h-12 text-white" />,
                title: "AI Storytelling",
                description: "Transform simple product photos and voice notes into compelling stories that connect with global buyers.",
                features: ["Voice-to-story conversion", "Multi-language support", "Cultural context awareness"],
                color: "from-purple-500 to-purple-700"
              },
              {
                icon: <ShoppingCart className="w-12 h-12 text-white" />,
                title: "Smart Commerce",
                description: "Auto-generated storefronts with integrated payments, shipping, and marketing campaigns.",
                features: ["Instant storefront creation", "Global payment processing", "Automated marketing"],
                color: "from-orange-500 to-red-500"
              },
              {
                icon: <Globe className="w-12 h-12 text-white" />,
                title: "Global Reach",
                description: "Connect with buyers worldwide through our curated marketplace and recommendation engine.",
                features: ["AI-powered recommendations", "International shipping", "Cultural authenticity badges"],
                color: "from-pink-500 to-rose-500"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <Card className="p-10 h-full bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:border-purple-200 hover:shadow-2xl transition-all duration-300">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-black text-2xl mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">{feature.description}</p>
                  <ul className="space-y-4">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center text-gray-700 font-medium">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
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