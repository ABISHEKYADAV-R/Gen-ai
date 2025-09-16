import { Card } from "@/components/ui/card";
import { ShoppingCart, Globe, Sparkles } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-10 text-center">
      {/* Heritage content with image and overlay */}
      <div className="mb-12 relative flex justify-center">
        <img
          src="/heritage-image.png" // Save your heritage image in public/heritage-image.png
          alt="Heritage Meets Technology"
          className="rounded-xl shadow-lg w-full md:w-3/4"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white bg-black/40 rounded-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Heritage Meets Technology
          </h2>
          <p className="text-lg md:text-xl max-w-2xl">
            Our AI-powered platform bridges traditional craftsmanship with
            modern commerce, creating opportunities for artisans worldwide.
          </p>
        </div>
      </div>

      {/* Features cards */}
      <div className="grid md:grid-cols-3 gap-10">
        {/* AI Storytelling */}
        <Card className="p-6">
          <Sparkles className="w-10 h-10 text-purple-600 mb-4" />
          <h3 className="font-semibold text-xl mb-2">AI Storytelling</h3>
          <p className="text-gray-600">
            Transform simple product photos and voice notes into compelling
            stories that connect with global buyers.
          </p>
          <ul className="mt-4 text-left text-sm text-gray-700 space-y-1">
            <li>✔ Voice-to-story conversion</li>
            <li>✔ Multi-language support</li>
            <li>✔ Cultural context awareness</li>
          </ul>
        </Card>

        {/* Smart Commerce */}
        <Card className="p-6">
          <ShoppingCart className="w-10 h-10 text-orange-500 mb-4" />
          <h3 className="font-semibold text-xl mb-2">Smart Commerce</h3>
          <p className="text-gray-600">
            Auto-generated storefronts with integrated payments, shipping, and
            marketing campaigns.
          </p>
          <ul className="mt-4 text-left text-sm text-gray-700 space-y-1">
            <li>✔ Instant storefront creation</li>
            <li>✔ Global payment processing</li>
            <li>✔ Automated marketing</li>
          </ul>
        </Card>

        {/* Global Reach */}
        <Card className="p-6">
          <Globe className="w-10 h-10 text-pink-600 mb-4" />
          <h3 className="font-semibold text-xl mb-2">Global Reach</h3>
          <p className="text-gray-600">
            Connect with buyers worldwide through our curated marketplace and
            recommendation engine.
          </p>
          <ul className="mt-4 text-left text-sm text-gray-700 space-y-1">
            <li>✔ AI-powered recommendations</li>
            <li>✔ International shipping</li>
            <li>✔ Cultural authenticity badges</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}
