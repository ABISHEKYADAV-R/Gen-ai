import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
        
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">CraftAI</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex space-x-10 text-gray-700 font-medium">
          <a href="#features" className="hover:text-purple-600 transition-colors">
            Features
          </a>
          <a href="#marketplace" className="hover:text-purple-600 transition-colors">
            Marketplace
          </a>
          <a href="#dashboard" className="hover:text-purple-600 transition-colors">
            Dashboard
          </a>
         
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
            Sign In
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg px-5">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
