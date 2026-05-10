import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { RotateCcw, Filter } from 'lucide-react';
import { FilterState } from '@/app/page';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
}

const FAMILIES = ['GPT-4', 'Claude 3', 'Llama 3', 'Gemini', 'Mistral'];

// 模型数据中包含开源信息的映射
const FAMILY_OPEN_SOURCE_MAP: Record<string, boolean> = {
  'GPT-4': false,
  'Claude 3': false,
  'Llama 3': true,
  'Gemini': false,
  'Mistral': true,
};

export function Filters({ filters, onFilterChange, onReset }: FiltersProps) {
  const handleFamilyToggle = (family: string) => {
    const newFamilies = new Set(filters.selectedFamilies);
    if (newFamilies.has(family)) {
      newFamilies.delete(family);
    } else {
      newFamilies.add(family);
    }
    onFilterChange({ selectedFamilies: newFamilies });
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ maxPrice: value[0] });
  };

  const handleOpenSourceToggle = (checked: boolean) => {
    // 当选中"仅开源"时，取消非开源系列的选中状态
    if (checked) {
      const openSourceFamilies = new Set(
        FAMILIES.filter(family => FAMILY_OPEN_SOURCE_MAP[family])
      );
      onFilterChange({ 
        openSourceOnly: checked,
        selectedFamilies: openSourceFamilies
      });
    } else {
      // 取消"仅开源"时，恢复所有系列
      onFilterChange({ 
        openSourceOnly: checked,
        selectedFamilies: new Set(FAMILIES)
      });
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Filter className="h-4 w-4" />
          筛选
        </h2>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={onReset}>
          <RotateCcw className="mr-1 h-3 w-3" />
          重置
        </Button>
      </div>

      <div className="space-y-6">
        {/* Model Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">模型系列</Label>
          <div className="space-y-2">
            {FAMILIES.map((family) => (
              <div key={family} className="flex items-center space-x-2">
                <Checkbox 
                  id={`family-${family}`}
                  checked={filters.selectedFamilies.has(family)}
                  onCheckedChange={() => handleFamilyToggle(family)}
                  disabled={filters.openSourceOnly && !FAMILY_OPEN_SOURCE_MAP[family]}
                />
                <Label 
                  htmlFor={`family-${family}`} 
                  className={`text-sm font-normal cursor-pointer ${
                    filters.openSourceOnly && !FAMILY_OPEN_SOURCE_MAP[family]
                      ? 'text-muted-foreground/50'
                      : 'text-muted-foreground'
                  }`}
                >
                  {family}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">最高价格（每百万 tokens）</Label>
            <span className="text-xs text-muted-foreground">${filters.maxPrice}</span>
          </div>
          <Slider 
            value={[filters.maxPrice]} 
            onValueChange={handlePriceChange}
            max={50} 
            step={1} 
            className="py-2" 
          />
        </div>

        {/* Toggles */}
        <div className="space-y-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <Label htmlFor="open-source" className="flex flex-col gap-1">
              <span>仅开源</span>
              <span className="text-xs font-normal text-muted-foreground">仅显示开源权重模型</span>
            </Label>
            <Switch 
              id="open-source"
              checked={filters.openSourceOnly}
              onCheckedChange={handleOpenSourceToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
