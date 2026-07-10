import { NextResponse } from 'next/server';
import { getRecommendedEvents } from '../../../lib/recommendations.js';

// Recommendations depend on the user, so cache per-email with a short TTL
// instead of a single global value.
const REC_CACHE_TTL_MS = 30_000;
const recCache = new Map();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required to fetch personalized recommendations' }, { status: 400 });
    }

    const cached = recCache.get(email);
    if (cached && Date.now() - cached.at < REC_CACHE_TTL_MS) {
      return NextResponse.json({ success: true, recommendations: cached.data, cached: true });
    }

    const recommendations = await getRecommendedEvents(email);
    recCache.set(email, { at: Date.now(), data: recommendations });

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error('Recommendation API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch recommendations' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
