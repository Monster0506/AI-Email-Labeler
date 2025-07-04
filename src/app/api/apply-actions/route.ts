import { google, gmail_v1 } from 'googleapis';

async function createOrGetLabel(gmail: gmail_v1.Gmail, labelName: string, color: string): Promise<string | undefined> {
  const reservedNames = ['INBOX', 'SENT', 'DRAFT', 'SPAM', 'TRASH', 'IMPORTANT', 'STARRED', 'UNREAD'];
  const isReserved = reservedNames.includes(labelName.toUpperCase());
  const finalLabelName = isReserved ? `Custom_${labelName}` : labelName;
  const labelsResponse = await gmail.users.labels.list({ userId: 'me' });
  const existingLabel = labelsResponse.data.labels?.find((label: gmail_v1.Schema$Label) => label.name === finalLabelName && label.type === 'user');
  if (existingLabel) return existingLabel.id ?? undefined;
  const newLabel = await gmail.users.labels.create({
    userId: 'me',
    requestBody: {
      name: finalLabelName,
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show',
      color: {
        backgroundColor: color || '#fad165',
        textColor: '#000000'
      }
    }
  });
  return newLabel.data.id ?? undefined;
}

async function createOrGetPriorityLabel(gmail: gmail_v1.Gmail, priority: number): Promise<string | undefined> {
  const priorityLabelName = `P${priority}`;
  const labelsResponse = await gmail.users.labels.list({ userId: 'me' });
  const existingLabel = labelsResponse.data.labels?.find((label: gmail_v1.Schema$Label) => label.name === priorityLabelName && label.type === 'user');
  if (existingLabel) return existingLabel.id ?? undefined;
  const priorityColors: Record<number, string> = {
    0: '#fad165', // Yellow 1
    1: '#fb4c2f', // Red 1
    2: '#43d692', // Green 2
    3: '#4a86e8', // Blue 1
    4: '#a479e2', // Purple 1
    5: '#ffad47', // Orange 1
  };
  const newLabel = await gmail.users.labels.create({
    userId: 'me',
    requestBody: {
      name: priorityLabelName,
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show',
      color: {
        backgroundColor: priorityColors[priority] || '#fad165',
        textColor: '#000000'
      }
    }
  });
  return newLabel.data.id ?? undefined;
}

export async function POST(request: Request, { params }: { params: { [key: string]: string } }) {
  const { actions, access_token }: { actions: any[]; access_token: string } = await request.json();
  if (!access_token) return Response.json({ error: 'Missing access_token' }, { status: 400 });
  if (!actions || !Array.isArray(actions)) return Response.json({ error: 'Missing or invalid actions' }, { status: 400 });

  const userOAuth2 = new google.auth.OAuth2();
  userOAuth2.setCredentials({ access_token });
  const gmail = google.gmail({ version: 'v1', auth: userOAuth2 });
  const results: Array<Record<string, unknown>> = [];
  try {
    for (const action of actions as Record<string, unknown>[]) {
      try {
        // Apply labels if present
        if (action.labels && Array.isArray(action.labels)) {
          const labelIds: (string | undefined)[] = [];
          for (const label of action.labels as { name: string; color: string; priority: number }[]) {
            const labelId = await createOrGetLabel(gmail, label.name, label.color);
            if (labelId) labelIds.push(labelId);
            const priorityLabelId = await createOrGetPriorityLabel(gmail, label.priority);
            if (priorityLabelId) labelIds.push(priorityLabelId);
          }
          await gmail.users.messages.modify({
            userId: 'me',
            id: action.emailId as string,
            requestBody: { addLabelIds: labelIds.filter(Boolean) as string[] }
          } as gmail_v1.Params$Resource$Users$Messages$Modify);
          results.push({ emailId: action.emailId, action: 'labels', success: true, labelIds, labels: action.labels });
        }
        // Archive if shouldArchive is true
        if (action.shouldArchive === true) {
          // Add 'Archived' label (gray color)
          const archivedLabelId = await createOrGetLabel(gmail, 'Archived', '#818181');
          await gmail.users.messages.modify({
            userId: 'me',
            id: action.emailId as string,
            requestBody: { addLabelIds: archivedLabelId ? [archivedLabelId] : [] }
          } as gmail_v1.Params$Resource$Users$Messages$Modify);
          results.push({ emailId: action.emailId, action: 'archive', success: true, archivedLabelId });
        }
        // Create draft reply if draftReply is present
        if (action.draftReply) {
          const originalMessageRes = await gmail.users.messages.get({ userId: 'me', id: action.emailId as string } as gmail_v1.Params$Resource$Users$Messages$Get);
          const originalMessage = (originalMessageRes as { data: gmail_v1.Schema$Message }).data;
          if (!originalMessage || !originalMessage.payload || !originalMessage.payload.headers) {
            results.push({ emailId: action.emailId, action: 'draftReply', success: false, error: 'Original message headers not found' });
            continue;
          }
          const headers = originalMessage.payload.headers;
          const getHeader = (name: string) => headers.find((h: gmail_v1.Schema$MessagePartHeader) => h.name === name)?.value || '';
          const subject = getHeader('Subject');
          const from = getHeader('From');
          const emailMatch = from.match(/<(.+?)>/);
          const toEmail = emailMatch ? emailMatch[1] : from;
          const draftBody = `To: ${toEmail}\r\n` +
            `Subject: Re: ${subject}\r\n` +
            `Content-Type: text/plain; charset=UTF-8\r\n` +
            `\r\n` +
            `${action.draftReply}`;
          const draftRes = await gmail.users.drafts.create({
            userId: 'me',
            requestBody: {
              message: {
                raw: Buffer.from(draftBody).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
              }
            }
          });
          const draft = (draftRes as { data: gmail_v1.Schema$Draft }).data;
          results.push({ emailId: action.emailId, action: 'draftReply', success: true, draftId: draft.id });
        }
      } catch (error: unknown) {
        results.push({ emailId: action.emailId, action: action.action, success: false, error: error instanceof Error ? error.message : String(error) });
      }
    }
    return Response.json({ results });
  } catch (error: unknown) {
    return Response.json({ error: 'Failed to apply actions', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 