"use client"

import { useMemo, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FilterState, ModelData } from '@/app/page';
import { ModelComparisonList } from '@/components/dashboard/ModelComparisonList';
import { CheckCircle2 } from 'lucide-react';

const allData = [
  { name: 'GPT-4o', price: 15, score: 88.7, family: 'GPT-4', type: '专有' },
  { name: 'Claude 3.5 Sonnet', price: 6, score: 88.3, family: 'Claude 3', type: '专有' },
  { name: 'GPT-4 Turbo', price: 20, score: 86.5, family: 'GPT-4', type: '专有' },
  { name: 'Llama 3 70B', price: 0.8, score: 82.0, family: 'Llama 3', type: '开源' },
  { name: 'Gemini 1.5 Pro', price: 7, score: 85.9, family: 'Gemini', type: '专有' },
  { name: 'Mistral Large', price: 8, score: 84.0, family: 'Mistral', type: '专有' },
  { name: 'Llama 3 8B', price: 0.1, score: 68.0, family: 'Llama 3', type: '开源' },
  { name: 'Claude 3 Haiku', price: 0.5, score: 75.2, family: 'Claude 3', type: '专有' },
  { name: 'GPT-3.5 Turbo', price: 1.0, score: 70.0, family: 'GPT-4', type: '专有' },
  { name: 'Mixtral 8x22B', price: 1.2, score: 77.8, family: 'Mistral', type: '开源' },
];

const FAMILY_COLORS: Record<string, string> = {
  'GPT-4': 'var(--chart-1)',
  'Claude 3': 'var(--chart-2)',
  'Llama 3': 'var(--chart-3)',
  'Gemini': 'var(--chart-4)',
  'Mistral': 'var(--chart-5)',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-border/50 bg-background/95 p-3 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 mb-2">
            <p className="font-semibold text-foreground">{data.name}</p>
            <Badge variant={data.type === '开源' ? 'secondary' : 'default'} className="text-[10px] h-5">
                {data.type}
            </Badge>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">评分：</span> {data.score}
          </p>
          <p>
            <span className="font-medium text-foreground">价格：</span> ${data.price}/百万 tokens
          </p>
          <p>
            <span className="font-medium text-foreground">系列：</span> {data.family}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

interface ChartSectionProps {
  filters: FilterState;
  selectedModel: ModelData | null;
  onModelSelect: (model: ModelData | null) => void;
}

export function ChartSection({ filters, selectedModel, onModelSelect }: ChartSectionProps) {
  const filteredData = useMemo(() => {
    if (!filters) {
      return allData;
    }

    return allData.filter(item => {
      // Filter by family
      if (filters.selectedFamilies && typeof filters.selectedFamilies.has === 'function') {
        if (!filters.selectedFamilies.has(item.family)) {
          return false;
        }
      }

      // Filter by price
      if (item.price > filters.maxPrice) {
        return false;
      }

      // Filter by open source
      if (filters.openSourceOnly && item.type !== '开源') {
        return false;
      }

      return true;
    });
  }, [filters]);

  useEffect(() => {
    if (selectedModel && !filteredData.some(d => d.name === selectedModel.name)) {
      onModelSelect(null);
    }
  }, [filteredData, selectedModel, onModelSelect]);

  const stats = useMemo(() => {
    const totalModels = filteredData.length;
    const avgPerformance = totalModels > 0 
      ? (filteredData.reduce((sum, item) => sum + item.score, 0) / totalModels).toFixed(1)
      : '0';
    const bestValue = filteredData.length > 0
      ? filteredData.reduce((best, item) => 
          (item.score / item.price) > (best.score / best.price) ? item : best
        ).family
      : 'N/A';
    const topPerformer = filteredData.length > 0
      ? filteredData.reduce((best, item) => item.score > best.score ? item : best).name
      : 'N/A';

    return { totalModels, avgPerformance, bestValue, topPerformer };
  }, [filteredData]);

  return (
    <div className="h-full w-full space-y-4 p-6 overflow-y-auto">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总模型数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalModels}</div>
            <p className="text-xs text-muted-foreground">已筛选</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均性能</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgPerformance}</div>
            <p className="text-xs text-muted-foreground">已筛选数据</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">最佳性价比</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bestValue}</div>
            <p className="text-xs text-muted-foreground">最高分数/价格比</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">最佳性能</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topPerformer}</div>
            <p className="text-xs text-muted-foreground">最高评分</p>
          </CardContent>
        </Card>
        <Card className={`bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-200 ${selectedModel ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border/50 opacity-60'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              当前选中
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedModel ? (
              <>
                <div className="text-lg font-bold truncate" title={selectedModel.name}>{selectedModel.name}</div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span>${selectedModel.price}/百万</span>
                  <span>评分 {selectedModel.score}</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-lg font-bold text-muted-foreground">--</div>
                <p className="text-xs text-muted-foreground">点击下方模型选中</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="h-[420px] w-full border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardDescription>
            比较 MMLU 评分与每百万 tokens 的成本（混合输入/输出）。
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[320px]">
          {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  type="number" 
                  dataKey="price" 
                  name="价格" 
                  unit="$" 
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: '每百万 Tokens 价格 ($)', position: 'insideBottom', offset: -10, fill: 'var(--muted-foreground)', fontSize: 12 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="score" 
                  name="评分" 
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[60, 95]}
                  label={{ value: '性能评分', angle: -90, position: 'insideLeft', fill: 'var(--muted-foreground)', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="模型" data={filteredData}>
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={FAMILY_COLORS[entry.family] || 'var(--primary)'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              没有符合条件的模型
            </div>
          )}
        </CardContent>
      </Card>

      <ModelComparisonList
        data={filteredData}
        selectedModel={selectedModel}
        onModelSelect={onModelSelect}
      />
    </div>
  );
}
