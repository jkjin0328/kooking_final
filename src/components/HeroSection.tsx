import React from 'react';
import { Search, Sparkles, Refrigerator, ChefHat, Flame, Clock, Award } from 'lucide-react';
import { Language } from '../types';
import { I18N_DICTIONARY } from '../locales/i18n';

interface HeroSectionProps {
  lang?: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onOpenFridge?: () => void;
  onOpenFridgeModal?: () => void;
  onOpenAIChat?: () => void;
  onOpenAiChat?: () => void;
  onOpenCreateRecipe?: () => void;
  onSelectKeyword?: (kw: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang = 'ko',
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenFridge,
  onOpenFridgeModal,
  onOpenAIChat,
  onOpenAiChat,
  onOpenCreateRecipe,
  onSelectKeyword,
}) => {
  const t = I18N_DICTIONARY[lang || 'ko'] || I18N_DICTIONARY.ko;
  const handleFridgeClick = onOpenFridge || onOpenFridgeModal;
  const handleAiChatClick = onOpenAIChat || onOpenAiChat;
  const handleKeywordSelect = (kw: string) => {
    onSearchChange(kw);
    if (onSelectKeyword) onSelectKeyword(kw);
  };

  const POPULAR_KEYWORDS = [
    { label: '🔥 김치찌개', value: '김치찌개' },
    { label: '🍝 크림 파스타', value: '파스타' },
    { label: '🥩 소불고기 덮밥', value: '소불고기' },
    { label: '🥑 연어 샐러드', value: '연어' },
    { label: '🥓 에어프라이어 통삼겹', value: '통삼겹' },
    { label: '🍤 쉬림프 팟타이', value: '팟타이' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff5f5] via-white to-[#f8f9fa] py-10 sm:py-16 border-b border-[#e9ecef]">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#ff6b6b]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#4ecdc4]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e9ecef] shadow-sm mb-5 animate-bounce-subtle">
          <ChefHat className="w-4 h-4 text-[#ff6b6b]" />
          <span className="text-xs sm:text-sm font-semibold text-[#2f3542]">
            누적 50만+ 레시피 & 스마트 AI 셰프 탑재
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2f3542] tracking-tight leading-tight sm:leading-snug mb-4">
          오늘 냉장고 속 재료로 <br className="hidden sm:inline" />
          <span className="text-[#ff6b6b] underline decoration-[#ff6b6b]/30 decoration-wavy">
            맛있는 요리
          </span>
          를 시작해보세요!
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8 font-normal">
          {t.heroSubtitle}
        </p>

        {/* Main Search Bar Box */}
        <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#e9ecef] flex flex-col sm:flex-row items-center gap-2 mb-6">
          <div className="relative w-full flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              id="hero-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3 text-sm sm:text-base bg-transparent focus:outline-none text-[#2f3542] placeholder-gray-400"
            />
          </div>
          <button
            id="hero-search-submit-btn"
            onClick={onSearchSubmit}
            className="w-full sm:w-auto px-6 py-3 bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-bold rounded-xl sm:rounded-2xl transition-all shadow-md shadow-[#ff6b6b]/20 flex items-center justify-center gap-2 text-sm sm:text-base flex-shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{t.searchBtn}</span>
          </button>
        </div>

        {/* Popular Keywords Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#ff6b6b]" /> 실시간 인기:
          </span>
          {POPULAR_KEYWORDS.map((kw) => (
            <button
              key={kw.value}
              onClick={() => handleKeywordSelect(kw.value)}
              className="px-3 py-1 text-xs font-medium bg-white hover:bg-[#ff6b6b]/10 hover:text-[#ff6b6b] text-gray-700 rounded-full border border-[#e9ecef] transition-all shadow-2xs"
            >
              {kw.label}
            </button>
          ))}
        </div>

        {/* Interactive Feature Hero Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          
          {/* Fridge Match CTA */}
          <div
            id="hero-fridge-cta"
            onClick={handleFridgeClick}
            className="bg-white p-4 rounded-2xl border border-[#e9ecef] shadow-sm hover:shadow-md hover:border-[#4ecdc4] cursor-pointer transition-all text-left flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#4ecdc4]/15 flex items-center justify-center text-[#20a39a] group-hover:scale-110 transition-transform">
              <Refrigerator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#2f3542] flex items-center gap-1">
                <span>냉장고 파먹기 매칭</span>
                <span className="text-[10px] bg-[#4ecdc4] text-white px-1.5 py-0.5 rounded font-bold">MATCH</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                남은 재료를 선택하면 만들 수 있는 요리를 바로 찾아드려요
              </p>
            </div>
          </div>

          {/* AI Chef CTA */}
          <div
            id="hero-ai-cta"
            onClick={handleAiChatClick}
            className="bg-white p-4 rounded-2xl border border-[#e9ecef] shadow-sm hover:shadow-md hover:border-purple-300 cursor-pointer transition-all text-left flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#2f3542] flex items-center gap-1">
                <span>스마트 AI 셰프 챗봇</span>
                <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-bold">AI 3.7</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                식단, 칼로리, 시간 맞춤형 1:1 레시피 상담을 받아보세요
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
