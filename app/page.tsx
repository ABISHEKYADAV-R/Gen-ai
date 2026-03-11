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
      <header className="flex justify-between items-center px-6 py-4 fixed top-0 left-0 right-0 z-50 glass">
        <div className="text-2xl font-black text-gradient">CraftAI</div>
        <nav className="space-x-8 text-foreground/80 hidden md:flex font-medium">
          {[
            { name: "Home", target: "top" },
            { name: "Features", target: "features" },
            { name: "Stories", target: "dashboard" },
            { name: "Pricing", target: "cta" },
          ].map((item) => (
            <a
              key={item.name}
              href={"#" + item.target}
              className="relative transition-colors duration-200 hover:text-primary group"
              onClick={(e) => {
                e.preventDefault();
                const offset = 72; // height of navbar (px)
                if (item.target === "top") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  const el = document.getElementById(item.target);
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }
              }}>
              {item.name}
              <span className="absolute left-0 -bottom-2 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </a>
          ))}
        </nav>
        <div className="space-x-3">
          <Button
            variant="ghost"
            className="px-4 py-2 hover:bg-primary/10 transition-colors"
            onClick={() => router.push("/login")}>
            Sign In
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2 shadow-lg hover:shadow-primary/25 transition-all"
            onClick={() => router.push("/login")}>
            Get Started
          </Button>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative px-6 md:px-10 pt-32 pb-24 overflow-hidden min-h-screen flex items-center">
        {/* Dynamic Backgrounds */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse-slow font-delay-2000"></div>

        <div className="relative grid md:grid-cols-2 gap-16 max-w-7xl mx-auto items-center w-full">
          <motion.div 
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <div className="mb-6">
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full glass-card border-primary/30 text-primary font-semibold text-sm shadow-md"
              >
                <Sparkles className="mr-2 w-4 h-4 animate-shimmer" />
                Next-Gen Craft Selling Platform
              </motion.span>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-[5rem] font-black leading-[1.1] tracking-tight mb-8 text-foreground"
            >
              Elevate Your <br/>
              <span className="text-gradient">
                Craftsmanship
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed"
            >
              Merge tradition with future commerce. Craft AI-generated stories that resonate globally, and launch premium storefronts in seconds.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Button 
                onClick={() => router.push("/login")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-7 rounded-2xl text-lg font-bold shadow-xl hover:shadow-primary/30 transform hover:-translate-y-1 transition-all duration-300"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Start Your Journey
              </Button>
              <Button
                variant="outline"
                className="glass-card text-foreground hover:bg-white/40 border-white/40 px-8 py-7 rounded-2xl text-lg font-bold transition-all duration-300"
              >
                <ArrowRight className="mr-2 w-5 h-5 text-primary" />
                View Gallery
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-6 mt-12"
            >
              <div className="flex -space-x-3">
                <img src="/images/maya-profile.jpg" alt="User" className="w-12 h-12 rounded-full border-2 border-background object-cover shadow-sm" />
                <img src="/images/sarah-avatar.jpg" alt="User" className="w-12 h-12 rounded-full border-2 border-background object-cover shadow-sm" />
                <div className="w-12 h-12 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shadow-sm backdrop-blur-md">+2K</div>
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-semibold">2,000+ artisans online</span>
                <div className="flex items-center text-yellow-500 gap-1 text-sm mt-0.5">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-muted-foreground ml-1">4.9/5 Average rating</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Floating Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/20 blur-3xl rounded-[3rem] -z-10 animate-pulse-slow"></div>
            <motion.div
              className="relative w-full max-w-md animate-float"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="rounded-[2rem] shadow-2xl glass border-white/30 overflow-hidden transform-gpu">
                <div className="relative w-full h-72 overflow-hidden group">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                  <img
                    src="/images/hero-image.jpg"
                    alt="Premium Ceramic"
                    className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 z-20 glass-card px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    4.9
                  </div>
                </div>
                <CardContent className="p-6 relative">
                  <div className="absolute -top-10 left-6">
                    <img src="/images/maya-profile.jpg" alt="Maya" className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg object-cover" />
                  </div>
                  
                  <div className="mt-8 mb-2">
                    <h3 className="font-bold text-2xl text-foreground">Obsidian Ceramic Bowl</h3>
                    <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                      Maya <span className="w-1 h-1 rounded-full bg-primary mx-1"></span> Jakarta, ID
                    </p>
                  </div>
                  
                  <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                    Molded from volcanic clay across 3 days, blending ancestral heritage with modern minimalist form. 
                  </p>
                  
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Value</p>
                      <span className="font-black text-2xl text-gradient">$145</span>
                    </div>
                    <Button className="rounded-xl px-6 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                      Acquire Piece
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Small floating accents */}
            <motion.div 
              className="absolute -right-8 top-12 glass-card rounded-2xl p-4 shadow-xl animate-float-delayed hidden md:flex"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Globe className="w-6 h-6 text-accent mr-3" />
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Global Reach</p>
                <p className="text-sm font-semibold">12 Countries</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 md:px-10 relative">
        <div className="max-w-7xl mx-auto z-10 relative">
          <motion.div 
            initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground tracking-tight">
              Design <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-primary),var(--color-accent))]">Intelligence</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We replace complex technical hurdles with invisible AI. A seamless suite that scales your artisan business beautifully.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-primary group-hover:text-white transition-colors" />,
                title: "Contextual Lore",
                description: "Turn sparse voice notes or quick snaps into cinematic narratives that anchor emotional value.",
                features: ["Tone adjustment", "Heritage context", "SEO optimized"],
                highlight: "bg-primary/10 group-hover:bg-primary"
              },
              {
                icon: <ShoppingCart className="w-8 h-8 text-accent group-hover:text-white transition-colors" />,
                title: "Frictionless Store",
                description: "Stunning one-click storefronts deployed globally without writing a single line of backend logic.",
                features: ["Instant checkouts", "Inventory sync", "Dynamic pricing"],
                highlight: "bg-accent/10 group-hover:bg-accent"
              },
              {
                icon: <Globe className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />,
                title: "Borderless Exchange",
                description: "Automatically translate stories, handle currencies, and manage international fulfillment routes.",
                features: ["Auto-translations", "Currency conversion", "Customs prep"],
                highlight: "bg-orange-500/10 group-hover:bg-orange-500"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group h-full"
              >
                <Card className="p-8 h-full glass-card hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/10 border-white/20">
                  <div className={`w-16 h-16 rounded-2xl ${feature.highlight} flex items-center justify-center mb-8 transition-all duration-500`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-2xl mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground mb-8 line-clamp-3 leading-relaxed">{feature.description}</p>
                  
                  <ul className="space-y-3 mt-auto border-t border-border pt-6">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center text-sm font-medium text-foreground/80">
                        <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
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
        className="py-24 px-6 md:px-10 flex flex-col items-center relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-r from-primary/10 to-accent/10 blur-[100px] -z-10 rounded-full"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
            Your Artisan <span className="text-gradient">Command Center</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload a photo, let our AI weave the story, and track your global empire from a single elegant interface.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl"
        >
          <div className="rounded-[2.5rem] shadow-2xl glass border border-white/20 overflow-hidden transform-gpu">
            {/* Dashboard Header Mock */}
            <div className="bg-gradient-to-r from-primary to-accent border-b border-white/10 px-8 py-6 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay"></div>
              <div className="flex items-center relative z-10">
                <img
                  src="/images/maya-profile.jpg"
                  alt="Maya profile"
                  className="w-14 h-14 rounded-2xl border-2 border-white/30 mr-4 shadow-lg object-cover"
                />
                <div>
                  <div className="text-white font-bold text-lg tracking-tight">
                    Maya's Studio
                  </div>
                  <div className="text-white/80 text-sm font-medium">
                    Level 4 Artisan • Premium
                  </div>
                </div>
              </div>
              <div className="sm:text-right flex sm:block items-center justify-between w-full sm:w-auto relative z-10">
                <div className="text-white/80 text-sm font-medium mb-1">
                  Rolling 30 Days
                </div>
                <div className="text-4xl font-black text-white">$4,289<span className="text-xl text-white/60 font-medium">.00</span></div>
              </div>
            </div>

            {/* Dashboard Body Mock */}
            <div className="bg-white/50 dark:bg-black/20 px-8 py-10 grid md:grid-cols-3 gap-8">
              {/* Quick Upload */}
              <div className="glass-card rounded-3xl p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="font-bold mb-4 flex items-center gap-2 text-foreground">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  New Listing
                </div>
                <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-2xl flex flex-col items-center justify-center py-10 cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  </div>
                  <div className="text-foreground font-semibold">
                    Upload Craft Photo
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">PNG, JPG up to 10MB</div>
                </div>
              </div>

              {/* AI Generated Story */}
              <div className="glass-card rounded-3xl p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="font-bold mb-4 flex items-center gap-2 text-foreground">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                  </div>
                  Active Generation
                </div>
                <div className="bg-background rounded-2xl p-5 text-foreground text-sm mb-4 border border-border shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent"></div>
                  "This obsidian ceramic bowl carries the weight of volcanic earth, shaped by centuries of ancestral Javanese pottery traditions passed down through four generations..."
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md">Draft Ready</span>
                  <a href="#" className="text-primary font-bold text-sm hover:underline">
                    Review & Publish →
                  </a>
                </div>
              </div>

              {/* Performance */}
              <div className="glass-card rounded-3xl p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="font-bold mb-6 flex items-center gap-2 text-foreground">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  </div>
                  Global Analytics
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Active Listings", value: "24", change: "+2" },
                    { label: "Store Views", value: "12.4K", change: "+14%" },
                    { label: "Conversion Rate", value: "3.2%", change: "+0.8%" }
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                      <span className="text-muted-foreground font-medium">{stat.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-foreground">{stat.value}</span>
                        <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-1.5 py-0.5 rounded">{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      {/* Marketplace */}
      <section id="marketplace" className="py-24 px-6 md:px-10 bg-background relative border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-left"
            >
              <h2 className="text-4xl font-black mb-3 text-foreground">Featured Collections</h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                Discover pieces with rich histories, sourced directly from master artisans globally.
              </p>
            </motion.div>
            <Button variant="ghost" className="hidden md:flex items-center text-primary font-bold hover:bg-primary/10">
              Explore Gallery <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Ceremonial Ikat Textile",
                price: "$145",
                img: "/images/ikat-textile.jpg",
                subtitle: "Sari • Bali, ID",
                rating: 4.8,
              },
              {
                name: "Obsidian Root Sculpture",
                price: "$289",
                img: "/images/hand-carved-sculpture.jpg",
                subtitle: "Carlos • Oaxaca, MX",
                rating: 4.9,
              },
              {
                name: "Nomadic Silver Heirloom",
                price: "$167",
                img: "/images/silver-bead-necklace.jpg",
                subtitle: "Amara • Marrakech, MA",
                rating: 5.0,
              },
              {
                name: "Savannah Storage Basket",
                price: "$84",
                img: "/images/woven-storage-basket.jpg",
                subtitle: "Kemi • Accra, GH",
                rating: 4.9,
              },
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <Card className="shadow-sm hover:shadow-2xl rounded-[2rem] overflow-hidden bg-card border-border transition-all duration-500 hover:-translate-y-2 relative h-full flex flex-col">
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                  
                  <div className="w-full aspect-[4/5] bg-muted overflow-hidden relative">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Floating Add to Cart on hover */}
                    <div className="absolute bottom-4 left-0 w-full flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                      <Button className="bg-white text-black hover:bg-gray-100 rounded-full shadow-lg px-6 font-bold">
                        Quick View
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex-grow flex flex-col justify-between relative z-20 bg-card">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-muted-foreground text-xs font-semibold track-wider uppercase">{item.subtitle}</p>
                        <span className="flex items-center gap-1 text-yellow-500 font-bold text-xs bg-yellow-500/10 px-1.5 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-current" />
                          {item.rating}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <span className="font-black text-xl text-foreground">{item.price}</span>
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Button variant="outline" className="w-full rounded-xl py-6 font-bold border-2">
              Explore Gallery
            </Button>
          </div>
        </div>
      </section>
      {/* CTA */}
      <section
        id="cta"
        className="py-24 px-6 md:px-10 text-center relative overflow-hidden">
        {/* Abstract CTA Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-orange-500 -z-20"></div>
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay -z-10"></div>
        <div className="absolute top-0 left-1/4 w-[50%] h-full bg-white/10 skew-x-12 -z-10 hidden md:block"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto glass-card border-white/20 p-12 rounded-[3rem]"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight">
            Stop Selling. <br/>Start <span className="text-yellow-300">Storytelling.</span>
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join the invitation-only waitlist for elite artisans. Spots are limited as we scale our AI rendering nodes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="bg-white text-primary hover:bg-gray-50 px-8 py-7 rounded-2xl text-lg font-bold shadow-xl transition-transform hover:-translate-y-1"
              onClick={() => router.push("/login")}
            >
              Request Access
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white/50 text-white hover:bg-white/10 px-8 py-7 rounded-2xl text-lg font-bold transition-colors"
            >
              Contact Curators
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}