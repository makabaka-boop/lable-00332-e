'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Filters } from '@/components/dashboard/Filters';
import { ChartSection } from '@/components/dashboard/ChartSection';

export interface FilterState {
  selectedFamilies: Set<string>;
  maxPrice: number;
  contextWindow: string;
  openSourceOnly: boolean;
  verifiedOnly: boolean;
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    selectedFamilies: new Set(['GPT-4', 'Claude 3', 'Llama 3', 'Gemini', 'Mistral']),
    maxPrice: 50,
    contextWindow: 'all',
    openSourceOnly: false,
    verifiedOnly: true,
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleReset = () => {
    setFilters({
      selectedFamilies: new Set(['GPT-4', 'Claude 3', 'Llama 3', 'Gemini', 'Mistral']),
      maxPrice: 50,
      contextWindow: 'all',
      openSourceOnly: false,
      verifiedOnly: true,
    });
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-80 flex-col border-r border-border/40 bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-background/20 lg:flex">
          <Filters filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
        </aside>
        <main className="flex-1 overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
          <ChartSection filters={filters} />
        </main>
      </div>
    </div>
  );
}
