'use client';

import { Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass border-t border-white/10 py-4">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for Pochy Books</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://platform.deepseek.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-1"
            >
              DeepSeek API
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-1"
            >
              Deployed on Vercel
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Version */}
          <div className="text-xs text-slate-500">
            v1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
}
