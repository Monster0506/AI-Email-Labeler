import { google } from 'googleapis';

export async function GET(request: Request, { params }: { params: { [key: string]: string } }) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token');
  if (!accessToken) {
    return Response.json({ error: 'Missing access_token' }, { status: 400 });
  }

  const userOAuth2 = new google.auth.OAuth2();
  userOAuth2.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: 'v1', auth: userOAuth2 });

  const maxResultsParam = searchParams.get('maxResults');
  const maxResults = maxResultsParam ? parseInt(maxResultsParam, 10) : 10;

  try {
    // List messages
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
    });
    const messages = listRes.data.messages || [];
    // Fetch details for each message
    const emailPromises = messages.map(async (msg: { id: string }) => {
      const msgRes = await gmail.users.messages.get({ userId: 'me', id: msg.id });
      const headers = msgRes.data.payload.headers;
      const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || '';
      const labelIds = msgRes.data.labelIds || [];
      // Get all labels to parse priority information
      const labelsResponse = await gmail.users.labels.list({ userId: 'me' });
      const labels = labelsResponse.data.labels || [];
      // Parse labels and priority labels separately
      const emailLabels: any[] = [];
      const priorityLabels: number[] = [];
      for (const labelId of labelIds) {
        const label = labels.find((l: any) => l.id === labelId);
        if (label && label.type === 'user') {
          const priorityMatch = label.name.match(/^P(\d+)$/);
          if (priorityMatch) {
            priorityLabels.push(parseInt(priorityMatch[1]));
          } else {
            const cleanLabelName = label.name.startsWith('Custom_') ? label.name.substring(7) : label.name;
            emailLabels.push({
              name: cleanLabelName,
              color: label.backgroundColor || '#818181',
              priority: 999 // Will be updated with actual priority
            });
          }
        }
      }
      // Assign priorities to labels (use the lowest priority number)
      const lowestPriority = priorityLabels.length > 0 ? Math.min(...priorityLabels) : 999;
      emailLabels.forEach(label => {
        label.priority = lowestPriority;
      });
      return {
        id: msg.id,
        snippet: msgRes.data.snippet,
        subject: getHeader('Subject'),
        from: getHeader('From'),
        date: getHeader('Date'),
        read: !labelIds.includes('UNREAD'),
        labels: emailLabels.length > 0 ? emailLabels : undefined
      };
    });
    const emails = await Promise.all(emailPromises);
    return Response.json({ emails });
  } catch (err: any) {
    return Response.json({ error: 'Failed to fetch emails', details: err.message }, { status: 500 });
  }
} 