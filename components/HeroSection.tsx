"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  return (
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
            <Button
              className="bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 shadow"
              onClick={() => router.push("/login")}>
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
              className="px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 border-gray-300 shadow"
              onClick={() => router.push("/login")}>
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
          <motion.div whileHover={{ scale: 1.05 }} className="w-full max-w-xl">
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
  );
}
