import { google } from 'googleapis';
import { GoogleGenerativeAI } from '@google/generative-ai';

const COLOR_PALETTE = [
  { name: "Black", hex: "#000000" },
  { name: "Dark Gray 1", hex: "#434343" },
  { name: "Dark Gray 2", hex: "#666666" },
  { name: "Gray 1", hex: "#999999" },
  { name: "Gray 2", hex: "#cccccc" },
  { name: "Light Gray 1", hex: "#efefef" },
  { name: "Light Gray 2", hex: "#f3f3f3" },
  { name: "White", hex: "#ffffff" },
  { name: "Red 1", hex: "#fb4c2f" },
  { name: "Orange 1", hex: "#ffad47" },
  { name: "Yellow 1", hex: "#fad165" },
  { name: "Green 1", hex: "#16a766" },
  { name: "Green 2", hex: "#43d692" },
  { name: "Blue 1", hex: "#4a86e8" },
  { name: "Purple 1", hex: "#a479e2" },
  { name: "Pink 1", hex: "#f691b3" },
  { name: "Pink 2", hex: "#f6c5be" },
  { name: "Peach 1", hex: "#ffe6c7" },
  { name: "Yellow 2", hex: "#fef1d1" },
  { name: "Mint 1", hex: "#b9e4d0" },
  { name: "Mint 2", hex: "#c6f3de" },
  { name: "Lavender 1", hex: "#c9daf8" },
  { name: "Lavender 2", hex: "#e4d7f5" },
  { name: "Pink 3", hex: "#fcdee8" },
  { name: "Coral 1", hex: "#efa093" },
  { name: "Orange 2", hex: "#ffd6a2" },
  { name: "Yellow 3", hex: "#fce8b3" },
  { name: "Green 3", hex: "#89d3b2" },
  { name: "Green 4", hex: "#a0eac9" },
  { name: "Blue 2", hex: "#a4c2f4" },
  { name: "Purple 2", hex: "#d0bcf1" },
  { name: "Pink 4", hex: "#fbc8d9" },
  { name: "Red 2", hex: "#e66550" },
  { name: "Orange 3", hex: "#ffbc6b" },
  { name: "Yellow 4", hex: "#fcda83" },
  { name: "Green 5", hex: "#44b984" },
  { name: "Green 6", hex: "#68dfa9" },
  { name: "Blue 3", hex: "#6d9eeb" },
  { name: "Purple 3", hex: "#b694e8" },
  { name: "Pink 5", hex: "#f7a7c0" },
  { name: "Red 3", hex: "#cc3a21" },
  { name: "Orange 4", hex: "#eaa041" },
  { name: "Yellow 5", hex: "#f2c960" },
  { name: "Green 7", hex: "#149e60" },
  { name: "Green 8", hex: "#3dc789" },
  { name: "Blue 4", hex: "#3c78d8" },
  { name: "Purple 4", hex: "#8e63ce" },
  { name: "Pink 6", hex: "#e07798" },
  { name: "Red 4", hex: "#ac2b16" },
  { name: "Orange 5", hex: "#cf8933" },
  { name: "Yellow 6", hex: "#d5ae49" },
  { name: "Green 9", hex: "#0b804b" },
  { name: "Green 10", hex: "#2a9c68" },
  { name: "Blue 5", hex: "#285bac" },
  { name: "Purple 5", hex: "#653e9b" },
  { name: "Pink 7", hex: "#b65775" },
  { name: "Red 5", hex: "#822111" },
  { name: "Orange 6", hex: "#a46a21" },
  { name: "Yellow 7", hex: "#aa8831" },
  { name: "Green 11", hex: "#076239" },
  { name: "Green 12", hex: "#1a764d" },
  { name: "Blue 6", hex: "#1c4587" },
  { name: "Purple 6", hex: "#41236d" },
  { name: "Pink 8", hex: "#83334c" },
  { name: "Gray 3", hex: "#464646" },
  { name: "Gray 4", hex: "#e7e7e7" },
  { name: "Blue 7", hex: "#0d3472" },
  { name: "Blue 8", hex: "#b6cff5" },
  { name: "Blue 9", hex: "#0d3b44" },
  { name: "Blue 10", hex: "#98d7e4" },
  { name: "Purple 7", hex: "#3d188e" },
  { name: "Purple 8", hex: "#e3d7ff" },
  { name: "Pink 9", hex: "#711a36" },
  { name: "Pink 10", hex: "#fbd3e0" },
  { name: "Red 6", hex: "#8a1c0a" },
  { name: "Red 7", hex: "#f2b2a8" },
  { name: "Orange 7", hex: "#7a2e0b" },
  { name: "Orange 8", hex: "#ffc8af" },
  { name: "Yellow 8", hex: "#7a4706" },
  { name: "Yellow 9", hex: "#ffdeb5" },
  { name: "Brown 1", hex: "#594c05" },
  { name: "Yellow 10", hex: "#fbe983" },
  { name: "Yellow 11", hex: "#684e07" },
  { name: "Yellow 12", hex: "#fdedc1" },
  { name: "Green 13", hex: "#0b4f30" },
  { name: "Green 14", hex: "#b3efd3" },
  { name: "Green 15", hex: "#04502e" },
  { name: "Green 16", hex: "#a2dcc1" },
  { name: "Gray 5", hex: "#c2c2c2" },
  { name: "Blue 11", hex: "#4986e7" },
  { name: "Blue 12", hex: "#2da2bb" },
  { name: "Purple 9", hex: "#b99aff" },
  { name: "Pink 11", hex: "#994a64" },
  { name: "Pink 12", hex: "#f691b2" },
  { name: "Orange 9", hex: "#ff7537" },
  { name: "Orange 10", hex: "#ffad46" },
  { name: "Pink 13", hex: "#662e37" },
  { name: "Pink 14", hex: "#ebdbde" },
  { name: "Pink 15", hex: "#cca6ac" },
  { name: "Green 17", hex: "#094228" },
  { name: "Green 18", hex: "#42d692" },
  { name: "Green 19", hex: "#16a765" },
];

export async function POST(request: Request, { params }: { params: { [key: string]: string } }) {
  const { prompt, emails, access_token } = await request.json();
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: 'GEMINI_API_KEY not set in .env' }, { status: 500 });
  }
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const paletteDesc = COLOR_PALETTE.map(c => `${c.name}: ${c.hex}`).join(", ");
    const schema = {
      type: "array",
      description: `Actions to take for each email. For label colors, only use one of the following hex codes: ${paletteDesc}`,
      minItems: emails.length,
      items: {
        type: "object",
        properties: {
          emailId: { type: "string", description: "The email's unique ID" },
          labels: {
            type: "array",
            description: "Array of labels to apply to this email",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "Label name" },
                color: {
                  type: "string",
                  pattern: "^#[0-9a-f]{6}$",
                  description: `A hex color code for the label. Only use: ${paletteDesc}`
                },
                priority: { type: "integer", description: "Priority number (lower = higher priority)" }
              },
              required: ["name", "color", "priority"]
            }
          },
          draftReply: { type: "string", nullable: true },
          summary: { type: "string", nullable: true, description: "A concise summary of the full email body, not just the subject" },
          shouldArchive: { type: "boolean", nullable: true, description: "Whether to archive the email" }
        },
        required: ["emailId"]
      }
    };
    const model = genAI.getGenerativeModel({
      systemInstruction: `You are a helpful assistant that helps users manage their emails. For label colors, only use the following palette: ${paletteDesc}`,
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    // Fetch full body for each email
    async function getFullBody(email: any) {
      const userOAuth2 = new google.auth.OAuth2();
      userOAuth2.setCredentials({ access_token });
      const gmail = google.gmail({ version: 'v1', auth: userOAuth2 });
      const msgRes = await gmail.users.messages.get({ userId: 'me', id: email.id });
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
      return html || text || '';
    }
    const emailsWithBody = await Promise.all(emails.map(async (email: any) => ({
      ...email,
      body: await getFullBody(email)
    })));
    const result = await model.generateContent(`${prompt}\n\nEmails to process:\n${JSON.stringify(emailsWithBody, null, 2)}`);
    const response = await result.response;
    const actions = JSON.parse(response.text());
    return Response.json({ actions });
  } catch (error: any) {
    return Response.json({ error: 'Failed to process emails', details: error.message }, { status: 500 });
  }
} 