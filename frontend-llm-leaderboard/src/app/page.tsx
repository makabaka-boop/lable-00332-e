'use client';

import { useState, useRef, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Filters } from '@/components/dashboard/Filters';
import { ChartSection } from '@/components/dashboard/ChartSection';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';

export interface FilterState {
  selectedFamilies: Set<string>;
  maxPrice: number;
  contextWindow: string;
  openSourceOnly: boolean;
  verifiedOnly: boolean;
}

export interface ModelData {
  name: string;
  price: number;
  score: number;
  family: string;
  type: string;
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    selectedFamilies: new Set(['GPT-4', 'Claude 3', 'Llama 3', 'Gemini', 'Mistral']),
    maxPrice: 50,
    contextWindow: 'all',
    openSourceOnly: false,
    verifiedOnly: true,
  });

  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);
  const drawerRef = useRef<HTMLDialogElement>(null);

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

  const handleModelSelect = (model: ModelData | null) => {
    setSelectedModel(prev => {
      if (prev && prev.name === model?.name) {
        return null;
      }
      return model;
    });
  };

  const openDrawer = useCallback(() => {
    drawerRef.current?.showModal();
  }, []);

  const closeDrawer = useCallback(() => {
    const dialog = drawerRef.current;
    if (!dialog) return;
    dialog.classList.add('closing');
    dialog.addEventListener(
      'animationend',
      () => {
        dialog.classList.remove('closing');
        dialog.close();
      },
      { once: true }
    );
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-80 flex-col border-r border-border/40 bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-background/20 lg:flex">
          <Filters filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
        </aside>
        <main className="flex-1 overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
          <div className="flex items-center justify-between px-4 py-2 lg:hidden border-b border-border/40 bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-background/20">
            <Button variant="outline" size="sm" className="gap-2" onClick={openDrawer}>
              <SlidersHorizontal className="h-4 w-4" />
              筛选
            </Button>
          </div>
          <ChartSection filters={filters} selectedModel={selectedModel} onModelSelect={handleModelSelect} />
        </main>
      </div>

      <dialog ref={drawerRef} className="filter-drawer" onClick={(e) => { if (e.target === drawerRef.current) closeDrawer(); }}>
        <div className="flex h-full w-80 flex-col border-r border-border/40 bg-card/95 backdrop-blur-lg">
          <div className="flex items-center justify-between px-6 pt-5">
            <h2 className="text-lg font-semibold">筛选</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeDrawer}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Filters filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
        </div>
      </dialog>
    </div>
  );
}
