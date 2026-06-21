'use client';

import { useState, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, ExternalLink, Search } from 'lucide-react';

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  salary: string;
  description: string;
  tags: string[];
}

const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Frontend Developer Intern',
    company: 'NeonTech Labs',
    type: 'Internship',
    location: 'Remote',
    salary: '$20/hr',
    description: 'Join our core frontend team to build next-gen interactive React and Next.js applications.',
    tags: ['React', 'Next.js', 'Tailwind'],
  },
  {
    id: 'opp-2',
    title: 'Smart Contract Bounty',
    company: 'DeFi Protocols',
    type: 'Bounty',
    location: 'Remote',
    salary: '$500 - $2000',
    description: 'Find and patch vulnerabilities in our new liquidity pool staking contract on Ethereum.',
    tags: ['Solidity', 'Security', 'Web3'],
  },
  {
    id: 'opp-3',
    title: 'Junior Data Scientist',
    company: 'Quantum Analytics',
    type: 'Full-time',
    location: 'New York, NY',
    salary: '$80k - $100k',
    description: 'Analyze large datasets and train predictive machine learning models for fintech clients.',
    tags: ['Python', 'PyTorch', 'SQL'],
  },
  {
    id: 'opp-4',
    title: 'UI/UX Design Freelance',
    company: 'Creative Studios',
    type: 'Freelance',
    location: 'Hybrid',
    salary: '$40/hr',
    description: 'Design a high-converting landing page and onboarding flow for a new consumer app.',
    tags: ['Figma', 'Prototyping', 'User Research'],
  },
  {
    id: 'opp-5',
    title: 'Backend Engineering Intern',
    company: 'CloudScale Inc',
    type: 'Internship',
    location: 'San Francisco, CA',
    salary: '$25/hr',
    description: 'Help scale our Go microservices handling millions of concurrent requests daily.',
    tags: ['Go', 'Kubernetes', 'AWS'],
  },
];

export default function OpportunitiesBoard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('All');

  const types = useMemo(() => {
    const uniqueTypes = new Set(mockOpportunities.map(opp => opp.type));
    return ['All', ...Array.from(uniqueTypes)];
  }, []);

  const filteredOpportunities = useMemo(() => {
    return mockOpportunities.filter(opp => {
      const matchType = activeType === 'All' || opp.type === activeType;
      const matchText = searchQuery.toLowerCase().trim();
      const matchSearch = 
        opp.title.toLowerCase().includes(matchText) ||
        opp.company.toLowerCase().includes(matchText) ||
        opp.description.toLowerCase().includes(matchText) ||
        opp.tags.some(tag => tag.toLowerCase().includes(matchText));
      
      return matchType && matchSearch;
    });
  }, [searchQuery, activeType]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 15 
      } 
    },
  };

  const getTypeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'internship':
        return 'bg-neon-purple/10 text-neon-lavender border border-neon-purple/30';
      case 'freelance':
        return 'bg-pink-950/40 text-pink-400 border border-pink-800/40';
      case 'bounty':
        return 'bg-yellow-950/40 text-yellow-400 border border-yellow-800/40';
      case 'full-time':
        return 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40';
      default:
        return 'bg-zinc-800/60 text-zinc-300 border border-dark-border';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-dark-border pb-8">
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search roles, skills, or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-950/50 border border-dark-border rounded-xl text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple backdrop-blur-md transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-xs transition-all whitespace-nowrap ${
                activeType === type
                  ? 'bg-neon-purple text-white shadow-neon'
                  : 'bg-zinc-900/50 text-gray-400 hover:text-white hover:bg-zinc-800 border border-dark-border'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      {filteredOpportunities.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-zinc-950/20 border border-dark-border rounded-2xl">
          <p className="text-sm">No opportunities match your search.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredOpportunities.map((opp) => (
            <motion.div
              key={opp.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-zinc-950/50 backdrop-blur-md border border-dark-border hover:border-neon-purple hover:shadow-neon rounded-2xl p-6 transition-all duration-300 flex flex-col h-full group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${getTypeStyle(opp.type)}`}>
                  {opp.type}
                </span>
                <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-emerald-400" /> {opp.salary}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                <h3 className="text-lg font-black text-white group-hover:text-neon-lavender transition-colors leading-tight">
                  {opp.title}
                </h3>
                <p className="text-xs text-neon-purple font-bold">
                  {opp.company}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono mb-4">
                <MapPin className="h-3 w-3 shrink-0" />
                <span>{opp.location}</span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-6 flex-grow">
                {opp.description}
              </p>

              <div className="space-y-4 mt-auto">
                <div className="flex flex-wrap gap-2">
                  {opp.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-mono font-bold text-gray-300 bg-zinc-800/60 border border-dark-border px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-dark-border/40">
                  <button className="w-full py-2 bg-dark-hover hover:bg-neon-purple border border-dark-border hover:border-neon-purple text-white hover:text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 group-hover:shadow-neon">
                    Apply Now <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
