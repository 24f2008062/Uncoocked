"use client";

import { useState, useEffect, use } from "react";
import { Save, AlertTriangle, Shield, Bell, Users, Globe } from "lucide-react";

export default function SettingsPage({ params }) {
  const unwrappedParams = use(params);
  const eventId = unwrappedParams.eventId;

  const [loading, setLoading] = useState(true);
  
  const [settings, setSettings] = useState({
    visibility: "Public",
    approvalRequired: false,
    capacity: 100,
    waitlist: true,
    alertsRegistration: true,
    alertsReminders: true,
  });

  const [managers, setManagers] = useState([]);
  const [newManagerEmail, setNewManagerEmail] = useState("");

  useEffect(() => {
    // Mock Fetch
    setTimeout(() => {
      setManagers([
        { id: "mgr-1", name: "Alice Smith", email: "alice@campus.edu", role: "Owner" },
        { id: "mgr-2", name: "Bob Johnson", email: "bob@campus.edu", role: "Admin" },
      ]);
      setLoading(false);
    }, 400);
  }, [eventId]);

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  };

  const handleAddManager = (e) => {
    e.preventDefault();
    if(!newManagerEmail) return;
    setManagers([...managers, { id: `mgr-${Date.now()}`, name: "New User", email: newManagerEmail, role: "Moderator" }]);
    setNewManagerEmail("");
  };

  const removeManager = (id) => {
    if(confirm("Remove this manager?")) {
      setManagers(managers.filter(m => m.id !== id));
    }
  };

  if (loading) return <div className="text-xs text-gray-500 animate-pulse">Loading settings...</div>;

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white">Event Settings</h1>
          <p className="text-xs text-gray-400 mt-1">Configure visibility, team access, and dangerous actions.</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-neon-purple text-white text-xs font-bold rounded-lg hover:bg-neon-purple/90 transition-all shadow-neon">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-border bg-black/20 flex items-center gap-3">
          <Globe className="w-5 h-5 text-neon-purple" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">General Configuration</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <label className="block text-gray-400 mb-2 font-bold">Event Visibility</label>
              <select 
                value={settings.visibility} 
                onChange={e => setSettings({...settings, visibility: e.target.value})}
                className="w-full bg-black border border-dark-border rounded-lg p-2.5 text-white focus:border-neon-purple outline-none"
              >
                <option value="Public">Public (Listed in Matrix)</option>
                <option value="Private">Private (Link Only)</option>
                <option value="Unlisted">Unlisted (Hidden)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-2 font-bold">Total Capacity</label>
              <input 
                type="number" 
                value={settings.capacity} 
                onChange={e => setSettings({...settings, capacity: Number(e.target.value)})}
                className="w-full bg-black border border-dark-border rounded-lg p-2.5 text-white focus:border-neon-purple outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-dark-border/40">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-10 h-5 rounded-full transition-colors relative ${settings.approvalRequired ? 'bg-neon-purple' : 'bg-zinc-800'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.approvalRequired ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <input type="checkbox" className="sr-only" checked={settings.approvalRequired} onChange={e => setSettings({...settings, approvalRequired: e.target.checked})} />
              <span className="text-sm text-gray-300 font-bold group-hover:text-white transition-colors">Require Approval for Registrations</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-10 h-5 rounded-full transition-colors relative ${settings.waitlist ? 'bg-emerald-500' : 'bg-zinc-800'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.waitlist ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <input type="checkbox" className="sr-only" checked={settings.waitlist} onChange={e => setSettings({...settings, waitlist: e.target.checked})} />
              <span className="text-sm text-gray-300 font-bold group-hover:text-white transition-colors">Enable Automatic Waitlist</span>
            </label>
          </div>
        </div>
      </div>

      {/* Team Management */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-border bg-black/20 flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Team & Permissions</h2>
        </div>
        <div className="p-6 space-y-6">
          <form onSubmit={handleAddManager} className="flex gap-3">
            <input 
              type="email" 
              placeholder="Enter campus email..." 
              value={newManagerEmail}
              onChange={e => setNewManagerEmail(e.target.value)}
              className="flex-1 bg-black border border-dark-border rounded-lg p-2.5 text-sm text-white focus:border-neon-purple outline-none"
            />
            <button type="submit" className="px-4 py-2 bg-zinc-900 border border-dark-border text-white text-xs font-bold rounded-lg hover:border-blue-500/50 hover:text-blue-400 transition-all">
              Invite Manager
            </button>
          </form>

          <div className="space-y-3">
            {managers.map(mgr => (
              <div key={mgr.id} className="flex items-center justify-between p-3 border border-dark-border rounded-lg bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-900/40 text-blue-400 flex items-center justify-center font-bold text-xs uppercase">{mgr.name[0]}</div>
                  <div>
                    <div className="text-sm font-bold text-white">{mgr.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{mgr.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select 
                    value={mgr.role}
                    onChange={(e) => {
                      setManagers(managers.map(m => m.id === mgr.id ? {...m, role: e.target.value} : m));
                    }}
                    disabled={mgr.role === "Owner"}
                    className="bg-zinc-900 border border-dark-border rounded p-1.5 text-[11px] text-white focus:border-neon-purple outline-none"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                  </select>
                  {mgr.role !== "Owner" && (
                    <button onClick={() => removeManager(mgr.id)} className="text-gray-500 hover:text-red-400 text-xs font-bold">Remove</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-950/10 border border-red-900/30 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-red-900/30 bg-red-950/20 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider">Danger Zone</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 p-4 border border-red-900/20 rounded-xl bg-black/40">
            <div>
              <h3 className="text-sm font-bold text-white">Archive Event</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Hide the event from the public matrix but keep the data for analytics.</p>
            </div>
            <button className="px-4 py-2 border border-amber-900/50 text-amber-500 bg-amber-950/20 hover:bg-amber-950/40 text-xs font-bold rounded-lg transition-all whitespace-nowrap">
              Archive Event
            </button>
          </div>
          
          <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 p-4 border border-red-900/20 rounded-xl bg-black/40">
            <div>
              <h3 className="text-sm font-bold text-white">Delete Event</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Permanently delete this event and all associated registrations and data.</p>
            </div>
            <button className="px-4 py-2 border border-red-900/50 text-red-400 bg-red-950/20 hover:bg-red-950/40 text-xs font-bold rounded-lg transition-all whitespace-nowrap">
              Delete Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
