import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

// Weights for recommendation calculation
const WEIGHTS = {
  INTEREST_MATCH: 0.40,
  TAG_SIMILARITY: 0.25,
  PREVIOUS_ENGAGEMENT: 0.20,
  POPULARITY: 0.15,
};

export async function getRecommendedEvents(userEmail) {
  // Fetch user with interests and their interaction history
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      activities: {
        include: {
          event: true
        }
      },
      registrations: {
        include: {
          event: true
        }
      }
    }
  });

  const registeredEventIds = user ? new Set(user.registrations.map(r => r.eventId)) : new Set();
  
  const events = await prisma.event.findMany({
    where: {
      id: {
        notIn: Array.from(registeredEventIds)
      }
    }
  });

  const userInterests = user && user.interests ? JSON.parse(user.interests) : [];
  
  if (!user || !user.onboardingCompleted || userInterests.length === 0) {
    // Fallback: Sort by popularity score and then date
    const fallbackEvents = events.sort((a, b) => b.popularityScore - a.popularityScore || a.date - b.date);
    return fallbackEvents.slice(0, 10).map(event => ({
      ...event,
      recommendationReason: "Trending Event",
      recommendationScore: event.popularityScore
    }));
  }

  // User engagement data
  const userViewedTags = new Set();
  const userSavedTags = new Set();
  const userRegisteredTags = new Set();
  
  // Analyze tags from past interactions
  user.activities.forEach(activity => {
    try {
      const tags = activity.event.tags ? JSON.parse(activity.event.tags) : [];
      tags.forEach(t => {
        if (activity.interactionType === 'VIEW') userViewedTags.add(t);
        if (activity.interactionType === 'SAVE') userSavedTags.add(t);
      });
    } catch (e) {
      // ignore JSON parse error
    }
  });
  
  user.registrations.forEach(reg => {
    try {
      const tags = reg.event.tags ? JSON.parse(reg.event.tags) : [];
      tags.forEach(t => userRegisteredTags.add(t));
    } catch (e) {
      // ignore
    }
  });

  // Calculate scores
  const scoredEvents = events.map(event => {
    let score = 0;
    let reason = "Recommended for you";
    
    // 1. Interest Match (40%)
    let interestScore = 0;
    const userInterestsLower = userInterests.map(i => i.toLowerCase());
    
    const isCategoryMatch = 
      (event.category && userInterestsLower.includes(event.category.toLowerCase())) || 
      (event.type && userInterestsLower.includes(event.type.toLowerCase()));
    
    let eventTags = [];
    try {
      eventTags = event.tags ? JSON.parse(event.tags) : [];
    } catch (e) {}
    
    let eventKeywords = [];
    try {
      eventKeywords = event.keywords ? JSON.parse(event.keywords) : [];
    } catch (e) {}

    const hasInterestInTags = eventTags.some(tag => userInterestsLower.some(i => tag.toLowerCase().includes(i)));
    const hasInterestInKeywords = eventKeywords.some(kw => userInterestsLower.some(i => kw.toLowerCase().includes(i)));
    
    const hasInterestInTitleOrDesc = userInterestsLower.some(i => {
      const matchTitle = event.title && event.title.toLowerCase().includes(i);
      const matchDesc = event.description && event.description.toLowerCase().includes(i);
      return matchTitle || matchDesc;
    });
    
    if (isCategoryMatch) interestScore += 100;
    else if (hasInterestInTags || hasInterestInKeywords || hasInterestInTitleOrDesc) interestScore += 70;
    
    // 2. Tag Similarity / Engagement Profile (25% + 20%)
    let tagScore = 0;
    let engagementScore = 0;
    
    eventTags.forEach(tag => {
      // We merge tag similarity and engagement logic
      if (userSavedTags.has(tag)) {
        engagementScore += 50;
        tagScore += 50;
      } else if (userRegisteredTags.has(tag)) {
        engagementScore += 40;
        tagScore += 40;
      } else if (userViewedTags.has(tag)) {
        engagementScore += 20;
        tagScore += 20;
      }
    });

    // Normalize engagement/tag scores (cap at 100)
    tagScore = Math.min(tagScore, 100);
    engagementScore = Math.min(engagementScore, 100);

    // 3. Popularity (15%)
    const popularityScore = Math.min(event.popularityScore || 0, 100);
    
    // Total Score
    score = (interestScore * WEIGHTS.INTEREST_MATCH) +
            (tagScore * WEIGHTS.TAG_SIMILARITY) +
            (engagementScore * WEIGHTS.PREVIOUS_ENGAGEMENT) +
            (popularityScore * WEIGHTS.POPULARITY);
            
    // Determine Reason
    if (isCategoryMatch) {
      reason = `Matches your interest in ${event.category}`;
    } else if (interestScore > 0) {
      reason = `Matches your selected interests`;
    } else if (engagementScore > 40) {
      reason = `Similar to events you've interacted with`;
    } else if (popularityScore > 80) {
      reason = `Highly popular right now`;
    }

    return {
      ...event,
      recommendationScore: score,
      recommendationReason: reason
    };
  });

  // Sort by score descending
  scoredEvents.sort((a, b) => b.recommendationScore - a.recommendationScore);
  
  // Return top 10
  return scoredEvents.slice(0, 10);
}
