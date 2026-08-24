import React from 'react';
import { Recipe } from '../types';
import { Utensils, Sparkles, Flame, Clock, Heart, SlidersHorizontal } from 'lucide-react';

interface CategoryTagsProps {
  activeCategory: string;
  onSelectCategory: (cat: any) => void;
  sortBy: 'popular' | 'latest' | 'rating' | 'time';
  onSelectSortBy: (sort: 'popular' | 'latest' | 'rating' | 'time') => void;
  recipesCount: number;
}

export const CategoryTags: React.FC<CategoryTagsProps> = ({
  activeCategory,
  onSelectCategory,
  sortBy,
  onSelectSortBy,
  recipesCount,
}) => {
  const CATEGORIES = [
    { id: 'all', label: '전체', icon: '🍽️' },
    { id: 'korean', label: '한식', icon: '🍲' },
    { id: 'western', label: '양식', icon: '🍝' },
    { id: 'asian', label: '일식/아시안', icon: '🍣' },
    { id: 'diet', label: '다이어트/건강식', icon: '🥑' },
    { id: 'airfryer', label: '에어프라이어', icon: '🥓' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`category-tag-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-2xs ${
                  isActive
                    ? 'bg-[#ff6b6b] text-white shadow-md shadow-[#ff6b6b]/25 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#e9ecef]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Controls & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs sm:text-sm text-gray-500">
          <span className="font-medium">
            총 <strong className="text-[#ff6b6b] font-bold">{recipesCount}</strong>개 레시피
          </span>
          <div className="flex items-center gap-1 bg-white border border-[#e9ecef] rounded-xl p-1 shadow-2xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 ml-1.5" />
            <select
              id="recipe-sort-select"
              value={sortBy}
              onChange={(e) => onSelectSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-[#2f3542] focus:outline-none pr-2 py-1 cursor-pointer"
            >
              <option value="popular">🔥 인기순</option>
              <option value="latest">✨ 최신순</option>
              <option value="rating">⭐ 평점순</option>
              <option value="time">⏱️ 조리시간 빠른순</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};
