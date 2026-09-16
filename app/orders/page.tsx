"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, ChevronLeft, MoreHorizontal, Package } from "lucide-react";
import { ProtectedRoute } from "../../components/ProtectedRoute";

function OrdersContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All Orders");

  const tabs = ["All Orders", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  
  const mockOrders = [
    { id: "ORD-7829", date: "Oct 24, 2024", customer: "Elena R.", product: "Hand-Carved Deity Sculpture", total: "$289.00", status: "Pending", color: "#C2600A" },
    { id: "ORD-7828", date: "Oct 23, 2024", customer: "Michael T.", product: "Traditional Ikat Textile", total: "$145.00", status: "Processing", color: "#0F3460" },
    { id: "ORD-7827", date: "Oct 21, 2024", customer: "Sarah K.", product: "Silver Filigree Necklace", total: "$67.00", status: "Shipped", color: "#166534" },
    { id: "ORD-7826", date: "Oct 19, 2024", customer: "David W.", product: "Woven Storage Basket", total: "$34.00", status: "Delivered", color: "#374151" },
    { id: "ORD-7825", date: "Oct 18, 2024", customer: "Anna B.", product: "Terracotta Bowl Set", total: "$89.00", status: "Delivered", color: "#374151" },
  ];

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
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#1C1410", marginBottom: 4 }}>Orders Management</h1>
              <div style={{ fontSize: 13, color: "#7A6A5A" }}>View and track your customer orders</div>
            </div>
          </div>
          <button style={{ padding: "10px 20px", borderRadius: 8, background: "linear-gradient(135deg, #C2600A, #E07B39)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(194,96,10,0.25)" }}>
            Export CSV
          </button>
        </div>

        {/* Content Box */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(28,20,16,0.08)", boxShadow: "0 2px 12px rgba(28,20,16,0.04)", overflow: "hidden" }}>
          
          {/* Controls */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(28,20,16,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: "8px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", whiteSpace: "nowrap",
                    background: activeTab === tab ? "rgba(194,96,10,0.1)" : "transparent",
                    color: activeTab === tab ? "#C2600A" : "#7A6A5A",
                  }}>
                  {tab}
                </button>
              ))}
            </div>
            
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9B8B7A" }} />
                <input type="text" placeholder="Search orders..." style={{ width: 220, padding: "10px 12px 10px 36px", borderRadius: 8, border: "1px solid rgba(28,20,16,0.15)", outline: "none", fontSize: 13 }} />
              </div>
              <button style={{ padding: "10px 14px", borderRadius: 8, background: "#fff", border: "1px solid rgba(28,20,16,0.15)", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: "#1C1410", cursor: "pointer" }}>
                <Filter size={16} /> Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#FBF7F0", borderBottom: "1px solid rgba(28,20,16,0.08)" }}>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: "#7A6A5A", textTransform: "uppercase" }}>Order ID</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: "#7A6A5A", textTransform: "uppercase" }}>Date</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: "#7A6A5A", textTransform: "uppercase" }}>Customer</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: "#7A6A5A", textTransform: "uppercase" }}>Product</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: "#7A6A5A", textTransform: "uppercase" }}>Total</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: "#7A6A5A", textTransform: "uppercase" }}>Status</th>
                  <th style={{ padding: "16px 24px", width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order, i) => (
                  <tr key={order.id} style={{ borderBottom: i < mockOrders.length - 1 ? "1px solid rgba(28,20,16,0.06)" : "none", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#FDFCFB"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "20px 24px", fontSize: 14, fontWeight: 600, color: "#1C1410" }}>{order.id}</td>
                    <td style={{ padding: "20px 24px", fontSize: 13, color: "#7A6A5A" }}>{order.date}</td>
                    <td style={{ padding: "20px 24px", fontSize: 14, color: "#1C1410" }}>{order.customer}</td>
                    <td style={{ padding: "20px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: "#F5F0EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#C2600A" }}><Package size={14} /></div>
                        <span style={{ fontSize: 14, color: "#3D2E26" }}>{order.product}</span>
                      </div>
                    </td>
                    <td style={{ padding: "20px 24px", fontSize: 14, fontWeight: 600, color: "#1C1410" }}>{order.total}</td>
                    <td style={{ padding: "20px 24px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: `${order.color}15`, color: order.color }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "20px 24px", textAlign: "right" }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9B8B7A" }}><MoreHorizontal size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
