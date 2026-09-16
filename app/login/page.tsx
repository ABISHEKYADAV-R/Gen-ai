"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, User, Sparkles, ArrowRight, Paintbrush, Globe, Star } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../backend/firebase/authService";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (user) { setIsRedirecting(true); router.push("/dashboard"); }
  }, [user, router]);

  if (isRedirecting || user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1A1A2E" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "3px solid #C2600A", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "rgba(251,247,240,0.6)", fontFamily: "'Inter', sans-serif" }}>Redirecting to dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.email || !formData.password || (isSignUp && !formData.name)) return;
    setLoading(true); setError("");
    try {
      let result;
      if (isSignUp) result = await authService.signUp(formData.email, formData.password, formData.name);
      else result = await authService.signIn(formData.email, formData.password);
      if (result.success) router.push("/dashboard");
      else setError(result.error || "An error occurred");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true); setError("");
    try {
      const result = await authService.signInWithGoogle();
      if (result.success) router.push("/dashboard");
      else setError(result.error || "Google sign in failed");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const testimonials = [
    { name: "Maya S.", country: "Bali, Indonesia", text: "I listed my ceramics and sold to buyers in 8 countries within two weeks.", emoji: "🏺" },
    { name: "Amara K.", country: "Fes, Morocco", text: "The AI wrote a story about my silver jewelry that made customers cry.", emoji: "💎" },
    { name: "Carlos R.", country: "Oaxaca, Mexico", text: "My carved masks finally found the global audience they deserved.", emoji: "🗿" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left Panel ───────────────────────────────── */}
      <div style={{
        display: "none", flex: "none", width: "48%",
        background: "linear-gradient(160deg, #1A1A2E 0%, #16213E 40%, #2D1306 80%, #4A1F08 100%)",
        padding: "48px 56px", flexDirection: "column", justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }} className="login-left">

        {/* Background decorations */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "10%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,96,10,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", bottom: "15%", right: "5%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,200,66,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(245,200,66,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,200,66,0.03) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        </div>

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #C2600A, #F5C842)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#FBF7F0" }}>CraftAI</span>
          </div>
        </div>

        {/* Center content */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 3vw, 48px)", fontWeight: 900, color: "#FBF7F0", lineHeight: 1.15, marginBottom: 20 }}>
            Your Craft.<br />
            <span style={{ background: "linear-gradient(135deg, #F5C842, #E07B39)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Your Story.</span><br />
            Your Market.
          </h1>
          <p style={{ fontSize: 16, color: "rgba(251,247,240,0.6)", lineHeight: 1.75, marginBottom: 40, maxWidth: 380 }}>
            Join over 2,000 artisans who use CraftAI to share their handmade work with buyers in 50+ countries.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32, marginBottom: 48 }}>
            {[{ n: "2K+", l: "Artisans" }, { n: "50+", l: "Countries" }, { n: "$1.2M", l: "Sold" }].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: "#F5C842" }}>{s.n}</div>
                <div style={{ fontSize: 12, color: "rgba(251,247,240,0.45)", textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", border: "1px solid rgba(245,200,66,0.12)", borderRadius: 16, padding: 24 }}
            animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity }}
          >
            <div style={{ fontSize: 28, marginBottom: 12 }}>{testimonials[0].emoji}</div>
            <p style={{ fontSize: 15, color: "rgba(251,247,240,0.75)", lineHeight: 1.65, marginBottom: 16, fontStyle: "italic" }}>
              "{testimonials[0].text}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #C2600A, #E07B39)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{testimonials[0].name[0]}</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#FBF7F0" }}>{testimonials[0].name}</div>
                <div style={{ fontSize: 12, color: "rgba(251,247,240,0.45)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Globe size={10} /> {testimonials[0].country}
                </div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#F5C842" color="#F5C842" />)}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom tagline */}
        <div style={{ position: "relative", zIndex: 1, fontSize: 12, color: "rgba(251,247,240,0.3)", display: "flex", alignItems: "center", gap: 6 }}>
          <Paintbrush size={12} /> Empowering artisans since 2024
        </div>
      </div>

      {/* ── Right Panel — Form ───────────────────────── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF7F0", padding: "40px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%", maxWidth: 440 }}
        >
          {/* Mobile logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }} className="login-mobile-logo">
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg, #C2600A, #F5C842)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={17} color="#fff" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1C1410" }}>CraftAI</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 900, color: "#1C1410", marginBottom: 8, lineHeight: 1.1 }}>
              {isSignUp ? "Join the Community" : "Welcome Back"}
            </h2>
            <p style={{ fontSize: 15, color: "#7A6A5A" }}>
              {isSignUp ? "Create your free artisan account today" : "Sign in to your artisan dashboard"}
            </p>
          </div>

          {/* Google button */}
          <button onClick={handleGoogleSignIn} disabled={loading}
            style={{
              width: "100%", padding: "13px", borderRadius: 10, marginBottom: 24,
              background: "#fff", border: "1.5px solid rgba(28,20,16,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              fontSize: 15, fontWeight: 600, color: "#1C1410", cursor: "pointer",
              boxShadow: "0 2px 8px rgba(28,20,16,0.06)", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#C2600A"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(194,96,10,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(28,20,16,0.12)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(28,20,16,0.06)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            {loading ? "Connecting..." : "Continue with Google"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(28,20,16,0.1)" }} />
            <span style={{ fontSize: 13, color: "#7A6A5A", flexShrink: 0 }}>or use email</span>
            <div style={{ flex: 1, height: 1, background: "rgba(28,20,16,0.1)" }} />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ padding: "12px 16px", borderRadius: 10, background: "#FEE2E2", border: "1px solid #FECACA", color: "#991B1B", fontSize: 14, marginBottom: 20 }}>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <AnimatePresence>
              {isSignUp && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3D2E26", marginBottom: 6 }}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9B8B7A" }} />
                    <input type="text" value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your artisan name"
                      style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 10, border: "1.5px solid rgba(28,20,16,0.15)", background: "#fff", fontSize: 15, color: "#1C1410", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                      onFocus={e => e.target.style.borderColor = "#C2600A"}
                      onBlur={e => e.target.style.borderColor = "rgba(28,20,16,0.15)"}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3D2E26", marginBottom: 6 }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9B8B7A" }} />
                <input type="email" value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com" required
                  style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 10, border: "1.5px solid rgba(28,20,16,0.15)", background: "#fff", fontSize: 15, color: "#1C1410", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "#C2600A"}
                  onBlur={e => e.target.style.borderColor = "rgba(28,20,16,0.15)"}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3D2E26", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder={isSignUp ? "Create a secure password" : "Enter your password"} required
                  style={{ width: "100%", padding: "12px 42px 12px 14px", borderRadius: 10, border: "1.5px solid rgba(28,20,16,0.15)", background: "#fff", fontSize: 15, color: "#1C1410", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "#C2600A"}
                  onBlur={e => e.target.style.borderColor = "rgba(28,20,16,0.15)"}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9B8B7A", display: "flex" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <a href="#" style={{ fontSize: 13, color: "#C2600A", fontWeight: 600, textDecoration: "none" }}>Forgot password?</a>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                padding: "14px", borderRadius: 10, marginTop: 4,
                background: loading ? "#D4A87A" : "linear-gradient(135deg, #C2600A, #E07B39)",
                color: "#fff", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                border: "none", boxShadow: loading ? "none" : "0 6px 20px rgba(194,96,10,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(194,96,10,0.45)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = loading ? "none" : "0 6px 20px rgba(194,96,10,0.35)"; }}
            >
              {loading ? (
                <><div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.5)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Connecting...</>
              ) : (
                <>{isSignUp ? <><User size={18} /> Create Account</> : <><Sparkles size={18} /> Sign In</>} <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div style={{ marginTop: 28, textAlign: "center", fontSize: 15, color: "#7A6A5A" }}>
            {isSignUp ? "Already an artisan?" : "New to CraftAI?"}
            {" "}
            <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              style={{ background: "none", border: "none", color: "#C2600A", fontWeight: 700, cursor: "pointer", fontSize: 15, textDecoration: "underline" }}>
              {isSignUp ? "Sign In" : "Create free account"}
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ marginTop: 36, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {[{ icon: "🔒", label: "256-bit encrypted" }, { icon: "🌍", label: "50+ countries" }, { icon: "⚡", label: "Free forever" }].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9B8B7A" }}>
                <span>{b.icon}</span> {b.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 900px) {
          .login-left { display: flex !important; }
          .login-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}
