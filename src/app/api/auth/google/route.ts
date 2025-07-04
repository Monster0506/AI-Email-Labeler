import { NextRequest } from 'next/server';
import { google } from 'googleapis';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);

  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send',
    'profile',
    'email',
  ];

  // The callback endpoint in Next.js
  const redirectUri = `${BASE_URL}/api/auth/google/callback`;

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    redirect_uri: redirectUri,
  });

  return redirect(url);
} 