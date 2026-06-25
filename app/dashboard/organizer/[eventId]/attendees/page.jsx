"use client";

import { useState, useEffect, use } from "react";
import { Search, Download, Filter, CheckCircle2, XCircle, MoreVertical } from "lucide-react";

import { useUser } from "@/app/context/UserContext";

export default function AttendeesPage({ params }) {
  const unwrappedParams = use(params);
  const eventId = unwrappedParams.eventId;
  const { user } = useUser();
  
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    let isMounted = true;
    const fetchAttendees = async () => {
      try {
        if (!user) return;
        const res = await fetch(`/api/registrations?eventId=${eventId}&requesterEmail=${user}`);
        const data = await res.json();
        if (data.success && isMounted) {
          const formatted = data.registrations.map(r => ({
            id: r.id,
            name: r.user.name || r.user.email.split('@')[0],
            email: r.user.email,
            date: new Date(r.registeredAt).toISOString().split('T')[0],
            ticketType: r.ticketTier?.name || "General Admission",
            paymentStatus: r.coupon ? "Discounted" : "Paid",
            coupon: r.coupon?.code || "-",
            teamName: r.teamName || "-",
            track: r.track || "-",
            status: r.status,
            checkedIn: r.checkInStatus
          }));
          setAttendees(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAttendees();
    return () => { isMounted = false; };
  }, [eventId, user]);

  const filteredAttendees = attendees.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.status === statusFilter || (statusFilter === "Checked In" && a.checkedIn);
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = "Name,Email,Date,Ticket Type,Payment Status,Coupon,Team,Track,Status,Checked In\n";
    const csvContent = filteredAttendees.map(a => 
      `"${a.name}","${a.email}","${a.date}","${a.ticketType}","${a.paymentStatus}","${a.coupon}","${a.teamName}","${a.track}","${a.status}","${a.checkedIn ? 'Yes' : 'No'}"`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendees_${eventId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCheckIn = async (id) => {
    try {
      const res = await fetch(`/api/registrations/${id}/checkin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkedIn: true })
      });
      if (res.ok) {
        setAttendees(prev => prev.map(a => a.id === id ? { ...a, checkedIn: true } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelRegistration = async (id) => {
    if (!confirm("Are you sure you want to cancel this registration?")) return;
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAttendees(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status, checkedIn) => {
    if (checkedIn) return <span className="px-2 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 rounded-full text-[10px] font-bold uppercase">Checked In</span>;
    switch(status) {
      case "Confirmed": return <span className="px-2 py-1 bg-blue-950/40 text-blue-400 border border-blue-800/40 rounded-full text-[10px] font-bold uppercase">Confirmed</span>;
      case "Pending": return <span className="px-2 py-1 bg-yellow-950/40 text-yellow-400 border border-yellow-800/40 rounded-full text-[10px] font-bold uppercase">Pending</span>;
      case "Waitlisted": return <span className="px-2 py-1 bg-purple-950/40 text-purple-400 border border-purple-800/40 rounded-full text-[10px] font-bold uppercase">Waitlisted</span>;
      case "Cancelled": return <span className="px-2 py-1 bg-red-950/40 text-red-400 border border-red-800/40 rounded-full text-[10px] font-bold uppercase">Cancelled</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Attendees</h1>
          <p className="text-xs text-gray-400 mt-1">Manage registrations, check-ins, and ticket statuses.</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-dark-border hover:border-gray-500 text-white text-xs font-bold rounded-lg transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-sm">
        {/* Controls Bar */}
        <div className="p-4 border-b border-dark-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-black/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-black border border-dark-border rounded-lg text-xs text-white focus:outline-none focus:border-neon-purple font-mono"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-black border border-dark-border rounded-lg text-xs text-white focus:outline-none focus:border-neon-purple"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Waitlisted">Waitlisted</option>
              <option value="Checked In">Checked In</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-400">
            <thead className="bg-black/40 border-b border-dark-border text-gray-300 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-6 py-4">Attendee</th>
                <th className="px-6 py-4">Registration Date</th>
                <th className="px-6 py-4">Ticket Type</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center animate-pulse">Loading attendees...</td></tr>
              ) : filteredAttendees.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No attendees found.</td></tr>
              ) : (
                filteredAttendees.map((attendee) => (
                  <tr key={attendee.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{attendee.name}</div>
                      <div className="text-[10px] font-mono mt-0.5">{attendee.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono">{attendee.date}</td>
                    <td className="px-6 py-4">{attendee.ticketType}</td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] text-gray-400">Team: {attendee.teamName}</div>
                      <div className="text-[10px] text-gray-400">Track: {attendee.track}</div>
                      {attendee.coupon !== "-" && <div className="text-[10px] text-neon-purple mt-1">🏷️ {attendee.coupon}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={attendee.paymentStatus === 'Paid' ? 'text-emerald-400 font-bold' : 'text-yellow-400 font-bold'}>
                        {attendee.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(attendee.status, attendee.checkedIn)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {!attendee.checkedIn && attendee.status === "Confirmed" && (
                        <button onClick={() => handleCheckIn(attendee.id)} title="Check In" className="p-1.5 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/50 rounded transition-colors inline-block">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleCancelRegistration(attendee.id)} title="Cancel Registration" className="p-1.5 bg-red-950/30 text-red-400 hover:bg-red-900/50 rounded transition-colors inline-block">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
