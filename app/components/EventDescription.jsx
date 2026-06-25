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
          <p className="text-sm text-gray-300 leading-relaxed">
            {event.description}
          </p>
        </div>
      )}

      {/* Schedule Section */}
      {event.schedule && (
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border shadow-sm">
          <h2 className="text-lg font-bold text-white mb-4">Agenda</h2>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h3: ({ node: _node, ...props }) => <h3 className="text-sm font-bold uppercase tracking-wider text-white mt-4 mb-2" {...props} />,
                p: ({ node: _node, ...props }) => <p className="text-gray-300 text-xs mb-2" {...props} />,
                ul: ({ node: _node, ...props }) => <ul className="list-disc list-inside text-gray-300 text-xs space-y-1 ml-2" {...props} />,
                li: ({ node: _node, ...props }) => <li className="text-gray-300 text-xs" {...props} />,
                strong: ({ node: _node, ...props }) => <strong className="font-bold text-neon-purple" {...props} />,
              }}
            >
              {event.schedule}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Organizer & Venue Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-dark-card rounded-2xl p-5 border border-dark-border shadow-sm">
          <h3 className="text-sm font-bold text-white mb-2">Organizer</h3>
          <p className="text-xs text-gray-400">{event.organizerId || event.organizer?.email}</p>
        </div>
        <div className="bg-dark-card rounded-2xl p-5 border border-dark-border shadow-sm">
          <h3 className="text-sm font-bold text-white mb-2">Venue</h3>
          <p className="text-xs text-gray-400">{event.location}</p>
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
