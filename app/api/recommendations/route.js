import { NextResponse } from 'next/server';
import { getRecommendedEvents } from '../../../lib/recommendations.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required to fetch personalized recommendations' }, { status: 400 });
    }

    const recommendations = await getRecommendedEvents(email);

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error('Recommendation API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch recommendations' }, { status: 500 });
  }
}
