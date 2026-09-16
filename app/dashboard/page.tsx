"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Plus, LogOut, LayoutDashboard, Package, BookOpen,
  ShoppingCart, BarChart2, Sparkles, TrendingUp, Eye, ChevronRight,
  Wand2, Globe, Star, ArrowUpRight, Menu, X, Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../backend/firebase/authService";
import { ProtectedRoute } from "../../components/ProtectedRoute";

function DashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try { await authService.signOut(); router.push("/login"); }
    catch (error) { console.error("Logout error:", error); }
  };

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Artisan";
  const initials = displayName.charAt(0).toUpperCase();

  const navItems = [
    { icon: <LayoutDashboard size={17} />, label: "Dashboard", active: true, onClick: () => router.push("/dashboard") },
    { icon: <Package size={17} />, label: "My Products", active: false, onClick: () => router.push("/products") },
    { icon: <BookOpen size={17} />, label: "Story Builder", active: false, onClick: () => router.push("/story-builder") },
    { icon: <ShoppingCart size={17} />, label: "Orders", active: false, onClick: () => router.push("/orders") },
    { icon: <BarChart2 size={17} />, label: "Analytics", active: false, onClick: () => router.push("/analytics") },
  ];

  const stats = [
    { label: "Total Earnings", value: "$2,847", change: "+12.5%", up: true, icon: <TrendingUp size={18} />, color: "#C2600A", bg: "#FDE8D5" },
    { label: "Products Listed", value: "24", change: "+3 this week", up: true, icon: <Package size={18} />, color: "#0F3460", bg: "#E8F0FE" },
    { label: "Active Orders", value: "18", change: "5 pending", up: null, icon: <ShoppingCart size={18} />, color: "#166534", bg: "#DCFCE7" },
    { label: "Global Views", value: "1,247", change: "+8.2%", up: true, icon: <Eye size={18} />, color: "#6B21A8", bg: "#F3E8FF" },
  ];

  const recentActivity = [
    { emoji: "🏺", name: "Terracotta Bowl Set", status: "Sold", detail: "Buyer from Germany", time: "2h ago", color: "#166534" },
    { emoji: "🧣", name: "Ikat Textile Wrap", status: "Viewed", detail: "142 views today", time: "5h ago", color: "#0F3460" },
    { emoji: "💎", name: "Silver Filigree Ring", status: "Listed", detail: "AI story generated", time: "1d ago", color: "#C2600A" },
  ];

  const notificationsList = [
    { id: 1, title: "New Order #ORD-7829", desc: "Elena R. purchased Hand-Carved Deity Sculpture.", time: "2m ago", unread: true },
    { id: 2, title: "Story Successfully Built", desc: "Your 'Terracotta Bowl Set' story is ready to publish.", time: "1hr ago", unread: true },
    { id: 3, title: "Monthly Analytics", desc: "Your store views are up 8% this month!", time: "4hr ago", unread: false },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F5F0EB", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Mobile Overlay ─── */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 39 }} />
      )}

      {/* ── Fixed Sidebar ──────────────────────────────────── */}
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40,
        width: 260, background: "#1A1A2E",
        display: "flex", flexDirection: "column",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "4px 0 20px rgba(0,0,0,0.3)",
      }} className="sidebar-desktop">

        {/* Logo */}
        <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #C2600A, #F5C842)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#FBF7F0" }}>CraftAI</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="sidebar-close-btn"
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(251,247,240,0.4)", display: "none" }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "20px 14px", overflowY: "auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(251,247,240,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, paddingLeft: 12 }}>Menu</div>
          {navItems.map((item, i) => (
            <button key={i} onClick={item.onClick}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 14,
                padding: "12px 14px", borderRadius: 10, marginBottom: 6,
                background: item.active ? "rgba(194,96,10,0.15)" : "transparent",
                border: item.active ? "1px solid rgba(194,96,10,0.2)" : "1px solid transparent",
                color: item.active ? "#E07B39" : "rgba(251,247,240,0.55)",
                fontSize: 15, fontWeight: item.active ? 600 : 500,
                cursor: "pointer", textAlign: "left", transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (!item.active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#FBF7F0"; } }}
              onMouseLeave={e => { if (!item.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(251,247,240,0.55)"; } }}
            >
              <div style={{ color: item.active ? "#F5C842" : "inherit" }}>{item.icon}</div>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Profile + Logout */}
        <div style={{ padding: "20px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt={displayName} style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(245,200,66,0.3)" }} />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #C2600A, #E07B39)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(245,200,66,0.3)", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{initials}</span>
              </div>
            )}
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#FBF7F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</div>
              <div style={{ fontSize: 12, color: "rgba(251,247,240,0.4)" }}>Artisan Seller</div>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "rgba(252,165,165,0.8)", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#FCA5A5"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "rgba(252,165,165,0.8)"; }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Scrollable Main Area ────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto" }} className="main-content">

        {/* Top Bar (Sticky) */}
        <header style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(28,20,16,0.08)", padding: "0 32px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSidebarOpen(true)}
              style={{ width: 40, height: 40, borderRadius: 10, background: "#FDE8D5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#C2600A" }} className="mobile-menu-btn">
              <Menu size={20} />
            </button>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1C1410", lineHeight: 1.2 }}>
                Good day, {displayName} 👋
              </div>
              <div style={{ fontSize: 13, color: "#7A6A5A", marginTop: 2 }}>Here's your craft business overview</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Notification Dropdown Container */}
            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ width: 42, height: 42, borderRadius: 10, background: showNotifications ? "#FDE8D5" : "#F5F0EB", border: "1px solid rgba(28,20,16,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: showNotifications ? "#C2600A" : "#7A6A5A", transition: "all 0.2s" }}
              >
                <Bell size={18} />
                <span style={{ position: "absolute", top: 8, right: 8, width: 10, height: 10, borderRadius: "50%", background: "#C2600A", border: "2px solid #fff" }} />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ position: "absolute", top: "calc(100% + 12px)", right: 0, width: 340, background: "#fff", borderRadius: 16, border: "1px solid rgba(28,20,16,0.08)", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", zIndex: 50, overflow: "hidden" }}
                  >
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(28,20,16,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FBF7F0" }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: "#1C1410" }}>Notifications</span>
                      <button style={{ background: "none", border: "none", color: "#C2600A", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <Check size={14} /> Mark all read
                      </button>
                    </div>
                    <div style={{ maxHeight: 360, overflowY: "auto" }}>
                      {notificationsList.map(n => (
                        <div key={n.id} style={{ padding: "16px 20px", borderBottom: "1px solid rgba(28,20,16,0.04)", background: n.unread ? "#fff" : "#FAFAFA", display: "flex", gap: 12, cursor: "pointer", transition: "background 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#FDFCFB"}
                          onMouseLeave={e => e.currentTarget.style.background = n.unread ? "#fff" : "#FAFAFA"}
                        >
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.unread ? "#C2600A" : "transparent", marginTop: 6, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 14, fontWeight: n.unread ? 700 : 500, color: "#1C1410", marginBottom: 4 }}>{n.title}</div>
                            <div style={{ fontSize: 13, color: "#7A6A5A", lineHeight: 1.5, marginBottom: 8 }}>{n.desc}</div>
                            <div style={{ fontSize: 11, color: "#9B8B7A" }}>{n.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => router.push("/products")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #C2600A, #E07B39)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", border: "none", boxShadow: "0 6px 16px rgba(194,96,10,0.3)", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(194,96,10,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 16px rgba(194,96,10,0.3)"; }}
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <div style={{ padding: "32px 32px 64px 32px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 40 }}>
            {stats.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid rgba(28,20,16,0.08)", boxShadow: "0 4px 16px rgba(28,20,16,0.03)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: 13, color: "#7A6A5A", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: "#1C1410", lineHeight: 1, marginBottom: 8 }}>{s.value}</h3>
                  <span style={{ fontSize: 13, fontWeight: 600, color: s.up === true ? "#166534" : s.up === false ? "#991B1B" : "#7A6A5A", display: "flex", alignItems: "center", gap: 4 }}>
                    {s.up === true && <ArrowUpRight size={14} />}{s.change}
                  </span>
                </div>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
                  {s.icon}
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 32 }}>
            {/* Quick Actions (Left Col) */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1C1410" }}>Quick Actions</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: <Package size={24} color="#C2600A" />, title: "List a Product", desc: "Upload and let AI generate your story.", cta: "Add Product", route: "/products" },
                  { icon: <Wand2 size={24} color="#0F3460" />, title: "Story Builder", desc: "Craft compelling artisan narratives.", cta: "Create Story", route: "/story-builder" }
                ].map((a, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid rgba(28,20,16,0.08)", cursor: "pointer", transition: "all 0.25s", boxShadow: "0 2px 12px rgba(28,20,16,0.03)", display: "flex", alignItems: "center", gap: 20 }}
                    onClick={() => router.push(a.route)}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateX(4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(28,20,16,0.08)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(28,20,16,0.03)"; }}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: "#F5F0EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{a.icon}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1C1410", marginBottom: 4 }}>{a.title}</h3>
                      <p style={{ fontSize: 14, color: "#7A6A5A", lineHeight: 1.5 }}>{a.desc}</p>
                    </div>
                    <ChevronRight size={20} color="#C2600A" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activity (Right Col) */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1C1410" }}>Recent Activity</h2>
                <button style={{ fontSize: 14, color: "#C2600A", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  View all <ChevronRight size={16} />
                </button>
              </div>
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(28,20,16,0.08)", overflow: "hidden", boxShadow: "0 4px 16px rgba(28,20,16,0.03)" }}>
                {recentActivity.map((item, i) => (
                  <div key={i}
                    style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", borderBottom: i < recentActivity.length - 1 ? "1px solid rgba(28,20,16,0.06)" : "none", transition: "background 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#FBF7F0")}
                    onMouseLeave={e => (e.currentTarget.style.background = "")}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F5F0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                      {item.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1C1410", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                      <div style={{ fontSize: 13, color: "#7A6A5A" }}>{item.detail}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700, color: item.color, background: `${item.color}15` }}>
                        {item.status}
                      </span>
                      <div style={{ fontSize: 12, color: "#9B8B7A", marginTop: 6 }}>{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              marginTop: 40, borderRadius: 20, padding: "32px 40px",
              background: "linear-gradient(135deg, #1A1A2E 0%, #2D1306 60%, #4A1F08 100%)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 24, flexWrap: "wrap",
              border: "1px solid rgba(245,200,66,0.15)",
              boxShadow: "0 12px 32px rgba(26,26,46,0.2)"
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #C2600A, #E07B39)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 8px 24px rgba(194,96,10,0.4)" }}>
                <Wand2 size={28} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#FBF7F0", marginBottom: 4 }}>AI Story Builder is ready</h3>
                <div style={{ fontSize: 15, color: "rgba(251,247,240,0.65)" }}>Upload a craft photo and get a compelling story in seconds</div>
              </div>
            </div>
            <button onClick={() => router.push("/story-builder")}
              style={{ padding: "12px 28px", borderRadius: 12, background: "linear-gradient(135deg, #C2600A, #E07B39)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", border: "none", boxShadow: "0 6px 20px rgba(194,96,10,0.4)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(194,96,10,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 20px rgba(194,96,10,0.4)"; }}
            >
              <Star size={16} /> Create Story
            </button>
          </motion.div>

        </div>
      </div>

      <style>{`
        /* Global scrollbar styling for the dashboard main area */
        .main-content::-webkit-scrollbar { width: 8px; }
        .main-content::-webkit-scrollbar-track { background: transparent; }
        .main-content::-webkit-scrollbar-thumb { background: rgba(28,20,16,0.15); border-radius: 4px; }
        .main-content::-webkit-scrollbar-thumb:hover { background: rgba(28,20,16,0.25); }

        @media (min-width: 900px) {
          .sidebar-desktop { transform: translateX(0) !important; position: static !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 899px) {
          .sidebar-close-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
