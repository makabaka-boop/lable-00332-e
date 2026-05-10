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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
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
        <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
          <div className="lg:hidden absolute top-4 right-4 z-20">
            <Button
              variant="outline"
              size="sm"
              className="bg-card/80 backdrop-blur-sm"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
          </div>
          
          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-card border-l border-border/40 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border/40 bg-card">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Filter className="h-4 w-4" />
                    筛选
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="py-2">
                  <Filters 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                    onReset={() => {
                      handleReset();
                      setIsMobileFilterOpen(false);
                    }}
                    hideHeader
                  />
                </div>
              </div>
            </div>
          )}
          
          <ChartSection filters={filters} />
        </main>
      </div>
    </div>
  );
}
