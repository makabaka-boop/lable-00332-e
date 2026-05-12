'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Filters } from '@/components/dashboard/Filters';
import { ChartSection } from '@/components/dashboard/ChartSection';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Filter Button */}
        <div className="absolute top-4 right-4 z-50 lg:hidden">
          <Button
            variant="default"
            size="sm"
            className="h-9 shadow-lg"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            {isMobileFilterOpen ? (
              <X className="h-4 w-4 mr-1" />
            ) : (
              <Filter className="h-4 w-4 mr-1" />
            )}
            筛选
          </Button>
        </div>

        {/* Mobile Filter Panel */}
        <aside
          className={`lg:hidden absolute inset-x-0 top-0 z-40 border-b border-border/40 bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileFilterOpen ? 'max-h-[calc(100vh-60px)] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-14 pb-4">
            <Filters filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
          </div>
        </aside>

        {/* Desktop Filter Panel */}
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
