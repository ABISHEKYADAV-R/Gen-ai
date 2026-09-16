"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Sparkles, ShoppingBag, Globe, Star, ArrowRight,
  Paintbrush, Wand2, TrendingUp, Check, Menu, X, ChevronRight
} from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

export default function LandingPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Marketplace", href: "#marketplace" },
    { name: "Pricing", href: "#pricing" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1C1410" }}>

      {/* ── Navbar ─────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(26, 26, 46, 0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(245, 200, 66, 0.1)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #C2600A, #F5C842)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#FBF7F0", letterSpacing: "-0.3px" }}>
              CraftAI
            </span>
          </div>

          {/* Desktop nav */}
          <nav style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden md:flex">
            {navLinks.map(l => (
              <button key={l.name} onClick={() => scrollTo(l.href)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(251,247,240,0.7)", fontSize: 15, fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F5C842")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(251,247,240,0.7)")}
              >{l.name}</button>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 12 }} className="hidden md:flex">
            <button onClick={() => router.push("/login")}
              style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid rgba(245,200,66,0.3)", background: "transparent", color: "#FBF7F0", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#F5C842"; e.currentTarget.style.color = "#F5C842"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,200,66,0.3)"; e.currentTarget.style.color = "#FBF7F0"; }}
            >Sign In</button>
            <button onClick={() => router.push("/login")}
              style={{ padding: "9px 20px", borderRadius: 8, background: "linear-gradient(135deg, #C2600A, #E07B39)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none", boxShadow: "0 4px 16px rgba(194,96,10,0.35)", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(194,96,10,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 16px rgba(194,96,10,0.35)"; }}
            >Get Started Free</button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{ background: "none", border: "none", color: "#FBF7F0", cursor: "pointer" }}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: "#1A1A2E", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "16px 24px 24px" }}>
            {navLinks.map(l => (
              <button key={l.name} onClick={() => scrollTo(l.href)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 0", background: "none", border: "none", color: "rgba(251,247,240,0.8)", fontSize: 16, cursor: "pointer" }}>
                {l.name}
              </button>
            ))}
            <button onClick={() => router.push("/login")}
              style={{ marginTop: 16, width: "100%", padding: "12px", borderRadius: 8, background: "linear-gradient(135deg, #C2600A, #E07B39)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", border: "none" }}>
              Get Started Free
            </button>
          </div>
        )}
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        background: "linear-gradient(160deg, #1A1A2E 0%, #16213E 50%, #0F1F3D 100%)",
        position: "relative", overflow: "hidden", paddingTop: 68,
      }}>
        {/* Background decorations */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "15%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,96,10,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", bottom: "20%", right: "5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,200,66,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
          {/* Grid lines */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(245,200,66,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,200,66,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", width: "100%", position: "relative", zIndex: 1 }}
          className="hero-grid">

          {/* Left */}
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 16px", borderRadius: 100,
                background: "rgba(194,96,10,0.15)", border: "1px solid rgba(194,96,10,0.3)",
                color: "#E07B39", fontSize: 13, fontWeight: 600, marginBottom: 28,
                fontFamily: "'Inter', sans-serif",
              }}>
                <Sparkles size={13} />
                AI-Powered Artisan Platform
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(42px, 5vw, 68px)",
              fontWeight: 900, lineHeight: 1.1,
              color: "#FBF7F0", marginBottom: 24,
              letterSpacing: "-1px",
            }}>
              Your Craft Deserves{" "}
              <span style={{ background: "linear-gradient(135deg, #F5C842 0%, #E07B39 60%, #C2600A 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                a Global Stage
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(251,247,240,0.65)", marginBottom: 40, maxWidth: 480, fontFamily: "'Inter', sans-serif" }}>
              CraftAI uses artificial intelligence to turn your handmade products into compelling stories, 
              build your storefront automatically, and connect you with buyers from 50+ countries.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button onClick={() => router.push("/login")}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "14px 28px", borderRadius: 10,
                  background: "linear-gradient(135deg, #C2600A, #E07B39)",
                  color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", border: "none",
                  boxShadow: "0 8px 30px rgba(194,96,10,0.4)", transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(194,96,10,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 30px rgba(194,96,10,0.4)"; }}
              >
                <Sparkles size={18} /> Start Selling — It&apos;s Free
              </button>
              <button onClick={() => scrollTo("#marketplace")}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "14px 24px", borderRadius: 10,
                  background: "transparent", border: "1px solid rgba(251,247,240,0.2)",
                  color: "#FBF7F0", fontSize: 16, fontWeight: 500, cursor: "pointer", transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,200,66,0.5)"; e.currentTarget.style.color = "#F5C842"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(251,247,240,0.2)"; e.currentTarget.style.color = "#FBF7F0"; }}
              >
                Browse Marketplace <ArrowRight size={16} />
              </button>
            </motion.div>

            <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 48 }}>
              <div style={{ display: "flex" }}>
                {["#E07B39", "#C2600A", "#F5C842", "#9B4608"].map((c, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: c, border: "2px solid #1A1A2E", marginLeft: i > 0 ? -10 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{i === 3 ? "2K" : ""}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#F5C842" color="#F5C842" />)}
                </div>
                <span style={{ color: "rgba(251,247,240,0.55)", fontSize: 13 }}>Trusted by 2,000+ artisans worldwide</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — floating product card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}
          >
            <div className="animate-float" style={{ position: "relative", width: "100%", maxWidth: 380 }}>
              {/* Main product card */}
              <div style={{
                borderRadius: 20, overflow: "hidden",
                background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(245,200,66,0.15)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
              }}>
                <div style={{ height: 240, background: "linear-gradient(135deg, #2D1B0E 0%, #4A2C16 50%, #3D2010 100%)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "absolute", inset: 0 }}>
                    <div style={{ position: "absolute", top: "20%", left: "15%", width: 120, height: 120, borderRadius: "50%", background: "rgba(194,96,10,0.3)", filter: "blur(30px)" }} />
                    <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 90, height: 90, borderRadius: "50%", background: "rgba(245,200,66,0.2)", filter: "blur(20px)" }} />
                  </div>
                  <div style={{ position: "relative", textAlign: "center" }}>
                    <div style={{ fontSize: 64, marginBottom: 8 }}>🏺</div>
                    <span style={{ color: "rgba(245,200,66,0.8)", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>Handcrafted Ceramic</span>
                  </div>
                </div>

                <div style={{ padding: 24, background: "rgba(26,26,46,0.95)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#FBF7F0", marginBottom: 4 }}>Maya's Terracotta Bowl</div>
                      <div style={{ fontSize: 13, color: "rgba(251,247,240,0.5)" }}>by Maya S. · Bali, Indonesia</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: "#F5C842" }}>$89</div>
                      <div style={{ display: "flex", gap: 2 }}>
                        {[1,2,3,4,5].map(i => <Star key={i} size={11} fill="#F5C842" color="#F5C842" />)}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(251,247,240,0.55)", lineHeight: 1.6, marginBottom: 16 }}>
                    "Shaped by my grandmother's hands across three generations of Javanese pottery tradition..."
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#E07B39", display: "flex", alignItems: "center", gap: 6 }}>
                      <Globe size={12} /> Ships to 52 countries
                    </span>
                    <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 100, background: "rgba(194,96,10,0.2)", color: "#E07B39", border: "1px solid rgba(194,96,10,0.3)" }}>
                      In Stock
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating AI badge */}
              <motion.div
                className="animate-float-delay"
                style={{
                  position: "absolute", top: -18, right: -18,
                  background: "linear-gradient(135deg, #C2600A, #E07B39)",
                  borderRadius: 12, padding: "10px 14px",
                  boxShadow: "0 8px 24px rgba(194,96,10,0.4)",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                <Wand2 size={14} color="#fff" />
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>AI Story Generated ✓</span>
              </motion.div>

              {/* Floating sales badge */}
              <motion.div
                style={{
                  position: "absolute", bottom: -18, left: -18,
                  background: "rgba(26,26,46,0.95)", backdropFilter: "blur(12px)",
                  border: "1px solid rgba(245,200,66,0.2)",
                  borderRadius: 12, padding: "10px 16px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  display: "flex", alignItems: "center", gap: 10,
                }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(245,200,66,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp size={16} color="#F5C842" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#FBF7F0" }}>$2,847 earned</div>
                  <div style={{ fontSize: 11, color: "rgba(251,247,240,0.45)" }}>This month · +24%</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Hero bottom gradient fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to bottom, transparent, #FBF7F0)", pointerEvents: "none" }} />
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section id="features" style={{ padding: "100px 24px", background: "#FBF7F0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 72 }}>
            <motion.p variants={fadeUp} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#C2600A", marginBottom: 16 }}>
              Everything You Need
            </motion.p>
            <motion.h2 variants={fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, color: "#1C1410", marginBottom: 20, lineHeight: 1.15 }}>
              Where Heritage Meets <br />
              <span style={{ background: "linear-gradient(135deg, #C2600A, #E07B39)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Technology</span>
            </motion.h2>
            <motion.p variants={fadeUp} style={{ fontSize: 18, color: "#7A6A5A", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              From crafting your story to shipping globally — CraftAI handles the tech so you can focus on what you love.
            </motion.p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {[
              {
                icon: <Wand2 size={28} color="#C2600A" />,
                iconBg: "#FDE8D5",
                badge: "AI-Powered",
                title: "Story Builder",
                description: "Upload a photo of your craft and our AI writes a compelling, personal story that connects emotionally with buyers. Supports 40+ languages.",
                features: ["Photo-to-story in seconds", "Voice note support", "40+ language output"],
                accent: "#C2600A",
              },
              {
                icon: <ShoppingBag size={28} color="#0F3460" />,
                iconBg: "#E8F0FE",
                badge: "Zero Setup",
                title: "Instant Storefront",
                description: "Your personalized seller page goes live in minutes — with product listings, a bio, payment links, and a custom URL. No coding needed.",
                features: ["Custom artisan URL", "Built-in payments", "SEO-optimized listings"],
                accent: "#0F3460",
              },
              {
                icon: <Globe size={28} color="#166534" />,
                iconBg: "#DCFCE7",
                badge: "50+ Countries",
                title: "Global Marketplace",
                description: "Get listed on CraftAI's curated marketplace where 100K+ buyers are actively searching for authentic handmade goods every day.",
                features: ["AI-matched to buyers", "International shipping", "Verified artisan badge"],
                accent: "#166534",
              },
            ].map((f, i) => (
              <motion.div key={i} variants={fadeUp}
                className="hover-lift"
                style={{
                  background: "#fff", borderRadius: 20, padding: 36,
                  border: "1px solid rgba(28, 20, 16, 0.08)",
                  boxShadow: "0 2px 20px rgba(28,20,16,0.06)",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: f.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>{f.icon}</div>
                  <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, color: f.accent, background: f.iconBg }}>{f.badge}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1C1410", marginBottom: 12 }}>{f.title}</h3>
                <p style={{ fontSize: 15, color: "#7A6A5A", lineHeight: 1.7, marginBottom: 24 }}>{f.description}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {f.features.map((feat, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#3D2E26", fontWeight: 500 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: f.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Check size={11} color={f.accent} strokeWidth={3} />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it Works ────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "100px 24px", background: "#1A1A2E", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(245,200,66,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,200,66,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 72 }}>
            <motion.p variants={fadeUp} style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#E07B39", marginBottom: 16 }}>Simple Process</motion.p>
            <motion.h2 variants={fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, color: "#FBF7F0", lineHeight: 1.15 }}>
              From Craft to Customer<br />
              <span style={{ background: "linear-gradient(135deg, #F5C842, #E07B39)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>in 3 Simple Steps</span>
            </motion.h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
            {[
              { step: "01", icon: "📸", title: "Upload Your Craft", desc: "Take a photo of your handmade product and upload it to CraftAI. Our Vision AI instantly recognizes materials, textures, and craftsmanship style." },
              { step: "02", icon: "✨", title: "AI Creates Your Story", desc: "Gemini AI crafts a unique, emotionally resonant product story in your voice — highlighting your technique, heritage, and what makes each piece special." },
              { step: "03", icon: "🌍", title: "Sell Globally", desc: "Your product goes live on the marketplace instantly. Buyers from around the world discover your work through our AI recommendation engine." },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp}
                style={{
                  background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)",
                  border: "1px solid rgba(245,200,66,0.1)", borderRadius: 20, padding: 36,
                  position: "relative", overflow: "hidden",
                }}>
                <div style={{ position: "absolute", top: 20, right: 24, fontFamily: "'Playfair Display', serif", fontSize: 64, fontWeight: 900, color: "rgba(245,200,66,0.06)", lineHeight: 1 }}>{s.step}</div>
                <div style={{ fontSize: 40, marginBottom: 20 }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#E07B39", marginBottom: 12, textTransform: "uppercase" }}>Step {s.step}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#FBF7F0", marginBottom: 14 }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: "rgba(251,247,240,0.55)", lineHeight: 1.75 }}>{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Marketplace ─────────────────────────────────── */}
      <section id="marketplace" style={{ padding: "100px 24px", background: "#F0E9DC" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, flexWrap: "wrap", gap: 20 }}>
            <div>
              <motion.p variants={fadeUp} style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#C2600A", marginBottom: 12 }}>Live Marketplace</motion.p>
              <motion.h2 variants={fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: "#1C1410", lineHeight: 1.15 }}>
                Discover Authentic<br />Handmade Crafts
              </motion.h2>
            </div>
            <motion.button variants={fadeUp}
              onClick={() => router.push("/login")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, background: "#1A1A2E", color: "#FBF7F0", fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#C2600A"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#1A1A2E"; }}
            >
              View All <ChevronRight size={16} />
            </motion.button>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              { id: "mock-1", name: "Traditional Ikat Textile", price: "$145", artist: "Sari · Bali", emoji: "🧣", rating: 4.8, sales: 142, category: "Textiles" },
              { id: "mock-2", name: "Hand-Carved Deity Sculpture", price: "$289", artist: "Carlos · Oaxaca", emoji: "🗿", rating: 4.9, sales: 87, category: "Sculpture" },
              { id: "mock-3", name: "Silver Filigree Necklace", price: "$67", artist: "Amara · Fes", emoji: "💎", rating: 4.7, sales: 203, category: "Jewelry" },
              { id: "mock-4", name: "Woven Storage Basket", price: "$34", artist: "Kemi · Accra", emoji: "🧺", rating: 5.0, sales: 318, category: "Weaving" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}
                onClick={() => router.push(`/product/${item.id}`)}
                className="hover-lift"
                style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(28,20,16,0.08)", cursor: "pointer" }}>
                <div style={{
                  height: 200, display: "flex", alignItems: "center", justifyContent: "center",
                  background: `linear-gradient(135deg, hsl(${25 + i * 30}, 40%, 18%) 0%, hsl(${30 + i * 25}, 50%, 25%) 100%)`,
                  position: "relative",
                }}>
                  <span style={{ fontSize: 64 }}>{item.emoji}</span>
                  <span style={{ position: "absolute", top: 14, left: 14, padding: "4px 10px", borderRadius: 6, background: "rgba(0,0,0,0.4)", color: "#fff", fontSize: 11, fontWeight: 600 }}>{item.category}</span>
                  <span style={{ position: "absolute", top: 14, right: 14, padding: "4px 10px", borderRadius: 6, background: "rgba(245,200,66,0.9)", color: "#1C1410", fontSize: 11, fontWeight: 700 }}>{item.price}</span>
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#1C1410", marginBottom: 6 }}>{item.name}</h3>
                  <p style={{ fontSize: 13, color: "#7A6A5A", marginBottom: 14 }}>by {item.artist}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Star size={13} fill="#F5C842" color="#F5C842" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#3D2E26" }}>{item.rating}</span>
                      <span style={{ fontSize: 12, color: "#7A6A5A" }}>({item.sales})</span>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FDE8D5", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#C2600A"; (e.currentTarget.querySelector("svg") as any).style.color = "#fff"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#FDE8D5"; (e.currentTarget.querySelector("svg") as any).style.color = "#C2600A"; }}
                    >
                      <ShoppingBag size={15} color="#C2600A" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section id="pricing" style={{
        padding: "100px 24px", position: "relative", overflow: "hidden",
        background: "linear-gradient(155deg, #1A1A2E 0%, #2D1306 40%, #4A1F08 70%, #1A1A2E 100%)",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(194,96,10,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 40%, rgba(245,200,66,0.08) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.div variants={fadeUp} style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #C2600A, #E07B39)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 30px rgba(194,96,10,0.4)" }}>
                <Paintbrush size={28} color="#fff" />
              </div>
            </motion.div>
            <motion.h2 variants={fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "#FBF7F0", lineHeight: 1.1, marginBottom: 20 }}>
              Ready to Transform<br />Your Craft Into Gold?
            </motion.h2>
            <motion.p variants={fadeUp} style={{ fontSize: 18, color: "rgba(251,247,240,0.65)", marginBottom: 48, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px" }}>
              Join 2,000+ artisans already earning globally with AI-powered storytelling. Start free — no credit card needed.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <button onClick={() => router.push("/login")}
                style={{
                  padding: "16px 36px", borderRadius: 12,
                  background: "linear-gradient(135deg, #C2600A, #E07B39, #F5C842)",
                  color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer", border: "none",
                  boxShadow: "0 10px 40px rgba(194,96,10,0.45)", transition: "all 0.3s",
                  display: "flex", alignItems: "center", gap: 10,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 50px rgba(194,96,10,0.55)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 10px 40px rgba(194,96,10,0.45)"; }}
              >
                <Sparkles size={20} /> Start Selling Free
              </button>
              <button onClick={() => router.push("/login")}
                style={{
                  padding: "16px 32px", borderRadius: 12,
                  background: "transparent", border: "1px solid rgba(245,200,66,0.3)",
                  color: "#FBF7F0", fontSize: 18, fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#F5C842"; e.currentTarget.style.color = "#F5C842"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,200,66,0.3)"; e.currentTarget.style.color = "#FBF7F0"; }}
              >
                Schedule a Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer style={{ background: "#0F0F1A", padding: "40px 24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #C2600A, #F5C842)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={14} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#FBF7F0" }}>CraftAI</span>
        </div>
        <p style={{ fontSize: 13, color: "rgba(251,247,240,0.35)" }}>© 2025 CraftAI. Empowering artisans worldwide.</p>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </div>
  );
}