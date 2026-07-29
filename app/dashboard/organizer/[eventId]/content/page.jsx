"use client";

import { useState, useEffect, use } from "react";
import { Save, Image as ImageIcon, History, Eye, Layout } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ImageCropper from "@/app/components/ui/ImageCropper";
import Image from "next/image";
import { toast } from "sonner";

export default function ContentEditorPage({ params }) {
  const unwrappedParams = use(params);
  const eventId = unwrappedParams.eventId;

  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    description: "",
    bannerUrl: "",
    venue: "",
    tags: ""
  });

  useEffect(() => {
    // Mock Fetch
    setTimeout(() => {
      setFormData({
        description: "## Welcome to the Event\nJoin us for an amazing experience...\n\n## Agenda\n- 9:00 AM: Registration\n- 10:00 AM: Keynote\n\n## FAQs\n**Will there be food?**\nYes, lunch is provided.",
        bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=60",
        venue: "Main Campus Auditorium",
        tags: "technology, networking, workshop"
      });
      setLastSaved("Just now");
      setLoading(false);
    }, 500);
  }, [eventId]);

  // Auto-save simulation
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      setLastSaved(new Date().toLocaleTimeString());
      // Here we would dispatch an API PUT call to autosave
    }, 3000);
    return () => clearTimeout(timer);
  }, [formData, loading]);

  const handleSave = (e) => {
    e.preventDefault();
    setLastSaved("Saving...");
    setTimeout(() => {
      setLastSaved(new Date().toLocaleTimeString());
      toast.success("Event content published successfully!");
    }, 1000);
  };

  if (loading) return <div className="text-xs text-gray-500 animate-pulse">Loading content editor...</div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Event Content</h1>
          <p className="text-xs text-gray-400 mt-1">Manage public-facing details. Changes autosave locally.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 font-mono">
            {lastSaved ? `Last saved: ${lastSaved}` : 'Unsaved changes'}
          </span>
          <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-dark-border text-white text-xs font-bold rounded-lg hover:border-neon-purple/50 transition-all">
            {showPreview ? <Layout className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? "Editor" : "Live Preview"}
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white text-xs font-bold rounded-lg hover:bg-neon-purple/90 transition-all shadow-neon">
            <Save className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Editor Form */}
        <div className={`space-y-6 ${showPreview ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
          {/* Media & Meta */}
          <div className="bg-dark-card border border-dark-border p-5 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Media & Meta</h2>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">Event Banner</label>
              <ImageCropper 
                currentImageUrl={formData.bannerUrl} 
                onCropCompleteCallback={(croppedBase64) => setFormData({...formData, bannerUrl: croppedBase64})} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Venue</label>
                <input 
                  type="text" 
                  value={formData.venue}
                  onChange={e => setFormData({...formData, venue: e.target.value})}
                  className="w-full bg-black border border-dark-border rounded-lg p-2.5 text-xs text-white focus:border-neon-purple outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  className="w-full bg-black border border-dark-border rounded-lg p-2.5 text-xs text-white focus:border-neon-purple outline-none" 
                />
              </div>
            </div>
          </div>

          {/* Markdown Content Editor */}
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="flex border-b border-dark-border bg-black/20">
              <div className="px-5 py-3 text-[11px] font-black uppercase tracking-wider text-neon-purple bg-neon-purple/5 w-full">
                Full Event Description (Markdown)
              </div>
            </div>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="flex-1 w-full bg-transparent p-5 text-sm text-gray-300 font-mono focus:outline-none resize-none"
              placeholder="Write your full event description here. You can include your agenda, FAQs, and more using Markdown formatting..."
            />
          </div>
        </div>

        {/* Live Preview Pane */}
        {showPreview && (
          <div className="lg:col-span-2 bg-black border border-dark-border rounded-2xl overflow-hidden h-[800px] sticky top-6 shadow-neon relative flex flex-col">
            <div className="bg-zinc-950 border-b border-dark-border px-4 py-3 flex items-center justify-between z-10">
              <span className="text-xs font-bold text-white flex items-center gap-2"><Eye className="w-4 h-4 text-neon-purple" /> Live Preview</span>
              <span className="text-[10px] uppercase font-bold text-neon-purple bg-neon-purple/10 px-2 py-0.5 rounded border border-neon-purple/20">Public View</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 relative">
              {/* Simulated Event Page Layout */}
              <div className="max-w-3xl mx-auto space-y-8">
                {formData.bannerUrl && (
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden">
                    <Image src={formData.bannerUrl} alt="Banner" fill className="object-cover" />
                  </div>
                )}
                
                <div className="prose prose-invert prose-p:text-sm prose-h1:text-3xl prose-h2:text-2xl prose-a:text-neon-lavender max-w-none">
                  <ReactMarkdown>{formData.description || "*Empty content*"}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
