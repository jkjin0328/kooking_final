import React, { useState } from 'react';
import { X, Refrigerator, Plus, Trash2, Camera, Sparkles, Check, ChevronRight, AlertCircle } from 'lucide-react';
import { Recipe, Language } from '../types';
import { I18N_DICTIONARY } from '../locales/i18n';

interface FridgeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  lang?: Language;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const FridgeSearchModal: React.FC<FridgeSearchModalProps> = ({
  isOpen,
  onClose,
  recipes,
  lang = 'ko',
  onSelectRecipe,
}) => {
  if (!isOpen) return null;

  const t = I18N_DICTIONARY[lang || 'ko'] || I18N_DICTIONARY.ko;

  // Default suggested ingredients chips
  const POPULAR_INGREDIENTS = [
    '묵은지', '돼지고기', '대파', '계란', '양파', '두부', '마늘', '베이컨', 
    '생크림', '소고기', '연어', '아보카도', '통삼겹살', '새우', '쌀국수면', '파스타면'
  ];

  const [fridgeItems, setFridgeItems] = useState<string[]>(['묵은지', '돼지고기', '대파', '계란']);
  const [customInput, setCustomInput] = useState<string>('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [visionAnalysisDone, setVisionAnalysisDone] = useState<boolean>(false);

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !fridgeItems.includes(trimmed)) {
      setFridgeItems([...fridgeItems, trimmed]);
      setCustomInput('');
    }
  };

  const handleToggleItem = (item: string) => {
    if (fridgeItems.includes(item)) {
      setFridgeItems(fridgeItems.filter((i) => i !== item));
    } else {
      setFridgeItems([...fridgeItems, item]);
    }
  };

  const handleRemoveItem = (item: string) => {
    setFridgeItems(fridgeItems.filter((i) => i !== item));
  };

  // AI Vision simulator
  const handleSimulateVisionAI = () => {
    setIsAnalyzingImage(true);
    setVisionAnalysisDone(false);
    setTimeout(() => {
      const detected = ['계란', '양파', '대파', '스팸', '묵은지'];
      setFridgeItems(Array.from(new Set([...fridgeItems, ...detected])));
      setIsAnalyzingImage(false);
      setVisionAnalysisDone(true);
    }, 1200);
  };

  // Calculate matching percentage for each recipe
  const recipeMatches = recipes.map((recipe) => {
    const totalIngredients = recipe.ingredients.length;
    const possessed = recipe.ingredients.filter((ing) =>
      fridgeItems.some((f) => ing.name.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(ing.name.toLowerCase()))
    );
    const missing = recipe.ingredients.filter((ing) => !possessed.includes(ing));
    const matchPercentage = Math.round((possessed.length / totalIngredients) * 100);

    return {
      recipe,
      matchPercentage,
      possessed,
      missing,
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#e9ecef] animate-scale-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4ecdc4]/15 via-white to-[#ff6b6b]/10 px-6 py-5 border-b border-[#e9ecef] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4ecdc4] text-white flex items-center justify-center shadow-md shadow-[#4ecdc4]/30">
              <Refrigerator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#2f3542] flex items-center gap-2">
                <span>냉장고 파먹기 매칭 엔진</span>
                <span className="text-[10px] bg-[#4ecdc4] text-white px-2 py-0.5 rounded-full font-bold">
                  AI MATCH
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                보유한 재료를 선택하면 만들 수 있는 최적의 레시피를 매칭률(%) 순으로 찾아드립니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* AI Vision Photo Scan Banner */}
          <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#e9ecef] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#2f3542]">
                  AI 냉장고 사진 자동 인식
                </h4>
                <p className="text-[11px] text-gray-500">
                  냉장고 사진을 찍으면 Vision AI가 식재료를 자동으로 추출합니다.
                </p>
              </div>
            </div>
            <button
              onClick={handleSimulateVisionAI}
              disabled={isAnalyzingImage}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all whitespace-nowrap disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAnalyzingImage ? 'Vision AI 분석 중...' : '사진으로 자동인식'}</span>
            </button>
          </div>

          {visionAnalysisDone && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Vision AI가 계란, 양파, 대파, 묵은지 등 5가지 재료를 성공적으로 식별하여 추가했습니다!</span>
            </div>
          )}

          {/* Current Fridge Items Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700">
                현재 내 냉장고 재료 ({fridgeItems.length}개):
              </span>
              {fridgeItems.length > 0 && (
                <button
                  onClick={() => setFridgeItems([])}
                  className="text-[11px] text-red-500 hover:underline font-medium"
                >
                  전체 비우기
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 min-h-[42px] p-3 bg-gray-50 rounded-2xl border border-gray-200">
              {fridgeItems.length === 0 ? (
                <span className="text-xs text-gray-400 py-1">
                  선택된 재료가 없습니다. 아래 추천 재료를 클릭하거나 직접 입력하세요.
                </span>
              ) : (
                fridgeItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#4ecdc4]/60 text-[#20a39a] text-xs font-bold rounded-full shadow-2xs animate-scale-up"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Add Custom Ingredient Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              placeholder="직접 재료 입력 (예: 감자, 굴소스, 스팸)"
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-[#e9ecef] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#4ecdc4] text-[#2f3542]"
            />
            <button
              onClick={handleAddCustom}
              className="px-4 py-2.5 bg-[#4ecdc4] hover:bg-[#3db8af] text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>추가</span>
            </button>
          </div>

          {/* Suggested Ingredient Buttons */}
          <div>
            <span className="text-xs font-bold text-gray-500 block mb-2">
              자주 쓰는 재료 빠른 선택:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_INGREDIENTS.map((item) => {
                const isSelected = fridgeItems.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => handleToggleItem(item)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#4ecdc4] border-[#4ecdc4] text-white shadow-2xs'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {isSelected ? `✓ ${item}` : `+ ${item}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matched Recipes Results List */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-bold text-[#2f3542] mb-3 flex items-center justify-between">
              <span>추천 요리 매칭 결과 ({recipeMatches.length}건)</span>
              <span className="text-xs text-gray-400 font-normal">매칭률 높은 순</span>
            </h3>

            <div className="space-y-3">
              {recipeMatches.map(({ recipe, matchPercentage, possessed, missing }) => (
                <div
                  key={recipe.id}
                  onClick={() => {
                    onClose();
                    onSelectRecipe(recipe);
                  }}
                  className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#ff6b6b] hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#2f3542] group-hover:text-[#ff6b6b] transition-colors">
                          {recipe.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {recipe.subtitle}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                        <span className="text-emerald-600 font-semibold">
                          보유: {possessed.map((p) => p.name).join(', ') || '없음'}
                        </span>
                        {missing.length > 0 && (
                          <span className="text-red-400 font-medium">
                            (부족: {missing.slice(0, 2).map((m) => m.name).join(', ')}
                            {missing.length > 2 ? ` 외 ${missing.length - 2}개` : ''})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Percentage Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-lg font-black ${
                        matchPercentage >= 70 ? 'text-[#ff6b6b]' : matchPercentage >= 40 ? 'text-amber-500' : 'text-gray-400'
                      }`}>
                        {matchPercentage}%
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">매칭</span>
                    </div>
                    <span className="text-xs font-bold text-gray-700 group-hover:text-[#ff6b6b] flex items-center gap-1">
                      <span>조리법 보기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
