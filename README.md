# AI Email Assistant

<div align="center">

![AI Email Assistant](https://img.shields.io/badge/AI-Powered%20Email%20Assistant-blue?style=for-the-badge&logo=google-gmail)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**The next-generation email assistant powered by AI. Organize, label, and reply to your emails with a single click.**

[Live Demo](https://ai-email-taupe.vercel.app/) • [Privacy Policy](./src/app/privacy-policy/page.tsx)
Inspired by https://koomen.dev/essays/horseless-carriages/

</div>

## ✨ Features

### 🤖 AI-Powered Organization
- **Smart Labeling**: Automatically categorize emails using advanced AI models
- **Priority Sorting**: Intelligent prioritization based on sender, content, and context
- **Custom Rules**: Define your own labeling and processing rules
- **Batch Processing**: Apply AI suggestions to multiple emails at once

### 💬 Smart Replies
- **Context-Aware Drafts**: AI generates personalized, professional responses
- **Tone Matching**: Adapts writing style to match your communication preferences
- **Quick Actions**: One-click reply generation and sending
- **Customizable Prompts**: Save and reuse your favorite AI prompts

### 🔒 Privacy First
- **Secure OAuth**: Google OAuth integration - we never see your password
- **Local Processing**: Email content processed securely
- **No Data Retention**: Your data stays yours
- **Industry Encryption**: Enterprise-grade security standards

### 🎨 Modern Interface
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Mode**: Beautiful themes for any preference
- **Real-time Updates**: Instant feedback on AI actions
- **Intuitive Controls**: Easy-to-use interface with keyboard shortcuts

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4.0, Framer Motion
- **AI/ML**: Google Generative AI (Gemini)
- **Email API**: Gmail API via Googleapis
- **Authentication**: Google OAuth 2.0
- **Deployment**: Vercel
- **Development**: ESLint, PostCSS

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Project with Gmail API enabled
- Google Generative AI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-email.git
   cd ai-email
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Google Cloud Setup**
   - Create a Google Cloud Project
   - Enable Gmail API
   - Create OAuth 2.0 credentials
   - Enable Google Generative AI API
   - Get your API keys

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Usage

### Getting Started

1. **Sign In**: Click "Get Started" and authenticate with your Google account
2. **Configure AI Prompt**: Customize the system prompt to match your email processing needs
3. **Select Emails**: Choose which emails to process with AI
4. **Apply Actions**: Review AI suggestions and apply them to your inbox
5. **Save to Gmail**: Persist changes back to your Gmail account

### AI Prompt Examples

```javascript
// Basic email categorization
You are an email labeling assistant. Analyze emails and:
- Label newsletters as "Newsletter" (blue, priority 3)
- Label GitHub notifications as "GitHub" (green, priority 1)
- Archive promotional emails
- Draft quick replies for urgent messages

// Professional communication
You're a busy professional. Draft concise, professional replies that:
- Acknowledge receipt
- Provide clear next steps
- Maintain professional tone
- Keep responses under 3 sentences
```

### Available Actions

- **`labelEmail(label, color, priority)`**: Add custom labels with colors and priorities
- **`archiveEmail()`**: Move emails to archive
- **`draftReply(body)`**: Generate contextual reply drafts

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/callback` - OAuth callback handler

### Email Management
- `GET /api/emails` - Fetch emails from Gmail
- `GET /api/email/[id]` - Get specific email content
- `POST /api/process-emails` - Process emails with AI
- `POST /api/apply-actions` - Apply AI suggestions to Gmail

### Configuration
- `GET /api/test` - Test API connectivity
- `POST /api/refresh-token` - Refresh OAuth tokens

## 🛡️ Privacy & Security

### Data Protection
- **OAuth Only**: We never store or see your Gmail password
- **Minimal Access**: Only requested Gmail permissions are used
- **Local Processing**: Email content is processed securely
- **No Retention**: We don't store email content after processing

### Permissions
- **Read Emails**: To analyze and categorize your inbox
- **Modify Labels**: To apply AI-generated labels
- **Send Emails**: To draft and send replies (with your approval)

### Compliance
- **GDPR Ready**: Full data portability and deletion rights
- **CCPA Compliant**: California privacy law compliance
- **SOC 2**: Industry-standard security practices

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Fork and clone the repository
git clone https://github.com/yourusername/ai-email.git
cd ai-email

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits for version control

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gmail API** for email integration
- **Google Generative AI** for intelligent email processing
- **Next.js Team** for the amazing framework
- **Vercel** for seamless deployment
- **Tailwind CSS** for beautiful styling


---

<div align="center">

**Made with ❤️ by the AI Email Team**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/ai-email?style=social)](https://github.com/yourusername/ai-email)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/ai-email?style=social)](https://github.com/yourusername/ai-email)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/ai-email)](https://github.com/yourusername/ai-email/issues)

</div>
