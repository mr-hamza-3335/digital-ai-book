import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DeepSeek Chatbot - Pochy Books & General Knowledge',
  description: 'An intelligent chatbot powered by DeepSeek R1 API, providing comprehensive information about Pochy books and general knowledge.',
  keywords: ['chatbot', 'DeepSeek', 'AI', 'Pochy books', 'knowledge base'],
  authors: [{ name: 'DeepSeek Chatbot' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {children}
      </body>
    </html>
  );
}
