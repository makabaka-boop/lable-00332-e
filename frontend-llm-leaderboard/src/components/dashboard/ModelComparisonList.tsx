"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModelData } from '@/app/page';
import { ArrowUpDown, ListX } from 'lucide-react';

type SortMode = 'value' | 'price' | 'score';

interface ModelComparisonListProps {
  data: ModelData[];
  selectedModel: ModelData | null;
  onModelSelect: (model: ModelData | null) => void;
}

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'value', label: '性价比' },
  { key: 'price', label: '价格' },
  { key: 'score', label: '评分' },
];

const FAMILY_COLORS: Record<string, string> = {
  'GPT-4': 'var(--chart-1)',
  'Claude 3': 'var(--chart-2)',
  'Llama 3': 'var(--chart-3)',
  'Gemini': 'var(--chart-4)',
  'Mistral': 'var(--chart-5)',
};

export function ModelComparisonList({ data, selectedModel, onModelSelect }: ModelComparisonListProps) {
  const [sortMode, setSortMode] = useState<SortMode>('value');

  const sortedData = useMemo(() => {
    const enriched = data.map(item => ({
      ...item,
      valueRatio: parseFloat((item.score / item.price).toFixed(1)),
    }));

    const sorted = [...enriched].sort((a, b) => {
      switch (sortMode) {
        case 'price':
          return a.price - b.price;
        case 'score':
          return b.score - a.score;
        case 'value':
        default:
          return b.valueRatio - a.valueRatio;
      }
    });

    return sorted;
  }, [data, sortMode]);

  const handleRowClick = (model: ModelData) => {
    onModelSelect(model);
  };

  if (sortedData.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ListX className="h-10 w-10 mb-3 opacity-50" />
          <p className="text-sm">暂无符合条件的模型，请调整筛选条件</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium">模型对比清单</CardTitle>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          {SORT_OPTIONS.map(opt => (
            <Button
              key={opt.key}
              variant={sortMode === opt.key ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setSortMode(opt.key)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 text-muted-foreground text-xs">
                <th className="text-left font-medium py-2.5 px-4">模型名称</th>
                <th className="text-left font-medium py-2.5 px-4">系列</th>
                <th className="text-center font-medium py-2.5 px-4">类型</th>
                <th className="text-right font-medium py-2.5 px-4">价格($/百万tokens)</th>
                <th className="text-right font-medium py-2.5 px-4">评分</th>
                <th className="text-right font-medium py-2.5 px-4">性价比</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => {
                const isSelected = selectedModel?.name === item.name;
                return (
                  <tr
                    key={item.name}
                    onClick={() => handleRowClick(item)}
                    className={`
                      cursor-pointer border-b border-border/20 transition-colors
                      ${isSelected
                        ? 'bg-primary/15 ring-1 ring-primary/30'
                        : 'hover:bg-muted/50'
                      }
                    `}
                  >
                    <td className="py-2.5 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: FAMILY_COLORS[item.family] || 'var(--primary)' }}
                        />
                        {item.name}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground">{item.family}</td>
                    <td className="py-2.5 px-4 text-center">
                      <Badge
                        variant={item.type === '开源' ? 'secondary' : 'default'}
                        className="text-[10px] h-5"
                      >
                        {item.type}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums">${item.price}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">{item.score}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-medium text-primary">
                      {item.valueRatio}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
