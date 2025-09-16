"use client";

import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section
      id="cta"
      className="py-10 px-10 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <h2 className="text-4xl font-bold mb-6">
        Ready to Transform Your Craft?
      </h2>
      <p className="text-lg mb-8">
        Join thousands of artisans already selling globally with AI-powered
        storytelling.
      </p>
      <div className="flex justify-center space-x-6">
        <Button className="bg-white text-purple-600 px-6 py-3 rounded-xl text-lg">
          Start Free Trial
        </Button>
        <Button
          variant="outline"
          className="border-white text-white px-6 py-3 rounded-xl text-lg">
          Schedule Demo
        </Button>
      </div>
    </section>
  );
}
