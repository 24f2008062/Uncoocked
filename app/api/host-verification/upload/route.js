import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileData, fileType } = body;

    if (!fileData) {
      return NextResponse.json({ error: 'File data is required' }, { status: 400 });
    }

    // Validate size limit (approx 5MB limit on Base64 string length ~7MB)
    if (fileData.length > 7 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // In a production server, save to S3/Cloud Storage. For MVP, store structured Data URL safely.
    const fileId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    return NextResponse.json({
      success: true,
      document: {
        id: fileId,
        fileName: fileName || "verification-document",
        fileType: fileType || "application/octet-stream",
        url: fileData, // Base64 data URL
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json({ error: 'Failed to process document upload' }, { status: 500 });
  }
}
