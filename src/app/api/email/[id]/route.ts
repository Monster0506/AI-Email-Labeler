import { google } from 'googleapis';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token');
  const emailId = params.id;
  if (!accessToken) return Response.json({ error: 'Missing access_token' }, { status: 400 });
  if (!emailId) return Response.json({ error: 'Missing email ID' }, { status: 400 });

  const userOAuth2 = new google.auth.OAuth2();
  userOAuth2.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: 'v1', auth: userOAuth2 });

  try {
    const msgRes = await gmail.users.messages.get({ userId: 'me', id: emailId });
    const headers = msgRes.data.payload.headers;
    const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || '';
    function decodeBase64Url(str: string) {
      return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
    }
    function extractParts(payload: any) {
      let html = null, text = null;
      let maxHtmlLength = 0;
      function walk(part: any) {
        if (!part) return;
        if (part.mimeType === 'text/html') {
          const content = decodeBase64Url(part.body.data);
          if (content.length > maxHtmlLength) {
            html = content;
            maxHtmlLength = content.length;
          }
        } else if (part.mimeType === 'text/plain') {
          text = decodeBase64Url(part.body.data);
        }
        if (part.parts) {
          part.parts.forEach(walk);
        }
      }
      walk(payload);
      return { html, text };
    }
    const { html, text } = extractParts(msgRes.data.payload);
    return Response.json({
      subject: getHeader('Subject'),
      from: getHeader('From'),
      to: getHeader('To'),
      date: getHeader('Date'),
      html,
      text
    });
  } catch (err: any) {
    return Response.json({ error: 'Failed to fetch email content', details: err.message }, { status: 500 });
  }
} 