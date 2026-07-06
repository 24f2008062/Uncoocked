"use client";

import { use } from "react";

import { useState, useEffect } from "react";
import { Users, Ticket, DollarSign, Activity, Calendar } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend, prefix = "" }) => (
  <div className="bg-dark-card border border-dark-border p-5 rounded-2xl shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
      <Icon className="w-4 h-4 text-neon-purple" />
    </div>
    <div className="flex items-end gap-3">
      <div className="text-3xl font-black text-white">{prefix}{value}</div>
      {trend && (
        <div className="text-[10px] font-bold text-emerald-400 mb-1.5 bg-emerald-950/30 px-1.5 py-0.5 rounded">
          +{trend}%
        </div>
      )}
    </div>
  </div>
);

export default function OrganizerOverviewPage({ params }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    views: 0,
    registrations: 0,
    revenue: 0,
    capacityUtil: 0,
    capacity: 0,
  });
  const [activities, setActivities] = useState([]);

  const unwrappedParams = use(params);
  
  useEffect(() => {
    let isMounted = true;
    const fetchOverview = async () => {
      try {
        const res = await fetch(`/api/organizer/${unwrappedParams.eventId}/overview`);
        const data = await res.json();
        if (data.success && isMounted) {
          setStats(data.stats);
          setActivities(data.activities);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOverview();
    return () => { isMounted = false; };
  }, [unwrappedParams.eventId]);


  if (loading) return <div className="text-white text-sm animate-pulse">Loading overview...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Event Overview</h1>
        <p className="text-xs text-gray-400 mt-1">Real-time metrics and recent activity for your event.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Views" value={stats.views} icon={Activity} trend="12" />
        <StatCard title="Registrations" value={stats.registrations} icon={Users} trend="5" />
        <StatCard title="Revenue" value={stats.revenue} icon={DollarSign} prefix="$" trend="8" />
        <StatCard title="Capacity" value={`${stats.capacityUtil}%`} icon={Ticket} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Activity</h2>
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
            {activities.map((act, i) => (
              <div key={act.id} className={`p-4 flex items-center justify-between ${i !== activities.length - 1 ? 'border-b border-dark-border' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${act.type === 'REGISTER' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-blue-950/40 text-blue-400'}`}>
                    {act.type === 'REGISTER' ? <Users className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs text-white"><span className="font-bold">{act.user}</span> {act.type === 'REGISTER' ? 'registered for a ticket' : 'viewed the event page'}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{act.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Milestones</h2>
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-neon-purple shadow-[0_0_10px_rgba(191,64,255,0.8)]" />
                <div className="w-px h-10 bg-dark-border my-1" />
              </div>
              <div className="-mt-1">
                <h4 className="text-xs font-bold text-white">Event Created</h4>
                <p className="text-[10px] text-gray-400">Completed</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-dark-border" />
                <div className="w-px h-10 bg-dark-border my-1" />
              </div>
              <div className="-mt-1">
                <h4 className="text-xs font-bold text-white">50 Registrations</h4>
                <p className="text-[10px] text-gray-400">5 tickets remaining</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-dark-border" />
              </div>
              <div className="-mt-1">
                <h4 className="text-xs font-bold text-white">Event Day</h4>
                <p className="text-[10px] text-gray-400">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
