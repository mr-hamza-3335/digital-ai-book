# DeepSeek Chatbot - Pochy Books & General Knowledge

A modern, responsive chatbot powered by **DeepSeek R1 API** that provides comprehensive information about Pochy books and answers general knowledge questions.

![DeepSeek Chatbot](https://img.shields.io/badge/DeepSeek-R1%20API-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-Ready-black?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge)

## Features

- **Pochy Books Expert**: Comprehensive knowledge about Pochy books content, themes, and teachings
- **General Knowledge**: Answers questions on any topic (science, history, technology, etc.)
- **Modern UI**: Clean, responsive design with smooth animations
- **Dark Mode**: Beautiful dark theme optimized for readability
- **Conversation History**: Persists chat history in local storage
- **Rate Limiting**: Built-in protection against API abuse
- **Error Handling**: Graceful handling of API errors and rate limits
- **Copy Responses**: Easy copying of assistant responses
- **Suggested Prompts**: Quick-start prompts for new users

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI Model | DeepSeek R1 (via OpenAI-compatible API) |
| Icons | Lucide React |
| Deployment | Vercel |

## Project Structure

```
deepseek-chatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # Chat API endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── components/
│   ├── ChatInterface.tsx     # Main chat component
│   ├── ChatMessage.tsx       # Message bubble component
│   ├── Header.tsx            # App header
│   ├── Footer.tsx            # App footer
│   └── LoadingDots.tsx       # Loading animation
├── lib/
│   ├── deepseek.ts           # DeepSeek API client
│   └── knowledge.ts          # Pochy books knowledge base
├── public/                   # Static assets
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind configuration
├── vercel.json               # Vercel configuration
└── package.json              # Dependencies
```

## Quick Start

### Prerequisites

- Node.js 18.17+
- npm or yarn
- DeepSeek API key (get one at [platform.deepseek.com](https://platform.deepseek.com))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/deepseek-chatbot.git
   cd deepseek-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Add your DeepSeek API key** to `.env.local`:
   ```
   DEEPSEEK_API_KEY=your-deepseek-api-key-here
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/deepseek-chatbot&env=DEEPSEEK_API_KEY&envDescription=DeepSeek%20API%20key%20for%20the%20chatbot&project-name=deepseek-chatbot&repository-name=deepseek-chatbot)

### Manual Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure environment variables:
     - `DEEPSEEK_API_KEY`: Your DeepSeek API key

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Auto-Deploy from GitHub

Once connected, Vercel will automatically deploy:
- Every push to `main` branch
- Pull request previews for review

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DEEPSEEK_API_KEY` | Yes | Your DeepSeek API key |
| `DEEPSEEK_API_BASE` | No | Custom API base URL (default: `https://api.deepseek.com`) |
| `DEEPSEEK_MODEL` | No | Model to use (default: `deepseek-reasoner`) |

### Getting a DeepSeek API Key

1. Visit [platform.deepseek.com](https://platform.deepseek.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your environment variables

## API Reference

### POST /api/chat

Send a chat message and get a response.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "includeReasoning": false
}
```

**Response:**
```json
{
  "message": "Hello! How can I help you today?",
  "reasoning": "..."
}
```

**Error Response:**
```json
{
  "error": "Error message here"
}
```

### GET /api/chat

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "DeepSeek Chatbot API",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Customizing Pochy Books Content

To add or modify Pochy books content, edit `lib/knowledge.ts`:

```typescript
export const pochyBooks: PochyBook[] = [
  {
    title: "Your Book Title",
    author: "Author Name",
    description: "Book description...",
    keywords: ["keyword1", "keyword2"],
    chapters: [
      {
        title: "Chapter 1",
        content: "Chapter content...",
        summary: "Brief summary"
      }
    ]
  }
];
```

## Troubleshooting

### Common Issues

**1. 404 Error on Refresh**
- Ensure `vercel.json` is properly configured
- Check that routing is set up correctly in `next.config.js`

**2. API Key Not Working**
- Verify the key is correctly set in environment variables
- Check that the key hasn't expired
- Ensure you're using the correct API base URL

**3. Rate Limit Exceeded**
- Wait 1 minute before retrying
- Consider upgrading your DeepSeek plan for higher limits

**4. Build Errors**
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

### GitHub 404 Issues

If you're experiencing 404 errors on GitHub Pages:
- This project is designed for **Vercel deployment**, not GitHub Pages
- GitHub Pages doesn't support Next.js API routes
- Use Vercel for full functionality

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [DeepSeek](https://deepseek.com) for the powerful R1 API
- [Vercel](https://vercel.com) for seamless deployment
- [Next.js](https://nextjs.org) for the awesome framework
- [Tailwind CSS](https://tailwindcss.com) for beautiful styling
