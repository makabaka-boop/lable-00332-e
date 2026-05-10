"use client"

import { useState, useMemo, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterState } from '@/app/page';

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

type SortOption = 'value-desc' | 'price-asc' | 'score-desc';

interface ChartSectionProps {
  filters: FilterState;
}

export function ChartSection({ filters }: ChartSectionProps) {
  const [sortOption, setSortOption] = useState<SortOption>('value-desc');
  const [selectedModelName, setSelectedModelName] = useState<string | null>(null);

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

  const stats = useMemo(() => {
    const totalModels = filteredData.length;
    const avgPerformance = totalModels > 0 
      ? (filteredData.reduce((sum, item) => sum + item.score, 0) / totalModels).toFixed(1)
      : '0';
    const bestValue = filteredData.length > 0
      ? filteredData.reduce((best, item) => 
          (item.score / item.price) > (best.score / best.price) ? item : best
        ).name
      : 'N/A';
    const topPerformer = filteredData.length > 0
      ? filteredData.reduce((best, item) => item.score > best.score ? item : best).name
      : 'N/A';

    return { totalModels, avgPerformance, bestValue, topPerformer };
  }, [filteredData]);

  const sortedData = useMemo(() => {
    const dataWithValue = filteredData.map(item => ({
      ...item,
      value: Number((item.score / item.price).toFixed(1)),
    }));

    switch (sortOption) {
      case 'price-asc':
        return [...dataWithValue].sort((a, b) => a.price - b.price);
      case 'score-desc':
        return [...dataWithValue].sort((a, b) => b.score - a.score);
      case 'value-desc':
      default:
        return [...dataWithValue].sort((a, b) => b.value - a.value);
    }
  }, [filteredData, sortOption]);

  const selectedModel = useMemo(() => {
    if (!selectedModelName) return null;
    return sortedData.find(item => item.name === selectedModelName) || null;
  }, [sortedData, selectedModelName]);

  useEffect(() => {
    if (selectedModelName) {
      const exists = filteredData.some(item => item.name === selectedModelName);
      if (!exists) {
        setSelectedModelName(null);
      }
    }
  }, [filteredData, selectedModelName]);

  const handleSelectModel = (name: string) => {
    if (selectedModelName === name) {
      setSelectedModelName(null);
    } else {
      setSelectedModelName(name);
    }
  };

  return (
    <div className="h-full w-full space-y-4 p-6 overflow-y-auto">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
        <Card className={`bg-card/50 backdrop-blur-sm border-border/50 shadow-sm ${selectedModel ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">当前选中模型</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {selectedModel ? selectedModel.name : '未选择'}
            </div>
            {selectedModel ? (
              <p className="text-xs text-muted-foreground">
                ${selectedModel.price}/百万 · {selectedModel.score}分
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">点击下方列表选择</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="h-[500px] w-full border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardDescription>
            比较 MMLU 评分与每百万 tokens 的成本（混合输入/输出）。
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
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

      <Card className="w-full border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg">模型对比清单</CardTitle>
            <CardDescription>
              查看筛选后的候选模型，点击选择进行对比
            </CardDescription>
          </div>
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value-desc">性价比从高到低</SelectItem>
              <SelectItem value="price-asc">价格从低到高</SelectItem>
              <SelectItem value="score-desc">评分从高到低</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {sortedData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">模型名称</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">系列</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">类型</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">价格</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">性能评分</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">性价比</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((item) => (
                    <tr
                      key={item.name}
                      onClick={() => handleSelectModel(item.name)}
                      className={`border-b border-border/30 cursor-pointer transition-colors ${
                        selectedModelName === item.name
                          ? 'bg-primary/10 hover:bg-primary/15'
                          : 'hover:bg-accent/50'
                      }`}
                    >
                      <td className="py-3 px-2">
                        <span className="font-medium">{item.name}</span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">{item.family}</td>
                      <td className="py-3 px-2">
                        <Badge variant={item.type === '开源' ? 'secondary' : 'default'} className="text-[10px] h-5">
                          {item.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right">${item.price}/百万</td>
                      <td className="py-3 px-2 text-right font-medium">{item.score}</td>
                      <td className="py-3 px-2 text-right">
                        <span className="text-primary font-semibold">{item.value}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              暂无符合条件的模型，请调整筛选条件
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
