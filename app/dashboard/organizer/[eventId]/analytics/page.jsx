"use client";

import { useState, useEffect, use } from "react";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { TrendingUp, Users, Eye, MousePointerClick, Filter } from "lucide-react";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950 border border-dark-border p-3 rounded-lg shadow-xl">
        <p className="text-xs font-bold text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-[10px] font-mono" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function AnalyticsPage({ params }) {
  const unwrappedParams = use(params);
  const eventId = unwrappedParams.eventId;

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  // Mock Data
  const timelineData = [
    { date: "Jun 15", views: 120, registrations: 10, revenue: 150 },
    { date: "Jun 16", views: 200, registrations: 15, revenue: 225 },
    { date: "Jun 17", views: 150, registrations: 5, revenue: 75 },
    { date: "Jun 18", views: 320, registrations: 25, revenue: 375 },
    { date: "Jun 19", views: 400, registrations: 40, revenue: 600 },
    { date: "Jun 20", views: 350, registrations: 30, revenue: 450 },
    { date: "Jun 21", views: 500, registrations: 50, revenue: 750 },
  ];

  const funnelData = [
    { name: "Impressions", value: 5000 },
    { name: "Page Visits", value: 2040 },
    { name: "Checkout", value: 450 },
    { name: "Registered", value: 175 },
  ];

  const trafficData = [
    { name: "Direct", value: 400, color: "#8b5cf6" }, // neon-purple
    { name: "Social Media", value: 300, color: "#10b981" }, // emerald
    { name: "Search", value: 200, color: "#3b82f6" }, // blue
    { name: "Referral", value: 100, color: "#f59e0b" }, // amber
  ];

  const deviceData = [
    { name: "Mobile", value: 65, color: "#8b5cf6" },
    { name: "Desktop", value: 30, color: "#3b82f6" },
    { name: "Tablet", value: 5, color: "#6b7280" },
  ];

  useEffect(() => {
    // In real app, fetch `/api/events/${eventId}/analytics?range=${timeRange}`
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, [eventId, timeRange]);

  if (loading) {
    return <div className="text-gray-400 text-xs animate-pulse">Loading analytics engine...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Analytics</h1>
          <p className="text-xs text-gray-400 mt-1">Deep dive into event performance, traffic, and conversions.</p>
        </div>
        <div className="flex items-center gap-2 bg-black border border-dark-border p-1 rounded-lg">
          {["7d", "30d", "All Time"].map(range => (
            <button 
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${timeRange === range ? 'bg-neon-purple text-white shadow-neon' : 'text-gray-500 hover:text-white'}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold text-gray-400">Total Views</span><Eye className="w-4 h-4 text-neon-purple" /></div>
          <div className="text-3xl font-black text-white">2,040</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ 12% vs last period</div>
        </div>
        <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold text-gray-400">Registrations</span><Users className="w-4 h-4 text-emerald-400" /></div>
          <div className="text-3xl font-black text-white">175</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ 5% vs last period</div>
        </div>
        <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold text-gray-400">Conversion Rate</span><MousePointerClick className="w-4 h-4 text-blue-400" /></div>
          <div className="text-3xl font-black text-white">8.5%</div>
          <div className="text-[10px] text-red-400 mt-1">↓ 1.2% vs last period</div>
        </div>
        <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold text-gray-400">Revenue</span><TrendingUp className="w-4 h-4 text-amber-400" /></div>
          <div className="text-3xl font-black text-white">₹2,625</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ 15% vs last period</div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Timeline Chart - 2 Columns wide */}
        <div className="lg:col-span-2 bg-dark-card border border-dark-border p-5 rounded-2xl">
          <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Views & Registrations</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRegs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" tick={{fill: '#888', fontSize: 10}} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" tick={{fill: '#888', fontSize: 10}} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Area type="monotone" dataKey="views" name="Page Views" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="registrations" name="Registrations" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRegs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Chart (Simulated with BarChart) */}
        <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
          <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Conversion Funnel</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#fff', fontSize: 10}} width={80} />
                <Tooltip cursor={{fill: '#ffffff0a'}} content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(267, 83%, ${60 - index * 10}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
          <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Traffic Sources</h2>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 space-y-2">
              {trafficData.map(item => (
                <div key={item.name} className="flex items-center gap-2 text-[10px]">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400">{item.name}</span>
                  <span className="text-white font-bold ml-auto">{Math.round((item.value / 1000) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
          <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Device Usage</h2>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 space-y-2">
              {deviceData.map(item => (
                <div key={item.name} className="flex items-center gap-2 text-[10px]">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400">{item.name}</span>
                  <span className="text-white font-bold ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-dark-card border border-dark-border p-5 rounded-2xl">
          <h2 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Revenue Trend</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" tick={{fill: '#888', fontSize: 10}} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" tick={{fill: '#888', fontSize: 10}} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
