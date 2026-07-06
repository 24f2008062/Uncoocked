"use client";

import { useState, useEffect, use } from "react";
import { Megaphone, Plus, Trash2, Edit3, Pin, Eye, EyeOff, XCircle } from "lucide-react";

export default function AnnouncementsPage({ params }) {
  const unwrappedParams = use(params);
  const eventId = unwrappedParams.eventId;

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [visibility, setVisibility] = useState("All");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}/announcements`);
        const data = await res.json();
        if (res.ok) {
          setAnnouncements(data.announcements || []);
        }
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [eventId]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !message) return;
    
    try {
      const res = await fetch(`/api/events/${eventId}/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: message,
          visibility,
          isPinned: false
        })
      });
      
      const data = await res.json();
      if (res.ok && data.announcement) {
        // Formatting to match the expected UI structure
        const newAnn = {
          id: data.announcement.id,
          title: data.announcement.title,
          content: data.announcement.content,
          visibility: visibility,
          isPinned: false,
          date: new Date(data.announcement.postedAt || Date.now()).toISOString().split("T")[0]
        };
        setAnnouncements([newAnn, ...announcements]);
        setTitle("");
        setMessage("");
        setVisibility("All");
        setShowForm(false);
      } else {
        alert("Failed to post announcement");
      }
    } catch (err) {
      console.error(err);
      alert("Error posting announcement");
    }
  };

  const deleteAnnouncement = (id) => {
    if(confirm("Delete this announcement?")) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  const togglePin = (id) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white">Announcements</h1>
          <p className="text-xs text-gray-400 mt-1">Broadcast updates and manage your event bulletin board.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white text-xs font-bold rounded-lg hover:bg-neon-purple/90 transition-all shadow-neon">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handlePost} className="bg-dark-card border border-neon-purple/40 p-5 rounded-2xl shadow-[0_0_20px_rgba(191,64,255,0.05)] space-y-4 relative">
          <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
            <XCircle className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Create Update</h2>
          
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-400 mb-1 font-bold">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full bg-black border border-dark-border rounded-lg p-2.5 text-white focus:border-neon-purple outline-none" placeholder="e.g. Venue Change" required />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-1 font-bold">Message (Markdown supported)</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} className="w-full bg-black border border-dark-border rounded-lg p-2.5 text-white focus:border-neon-purple outline-none" placeholder="Write your announcement..." required />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-1 font-bold">Visibility</label>
              <select value={visibility} onChange={e => setVisibility(e.target.value)} className="w-full sm:w-1/2 bg-black border border-dark-border rounded-lg p-2.5 text-white focus:border-neon-purple outline-none">
                <option value="All">All Visitors (Public)</option>
                <option value="Registered Users">Registered Users Only</option>
                <option value="VIP">VIP Ticket Holders</option>
              </select>
            </div>
          </div>
          
          <div className="pt-2 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-neon-purple text-white font-bold text-xs rounded-lg shadow-neon hover:bg-neon-purple/90">
              Post Announcement
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-500 text-xs animate-pulse">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="bg-dark-card border border-dark-border border-dashed p-10 text-center rounded-2xl">
            <Megaphone className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No announcements posted yet.</p>
          </div>
        ) : (
          announcements.sort((a, b) => b.isPinned - a.isPinned).map(ann => (
            <div key={ann.id} className={`bg-dark-card border ${ann.isPinned ? 'border-neon-purple/40' : 'border-dark-border'} rounded-xl p-5 relative group transition-all hover:border-neon-purple/30`}>
              {ann.isPinned && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-neon-purple text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-neon flex items-center gap-1">
                  <Pin className="w-3 h-3" /> Pinned
                </div>
              )}
              
              <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className="text-sm font-bold text-white">{ann.title}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => togglePin(ann.id)} className={`p-1.5 rounded hover:bg-white/5 ${ann.isPinned ? 'text-neon-purple' : 'text-gray-500'}`} title={ann.isPinned ? "Unpin" : "Pin"}>
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 text-gray-500 rounded hover:bg-white/5 hover:text-white" title="Edit">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteAnnouncement(ann.id)} className="p-1.5 text-gray-500 rounded hover:bg-red-950/30 hover:text-red-400" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-300 whitespace-pre-wrap">{ann.content}</p>
              
              <div className="mt-4 flex items-center gap-4 text-[10px] font-mono text-gray-500 border-t border-dark-border/40 pt-3">
                <span>{ann.date}</span>
                <span className="flex items-center gap-1 bg-black px-2 py-0.5 rounded-full border border-dark-border">
                  {ann.visibility === 'All' ? <Eye className="w-3 h-3 text-neon-purple" /> : <EyeOff className="w-3 h-3 text-amber-500" />}
                  {ann.visibility}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
