import { type FC, useState } from 'react';
import { type Improvement } from '@prisma/client';

interface MatrixControlsProps {
  improvements: Improvement[];
  onFilterChange?: (filters: MatrixFilters) => void;
  onViewOptionsChange?: (options: ViewOptions) => void;
  onReset?: () => void;
}

interface MatrixFilters {
  category?: string;
  effortLevel?: 'S' | 'M' | 'L';
}

interface ViewOptions {
  showLabels: boolean;
  showGrid: boolean;
  highlightRecommendations: boolean;
}

const defaultViewOptions: ViewOptions = {
  showLabels: true,
  showGrid: true,
  highlightRecommendations: true,
};

const MatrixControls: FC<MatrixControlsProps> = ({
  improvements,
  onFilterChange,
  onViewOptionsChange,
  onReset,
}) => {
  const [filters, setFilters] = useState<MatrixFilters>({});
  const [viewOptions, setViewOptions] = useState<ViewOptions>(defaultViewOptions);

  const handleFilterChange = (newFilters: Partial<MatrixFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleViewOptionsChange = (newOptions: Partial<ViewOptions>) => {
    const updatedOptions = { ...viewOptions, ...newOptions };
    setViewOptions(updatedOptions);
    onViewOptionsChange?.(updatedOptions);
  };

  const handleReset = () => {
    setFilters({});
    setViewOptions(defaultViewOptions);
    onReset?.();
  };

  // Get unique categories from improvements
  const categories = [...new Set(improvements.map(imp => imp.category))];

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="space-y-4">
        {/* Filters Section */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Filters</h3>
          <div className="space-y-2">
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filters.effortLevel || ''}
              onChange={(e) => handleFilterChange({ 
                effortLevel: e.target.value as 'S' | 'M' | 'L' | undefined 
              })}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">All Effort Levels</option>
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
            </select>
          </div>
        </div>

        {/* View Options Section */}
        <div>
          <h3 className="text-sm font-semibold mb-2">View Options</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={viewOptions.showLabels}
                onChange={(e) => handleViewOptionsChange({ showLabels: e.target.checked })}
                className="mr-2"
              />
              Show Labels
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={viewOptions.showGrid}
                onChange={(e) => handleViewOptionsChange({ showGrid: e.target.checked })}
                className="mr-2"
              />
              Show Grid
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={viewOptions.highlightRecommendations}
                onChange={(e) => handleViewOptionsChange({ 
                  highlightRecommendations: e.target.checked 
                })}
                className="mr-2"
              />
              Highlight Recommendations
            </label>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Reset View
        </button>
      </div>
    </div>
  );
};

export default MatrixControls;