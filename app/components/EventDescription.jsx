"use client";

import ReactMarkdown from "react-markdown";

export default function EventDescription({ event }) {
  const renderTags = () => {
    try {
      const tags = event.tags ? JSON.parse(event.tags) : [];
      return tags.map((tag, idx) => (
        <span key={idx} className="px-2.5 py-1 bg-dark-card border border-dark-border text-[10px] font-mono text-gray-400 rounded-md">
          #{tag}
        </span>
      ));
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-8 flex flex-col justify-start">
      {/* Description */}
      {event.description && (
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border shadow-sm">
          <h2 className="text-lg font-bold text-white mb-4">About this Event</h2>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h2: ({ node: _node, ...props }) => <h2 className="text-xl font-bold text-white mt-6 mb-3" {...props} />,
                h3: ({ node: _node, ...props }) => <h3 className="text-sm font-bold uppercase tracking-wider text-white mt-4 mb-2" {...props} />,
                p: ({ node: _node, ...props }) => <p className="text-gray-300 text-sm mb-4 leading-relaxed" {...props} />,
                ul: ({ node: _node, ...props }) => <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 ml-2 mb-4" {...props} />,
                li: ({ node: _node, ...props }) => <li className="text-gray-300 text-sm" {...props} />,
                strong: ({ node: _node, ...props }) => <strong className="font-bold text-neon-purple" {...props} />,
              }}
            >
              {event.description}
            </ReactMarkdown>
          </div>
        </div>
      )}


      {/* Organizer & Venue Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-dark-card rounded-2xl p-5 border border-dark-border shadow-sm">
          <h3 className="text-sm font-bold text-white mb-2">Organizer</h3>
          <p className="text-xs text-gray-400">{event.organizer?.fullName || event.organizer?.name || event.organizer?.email || event.organizerId}</p>
        </div>
        <div className="bg-dark-card rounded-2xl p-5 border border-dark-border shadow-sm flex flex-col items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">Venue</h3>
            <p className="text-xs text-gray-400">{event.location}</p>
          </div>
          {event.googleMapsUrl && (
            <a 
              href={event.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-neon-purple hover:text-neon-lavender bg-neon-purple/10 hover:bg-neon-purple/20 px-3 py-1.5 rounded-lg border border-neon-purple/30 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              View on Google Maps
            </a>
          )}
        </div>
      </div>

      {/* Tags */}
      {event.tags && (
        <div className="flex flex-wrap gap-2">
          {renderTags()}
        </div>
      )}
    </div>
  );
}
