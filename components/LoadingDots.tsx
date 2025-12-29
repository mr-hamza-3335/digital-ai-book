'use client';

export default function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 bg-purple-400 rounded-full" />
        <span className="typing-dot w-2 h-2 bg-purple-400 rounded-full" />
        <span className="typing-dot w-2 h-2 bg-purple-400 rounded-full" />
      </div>
      <span className="ml-2 text-sm text-slate-400">Thinking...</span>
    </div>
  );
}
