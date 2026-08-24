import React from 'react';
import { Recipe } from '../types';
import { Clock, Flame, Star, Heart, Bookmark, Eye, Layers } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  isBookmarked: boolean;
  isLiked: boolean;
  isCompared: boolean;
  onToggleBookmark: (e: React.MouseEvent, id: string) => void;
  onToggleLike: (e: React.MouseEvent, id: string) => void;
  onToggleCompare: (e: React.MouseEvent, id: string) => void;
  onClickCard: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isBookmarked,
  isLiked,
  isCompared,
  onToggleBookmark,
  onToggleLike,
  onToggleCompare,
  onClickCard,
}) => {
  return (
    <div
      id={`recipe-card-${recipe.id}`}
      onClick={() => onClickCard(recipe)}
      className="group bg-white rounded-2xl overflow-hidden border border-[#e9ecef] shadow-[0_4px_15px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col relative"
    >
      {/* Thumbnail Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges (Category & Difficulty) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#ff6b6b] text-white shadow-sm">
            {recipe.categoryLabel}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold text-white shadow-sm ${
            recipe.difficulty === '쉬움' ? 'bg-[#4ecdc4]' : recipe.difficulty === '보통' ? 'bg-amber-500' : 'bg-red-600'
          }`}>
            {recipe.difficulty}
          </span>
        </div>

        {/* Action Buttons Overlay (Bookmark & Compare) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {/* Compare Checkbox Button */}
          <button
            id={`compare-toggle-${recipe.id}`}
            onClick={(e) => onToggleCompare(e, recipe.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
              isCompared 
                ? 'bg-[#4ecdc4] text-white' 
                : 'bg-black/30 hover:bg-black/50 text-white'
            }`}
            title="레시피 비교함 담기"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          <button
            id={`bookmark-toggle-${recipe.id}`}
            onClick={(e) => onToggleBookmark(e, recipe.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
              isBookmarked 
                ? 'bg-[#ff6b6b] text-white' 
                : 'bg-black/30 hover:bg-black/50 text-white'
            }`}
            title="스크랩 / 북마크"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Time & Calorie Overlay Gradient */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pt-6 flex items-center justify-between text-white text-xs font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#4ecdc4]" />
            <span>{recipe.cookTime}분</span>
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#ff6b6b]" />
            <span>{recipe.calories} kcal</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {recipe.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-[#2f3542] group-hover:text-[#ff6b6b] transition-colors line-clamp-2 leading-snug mb-1">
            {recipe.title}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-gray-500 line-clamp-1 mb-3">
            {recipe.subtitle}
          </p>
        </div>

        {/* Card Footer: Author & Rating & Likes */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2">
            <img
              src={recipe.author.avatar}
              alt={recipe.author.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs font-medium text-gray-700 truncate max-w-[90px]">
              {recipe.author.name}
            </span>
          </div>

          {/* Rating & Likes */}
          <div className="flex items-center gap-2.5 text-xs text-gray-600">
            <div className="flex items-center gap-0.5 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{recipe.rating.toFixed(1)}</span>
              <span className="text-[10px] text-gray-400 font-normal">({recipe.reviewCount})</span>
            </div>

            {/* Like Counter Button */}
            <button
              id={`like-btn-${recipe.id}`}
              onClick={(e) => onToggleLike(e, recipe.id)}
              className={`flex items-center gap-0.5 hover:text-[#ff6b6b] transition-colors ${
                isLiked ? 'text-[#ff6b6b] font-bold' : 'text-gray-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#ff6b6b] text-[#ff6b6b]' : ''}`} />
              <span className="text-xs">{recipe.likesCount + (isLiked ? 1 : 0)}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
