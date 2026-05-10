import { BarChart3 } from 'lucide-react';

export function Header() {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">LLM Leaderboard: Price vs Performance</h1>
      </div>
    </header>
  );
}
