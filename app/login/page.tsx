"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, User, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.email || (!isSignUp && !formData.password) || (isSignUp && (!formData.name || !formData.password))) return;
    
    // Save name to localStorage for dashboard
    if (isSignUp && formData.name) {
      localStorage.setItem("artisanName", formData.name);
    } else if (!isSignUp) {
      localStorage.setItem("artisanName", formData.email.split('@')[0]);
    }
    
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <div className="mb-8">
            <Sparkles className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-black mb-4">CraftAI</h1>
            <p className="text-xl opacity-90">AI-Powered Craft Platform</p>
          </div>
          
          <div className="space-y-6 max-w-md">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <h3 className="font-bold text-lg mb-2">Transform Your Craft</h3>
              <p className="text-sm opacity-90">Turn your passion into profit with AI-powered storytelling and global marketplace access.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <h3 className="font-bold text-lg mb-2">Join 2,000+ Artisans</h3>
              <p className="text-sm opacity-90">Connect with a global community of creators and start selling worldwide today.</p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="lg:hidden mb-6">
                <Sparkles className="w-12 h-12 mx-auto text-purple-600 mb-2" />
                <h1 className="text-2xl font-black text-purple-600">CraftAI</h1>
              </div>
              
              <h2 className="text-3xl font-black text-gray-800 mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-gray-500">
                {isSignUp ? "Join thousands of artisans worldwide" : "Sign in to your artisan dashboard"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full name"
                      required={isSignUp}
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-4 pr-11 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder={isSignUp ? "Create a password" : "Enter your password"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="ml-2 text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">Forgot password?</a>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                {isSignUp ? "Create Account" : "Sign In"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-medium flex items-center justify-center gap-3"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-medium flex items-center justify-center gap-3"
              >
                <img src="https://github.com/favicon.ico" alt="GitHub" className="w-5 h-5" />
                Continue with GitHub
              </Button>
            </div>

            {/* Toggle Sign Up/Sign In */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-2 text-purple-600 hover:text-purple-700 font-bold"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex items-center justify-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>2,000+ Active Artisans</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
