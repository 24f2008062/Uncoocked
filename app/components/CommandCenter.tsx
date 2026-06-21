'use client';

import { useState } from 'react';

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type EventItem = {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  summary: string;
  detailLink: string;
};

const categories: Category[] = [
  {
    id: 'all',
    name: 'All',
    description: 'Browse all active events, coding sprints, sports leagues, and volunteer drives in one dashboard.',
  },
  {
    id: 'tech-builder',
    name: 'Hackathons',
    description: 'Robotics Showdowns, Web3 Sprints, Open-Source Contributions, and Cyber Security CTFs',
  },
  {
    id: 'global-affairs',
    name: 'Model United Nations (MUNs)',
    description: 'Parliamentary Debates, Youth Parliaments, and Elocution Tracks',
  },
  {
    id: 'corporate-venture',
    name: 'Ideathons',
    description: 'Business Plan Sprints, Case Study Face-offs, Stock Trading Simulations, and E-Cell Initiatives',
  },
  {
    id: 'athletics-field',
    name: 'Inter-college Cricket Leagues',
    description: 'Basketball Tournaments, Football Championships, and Esports Showdowns',
  },
  {
    id: 'creative-literary',
    name: 'Creative Writing Competitions',
    description: 'Poetry Slams, Journalism Bootcamps, and Fine Arts Exhibitions',
  },
  {
    id: 'culinary-lifestyle',
    name: 'Live Cooking Contests',
    description: 'Baking Sprints, and Hospitality & Mixology Showcases',
  },
  {
    id: 'corporate-launchpad',
    name: 'Direct Startup Internships',
    description: 'Fellowships, Part-Time Corporate Sprints, and Freelance Gig Pools',
  },
  {
    id: 'social-impact',
    name: 'NGO Volunteer Drives',
    description: 'Sustainability Initiatives, Battle of the Bands, and Street Plays',
  },
];

const eventItems: EventItem[] = [
  {
    id: 'ev-hackathon',
    categoryId: 'tech-builder',
    categoryName: 'Hackathons',
    title: 'Campus Innovation Hackathon 2026',
    summary: 'Build prototypes, join project teams, and pitch ideas for a $50k prize pool.',
    detailLink: '/event',
  },
  {
    id: 'ev-mun',
    categoryId: 'global-affairs',
    categoryName: 'Model United Nations (MUNs)',
    title: 'Model United Nations Summit 2026',
    summary: 'Debate public policy, represent country cabinets, and draft legislative bills.',
    detailLink: '/event',
  },
  {
    id: 'ev-ideathon',
    categoryId: 'corporate-venture',
    categoryName: 'Ideathons',
    title: 'Venture Capital Sprint 2026',
    summary: 'Pitch startup business models directly to early-stage venture fund managers.',
    detailLink: '/event',
  },
  {
    id: 'ev-cricket',
    categoryId: 'athletics-field',
    categoryName: 'Inter-college Cricket Leagues',
    title: 'Inter-College T20 Cricket Championship',
    summary: 'Represent your college in the annual knockout campus cricket tournament.',
    detailLink: '/event',
  },
  {
    id: 'ev-writing',
    categoryId: 'creative-literary',
    categoryName: 'Creative Writing Competitions',
    title: 'Annual Poetry Slam & Writing Challenge',
    summary: 'Showcase fine arts and journalism write-ups before a panel of literary judges.',
    detailLink: '/event',
  },
  {
    id: 'ev-cooking',
    categoryId: 'culinary-lifestyle',
    categoryName: 'Live Cooking Contests',
    title: 'Live Baking & Mixology Showcase',
    summary: 'Present hospitality menus and baking creations in live mixology battles.',
    detailLink: '/event',
  },
  {
    id: 'ev-chat-lobby',
    categoryId: 'corporate-launchpad',
    categoryName: 'Direct Startup Internships',
    title: 'Campus Chat & Meetup Lobby',
    summary: 'Coordinate with fellow campus students, share social updates, and form groups in the chat lobby.',
    detailLink: '/chat',
  },
  {
    id: 'ev-volunteer',
    categoryId: 'social-impact',
    categoryName: 'NGO Volunteer Drives',
    title: 'Sustainability Volunteer Drive',
    summary: 'Join NGO local initiatives, battle of the bands, and street play coordinates.',
    detailLink: '/event',
  },
];

export default function CommandCenter({ searchQuery }: { searchQuery: string }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const activeData = categories.find((cat) => cat.id === activeCategory);
  
  // Filter categories by search query
  const filteredCategories = categories.filter((c) => {
    if (c.id === 'all') return true;
    return c.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
  });

  // Filter event items based on activeCategory and search query
  const filteredEvents = eventItems.filter((item) => {
    const matchesQuery = 
      item.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.trim().toLowerCase());

    if (!matchesQuery) return false;
    if (activeCategory === 'all') return true;
    return item.categoryId === activeCategory;
  });

  return (
    <div className="w-full bg-black">
      {/* Sticky Navigation Header */}
      <nav className="sticky top-16 z-30 border-b border-dark-border bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex flex-row items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3">
              {/* Tabbed navigation */}
              <div role="tablist" aria-label="Event categories" className="flex gap-3 overflow-x-auto no-scrollbar py-1 flex-1">
                {filteredCategories.map((category, idx) => {
                  const selected = activeCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      id={`tab-${category.id}`}
                      role="tab"
                      aria-selected={selected}
                      aria-controls={`panel-${category.id}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActiveCategory(category.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowRight') {
                          const next = filteredCategories[(idx + 1) % filteredCategories.length];
                          setActiveCategory(next.id);
                        } else if (e.key === 'ArrowLeft') {
                          const prev = filteredCategories[(idx - 1 + filteredCategories.length) % filteredCategories.length];
                          setActiveCategory(prev.id);
                        }
                      }}
                      className={`flex-shrink-0 px-3 py-2 rounded-md font-bold text-xs transition-all whitespace-nowrap ${
                        selected
                          ? 'text-neon-purple underline underline-offset-8 decoration-2 decoration-neon-purple neon-text-glow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-gray-500 whitespace-nowrap">{filteredEvents.length} events found</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeData && (
          <div className="space-y-6 animate-fadeIn">
            {/* Category Header */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {activeData.name}
              </h2>
              <p className="text-sm text-gray-400 max-w-2xl">
                {activeData.description}
              </p>
            </div>

            {/* Content Grid */}
            {filteredEvents.length === 0 ? (
              <p className="text-xs text-gray-500 py-8">No campus events match your selection.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
                {filteredEvents.map((item) => (
                  <div key={item.id} className="bg-dark-card rounded-lg p-6 border border-dark-border hover:border-neon-purple/30 transition-all duration-300 flex flex-col justify-between h-56">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neon-purple/10 text-neon-lavender border border-neon-purple/20 rounded-full">
                          {item.categoryName}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-normal">{item.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed truncate-2-lines">{item.summary}</p>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-dark-border/40">
                      <a 
                        href={item.detailLink} 
                        className="text-xs px-3 py-1.5 rounded-md bg-dark-hover border border-dark-border text-white hover:text-neon-purple hover:border-neon-purple/40 transition-all"
                      >
                        View Details
                      </a>
                      <a 
                        href="/event" 
                        className="text-xs px-3 py-1.5 rounded-md bg-neon-purple text-white shadow-neon hover:bg-neon-purple/95 transition-all font-bold"
                      >
                        Register
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
