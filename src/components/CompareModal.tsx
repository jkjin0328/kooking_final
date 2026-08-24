import React from 'react';
import { X, Layers, Clock, Flame, Star, Users, Trash2, ArrowRight, ChefHat } from 'lucide-react';
import { Recipe, Language } from '../types';
import { I18N_DICTIONARY } from '../locales/i18n';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedRecipes: Recipe[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  lang?: Language;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  comparedRecipes,
  onRemoveFromCompare,
  onClearCompare,
  onSelectRecipe,
  lang = 'ko',
}) => {
  if (!isOpen) return null;

  const t = I18N_DICTIONARY[lang || 'ko'] || I18N_DICTIONARY.ko;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#e9ecef] animate-scale-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4ecdc4]/15 via-white to-purple-50 px-6 py-4 border-b border-[#e9ecef] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#4ecdc4] text-white flex items-center justify-center shadow-md shadow-[#4ecdc4]/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#2f3542] flex items-center gap-2">
                <span>{t.compareView}</span>
                <span className="text-xs bg-[#4ecdc4] text-white px-2 py-0.5 rounded-full font-bold">
                  {comparedRecipes.length}개 비교 중
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                칼로리, 조리 시간, 난이도, 영양 성분 및 예상 재료비를 한눈에 비교해보세요.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedRecipes.length > 0 && (
              <button
                onClick={onClearCompare}
                className="text-xs text-red-500 hover:underline font-semibold mr-2"
              >
                전체 비우기
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Matrix Table */}
        <div className="p-6 max-h-[75vh] overflow-x-auto overflow-y-auto">
          {comparedRecipes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Layers className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold">비교할 레시피가 선택되지 않았습니다.</p>
              <p className="text-xs mt-1">레시피 카드의 레이어 아이콘을 눌러 비교함에 담아보세요.</p>
            </div>
          ) : (
            <div className="min-w-[600px]">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 font-bold text-gray-400 w-36">항목</th>
                    {comparedRecipes.map((r) => (
                      <th key={r.id} className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <img
                            src={r.imageUrl}
                            alt={r.title}
                            className="w-20 h-20 rounded-2xl object-cover mb-2 shadow-sm border border-gray-200"
                          />
                          <h4 className="font-bold text-[#2f3542] text-xs line-clamp-2 max-w-[150px] mb-1">
                            {r.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                onClose();
                                onSelectRecipe(r);
                              }}
                              className="px-2 py-1 bg-[#ff6b6b] text-white text-[10px] font-bold rounded-md hover:bg-[#ff5252]"
                            >
                              상세보기
                            </button>
                            <button
                              onClick={() => onRemoveFromCompare(r.id)}
                              className="p-1 text-gray-400 hover:text-red-500"
                              title="비교 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-600 bg-gray-50/70">카테고리 / 난이도</td>
                    {comparedRecipes.map((r) => (
                      <td key={r.id} className="py-3 px-4 text-center">
                        <span className="font-semibold text-gray-800">{r.categoryLabel}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className={`font-bold ${r.difficulty === '쉬움' ? 'text-[#4ecdc4]' : 'text-amber-500'}`}>
                          {r.difficulty}
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-600 bg-gray-50/70">조리 시간 / 준비</td>
                    {comparedRecipes.map((r) => (
                      <td key={r.id} className="py-3 px-4 text-center font-bold text-[#ff6b6b]">
                        ⏱️ {r.cookTime}분 (준비 {r.prepTime}분)
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-600 bg-gray-50/70">칼로리 (1인분)</td>
                    {comparedRecipes.map((r) => (
                      <td key={r.id} className="py-3 px-4 text-center font-bold text-amber-600">
                        🔥 {r.calories} kcal
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-600 bg-gray-50/70">3대 영양소 (탄/단/지)</td>
                    {comparedRecipes.map((r) => (
                      <td key={r.id} className="py-3 px-4 text-center text-xs">
                        <span className="text-[#4ecdc4] font-bold">탄 {r.nutrition.carbs}g</span> /{' '}
                        <span className="text-[#ff6b6b] font-bold">단 {r.nutrition.protein}g</span> /{' '}
                        <span className="text-amber-500 font-bold">지 {r.nutrition.fat}g</span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-600 bg-gray-50/70">필요 재료 가짓수</td>
                    {comparedRecipes.map((r) => (
                      <td key={r.id} className="py-3 px-4 text-center font-semibold text-gray-800">
                        {r.ingredients.length}가지 재료
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-600 bg-gray-50/70">예상 밀키트 금액</td>
                    {comparedRecipes.map((r) => (
                      <td key={r.id} className="py-3 px-4 text-center font-black text-[#2f3542]">
                        {r.mealkitPrice ? `${r.mealkitPrice.toLocaleString()}원` : '15,000원'}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-600 bg-gray-50/70">평점 및 후기</td>
                    {comparedRecipes.map((r) => (
                      <td key={r.id} className="py-3 px-4 text-center font-bold text-amber-500">
                        ⭐ {r.rating.toFixed(1)} ({r.reviewCount}개 후기)
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
