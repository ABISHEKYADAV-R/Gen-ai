"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, BarChart2, TrendingUp, Users, Globe, DownloadCloud } from "lucide-react";
import { ProtectedRoute } from "../../components/ProtectedRoute";

function AnalyticsContent() {
  const router = useRouter();

  const metrics = [
    { title: "Total Revenue", value: "$12,450", change: "+15.2%", icon: <TrendingUp size={20} />, up: true },
    { title: "Store Views", value: "8,204", change: "+4.1%", icon: <Eye size={20} />, up: true },
    { title: "Unique Customers", value: "342", change: "+12%", icon: <Users size={20} />, up: true },
    { title: "Global Reach", value: "14 Countries", change: "+2 this month", icon: <Globe size={20} />, up: true },
  ];

  function Eye({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0EB", fontFamily: "'Inter', sans-serif", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => router.push('/dashboard')} style={{ width: 40, height: 40, borderRadius: 10, background: "#fff", border: "1px solid rgba(28,20,16,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1C1410" }}>
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#1C1410", marginBottom: 4 }}>Store Analytics</h1>
              <div style={{ fontSize: 13, color: "#7A6A5A" }}>Detailed insights on your craft business</div>
            </div>
          </div>
          <button style={{ padding: "10px 20px", borderRadius: 8, background: "#fff", border: "1px solid rgba(28,20,16,0.15)", color: "#1C1410", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", boxShadow: "0 2px 4px rgba(28,20,16,0.02)" }}>
            <DownloadCloud size={16} /> Export Report
          </button>
        </div>

        {/* Top Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 32 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ background: "#fff", padding: 24, borderRadius: 16, border: "1px solid rgba(28,20,16,0.08)", boxShadow: "0 2px 12px rgba(28,20,16,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FDE8D5", color: "#C2600A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {m.icon}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#7A6A5A", textTransform: "uppercase", letterSpacing: 0.5 }}>{m.title}</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, fontFamily: "'Playfair Display', serif", color: "#1C1410", marginBottom: 8 }}>{m.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: m.up ? "#166534" : "#991B1B", display: "flex", alignItems: "center", gap: 4 }}>
                {m.change}
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Lists (Mock Layouts) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: 24 }}>
          
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid rgba(28,20,16,0.08)", boxShadow: "0 2px 12px rgba(28,20,16,0.04)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1C1410", marginBottom: 20 }}>Revenue Overview</h3>
            <div style={{ height: 260, display: "flex", alignItems: "flex-end", gap: "4%", paddingBottom: 24, borderBottom: "1px solid rgba(28,20,16,0.06)", position: "relative" }}>
              {/* Fake chart bars */}
              {[40, 60, 45, 80, 65, 90, 75].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: h === 90 ? "linear-gradient(180deg, #C2600A, #E07B39)" : "#FDE8D5", borderRadius: "6px 6px 0 0", transition: "all 0.3s" }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, fontSize: 12, color: "#7A6A5A" }}>
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span style={{color: "#C2600A", fontWeight: 700}}>Sat</span><span>Sun</span>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid rgba(28,20,16,0.08)", boxShadow: "0 2px 12px rgba(28,20,16,0.04)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1C1410", marginBottom: 20 }}>Top Selling Products</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { name: "Terracotta Bowl Set", sales: "124 sold", rev: "$4,200", prog: "100%" },
                { name: "Traditional Ikat Wrap", sales: "86 sold", rev: "$2,850", prog: "70%" },
                { name: "Silver Filigree Ring", sales: "62 sold", rev: "$1,450", prog: "45%" },
                { name: "Hand-Carved Deity", sales: "21 sold", rev: "$890", prog: "25%" },
              ].map((p, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1410" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#7A6A5A" }}>{p.sales}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#C2600A" }}>{p.rev}</div>
                  </div>
                  <div style={{ height: 6, background: "#F5F0EB", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: p.prog, height: "100%", background: "#C2600A", borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .analytics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function Analytics() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}
