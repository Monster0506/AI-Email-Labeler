import { NextRequest } from 'next/server';
import { google } from 'googleapis';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  const redirectUri = `${BASE_URL}/api/auth/google/callback`;

  let tokens;
  try {
    const result = await oauth2Client.getToken({ code, redirect_uri: redirectUri });
    tokens = result.tokens;
  } catch (err: any) {
    console.error('OAuth token exchange error:', err.response?.data || err.message || err);
    return new Response('Error exchanging code for tokens', { status: 500 });
  }

  const frontendUrl = BASE_URL + '/home';
  return redirect(`${frontendUrl}?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`);
} 