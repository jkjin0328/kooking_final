import React, { useState } from 'react';
import { 
  Utensils, 
  Search, 
  Refrigerator, 
  BookOpen, 
  Radio, 
  Server, 
  PlusCircle, 
  ShoppingCart, 
  Bookmark, 
  User as UserIcon, 
  Globe, 
  Wifi, 
  WifiOff,
  LogOut,
  Sparkles,
  Layers
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { I18N_DICTIONARY } from '../locales/i18n';

interface NavbarProps {
  activeTab?: 'home' | 'recipes' | 'fridge' | 'community' | 'live' | 'backend' | 'bookmarks';
  currentTab?: 'home' | 'recipes' | 'fridge' | 'community' | 'live' | 'backend' | 'bookmarks';
  onChangeTab?: (tab: any) => void;
  onSelectTab?: (tab: any) => void;
  lang?: Language;
  currentLang?: Language;
  onChangeLang?: (lang: Language) => void;
  onSelectLang?: (lang: Language) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout?: () => void;
  onOpenCreateRecipe?: () => void;
  onOpenAIChat?: () => void;
  onOpenCart: () => void;
  onOpenCompare?: () => void;
  onOpenBookmarks?: () => void;
  onOpenBackendDocs?: () => void;
  onOpenFridge?: () => void;
  cartCount?: number;
  compareCount?: number;
  bookmarkCount?: number;
  bookmarksCount?: number;
  isOffline?: boolean;
  onToggleOffline?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  currentTab,
  onChangeTab,
  onSelectTab,
  lang,
  currentLang,
  onChangeLang,
  onSelectLang,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenCreateRecipe,
  onOpenAIChat,
  onOpenCart,
  onOpenCompare,
  onOpenBookmarks,
  onOpenBackendDocs,
  onOpenFridge,
  cartCount = 0,
  compareCount = 0,
  bookmarkCount,
  bookmarksCount,
  isOffline = false,
  onToggleOffline,
  searchQuery,
  onSearchChange,
}) => {
  const effectiveLang: Language = lang || currentLang || 'ko';
  const t = I18N_DICTIONARY[effectiveLang] || I18N_DICTIONARY.ko;
  const effectiveTab = activeTab || currentTab || 'home';
  const handleTabChange = (tab: any) => {
    if (tab === 'backend' && onOpenBackendDocs) {
      onOpenBackendDocs();
      return;
    }
    if (tab === 'fridge' && onOpenFridge) {
      onOpenFridge();
      return;
    }
    if (tab === 'bookmarks' && onOpenBookmarks) {
      onOpenBookmarks();
      return;
    }
    if (onChangeTab) onChangeTab(tab);
    else if (onSelectTab) onSelectTab(tab);
  };

  const handleLangChange = (l: Language) => {
    if (onChangeLang) onChangeLang(l);
    else if (onSelectLang) onSelectLang(l);
    setShowLangMenu(false);
  };

  const totalBookmarks = bookmarkCount !== undefined ? bookmarkCount : (bookmarksCount !== undefined ? bookmarksCount : 0);

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e9ecef] shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div 
            id="brand-logo"
            onClick={() => handleTabChange('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#ff6b6b] to-[#ff8787] flex items-center justify-center text-white shadow-md shadow-[#ff6b6b]/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#ff6b6b]">
                Kooking
              </span>
              <span className="hidden md:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#4ecdc4]/15 text-[#20a39a]">
                PRO
              </span>
            </div>
          </div>

          {/* Search Bar on Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                id="navbar-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#f8f9fa] border border-[#e9ecef] rounded-full focus:outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all text-[#2f3542]"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-recipes-tab"
              onClick={() => handleTabChange('home')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                effectiveTab === 'home' || effectiveTab === 'recipes'
                  ? 'text-[#ff6b6b] bg-[#ff6b6b]/10' 
                  : 'text-[#2f3542] hover:text-[#ff6b6b] hover:bg-gray-50'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>{t.navExplore}</span>
            </button>

            <button
              id="nav-fridge-tab"
              onClick={() => handleTabChange('fridge')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                effectiveTab === 'fridge' 
                  ? 'text-[#ff6b6b] bg-[#ff6b6b]/10' 
                  : 'text-[#2f3542] hover:text-[#ff6b6b] hover:bg-gray-50'
              }`}
            >
              <Refrigerator className="w-4 h-4 text-[#4ecdc4]" />
              <span>{t.navFridge}</span>
            </button>

            <button
              id="nav-community-tab"
              onClick={() => handleTabChange('community')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                effectiveTab === 'community' 
                  ? 'text-[#ff6b6b] bg-[#ff6b6b]/10' 
                  : 'text-[#2f3542] hover:text-[#ff6b6b] hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>{t.navCommunity}</span>
            </button>

            <button
              id="nav-live-tab"
              onClick={() => handleTabChange('live')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                effectiveTab === 'live' 
                  ? 'text-[#ff6b6b] bg-[#ff6b6b]/10' 
                  : 'text-[#2f3542] hover:text-[#ff6b6b] hover:bg-gray-50'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <Radio className="w-4 h-4 text-red-500" />
              <span>{t.navLive}</span>
            </button>

            <button
              id="nav-backend-tab"
              onClick={() => handleTabChange('backend')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                effectiveTab === 'backend' 
                  ? 'text-[#ff6b6b] bg-[#ff6b6b]/10' 
                  : 'text-[#2f3542] hover:text-[#ff6b6b] hover:bg-gray-50'
              }`}
            >
              <Server className="w-4 h-4 text-purple-600" />
              <span className="hidden lg:inline">{t.navBackendDocs}</span>
              <span className="lg:hidden">30대 API</span>
            </button>
          </nav>

          {/* Action Tools & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Chef Button */}
            {onOpenAIChat && (
              <button
                id="ai-chef-btn"
                onClick={onOpenAIChat}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all"
                title="AI 셰프 챗봇"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">AI 셰프</span>
              </button>
            )}

            {/* Compare Button */}
            {compareCount > 0 && onOpenCompare && (
              <button
                id="compare-open-btn"
                onClick={onOpenCompare}
                className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-[#4ecdc4]/15 text-[#20a39a] font-semibold text-xs sm:text-sm flex items-center gap-1 hover:bg-[#4ecdc4]/25 transition-all"
                title="레시피 비교"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">비교({compareCount})</span>
                <span className="sm:hidden text-xs">{compareCount}</span>
              </button>
            )}

            {/* Bookmarks */}
            <button
              id="nav-bookmark-btn"
              onClick={() => handleTabChange('bookmarks')}
              className={`relative p-2 sm:p-2.5 rounded-xl border border-[#e9ecef] hover:bg-gray-50 transition-colors ${
                effectiveTab === 'bookmarks' ? 'text-[#ff6b6b] border-[#ff6b6b]/40 bg-[#ff6b6b]/5' : 'text-[#2f3542]'
              }`}
              title="스크랩북"
            >
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalBookmarks > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff6b6b] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalBookmarks}
                </span>
              )}
            </button>

            {/* Cart Drawer Button */}
            <button
              id="nav-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 sm:p-2.5 rounded-xl border border-[#e9ecef] hover:bg-gray-50 transition-colors text-[#2f3542]"
              title="장바구니"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff6b6b] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* PWA Offline Toggle */}
            {onToggleOffline && (
              <button
                id="pwa-offline-toggle"
                onClick={onToggleOffline}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                  isOffline 
                    ? 'bg-amber-500/10 text-amber-600 border-amber-300' 
                    : 'bg-emerald-500/10 text-emerald-600 border-emerald-300'
                }`}
                title={isOffline ? '오프라인 캐시 모드' : '온라인 클라우드 동기화'}
              >
                {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              </button>
            )}

            {/* i18n Language Dropdown */}
            <div className="relative">
              <button
                id="i18n-lang-btn"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 sm:p-2.5 rounded-xl border border-[#e9ecef] hover:bg-gray-50 text-[#2f3542] flex items-center gap-1 text-xs font-bold"
              >
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="uppercase">{effectiveLang}</span>
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-[#e9ecef] rounded-xl shadow-lg py-1 z-50">
                  <button
                    onClick={() => handleLangChange('ko')}
                    className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-gray-50 flex items-center justify-between ${effectiveLang === 'ko' ? 'text-[#ff6b6b] font-bold' : 'text-[#2f3542]'}`}
                  >
                    <span>한국어</span>
                    <span>🇰🇷</span>
                  </button>
                  <button
                    onClick={() => handleLangChange('en')}
                    className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-gray-50 flex items-center justify-between ${effectiveLang === 'en' ? 'text-[#ff6b6b] font-bold' : 'text-[#2f3542]'}`}
                  >
                    <span>English</span>
                    <span>🇺🇸</span>
                  </button>
                  <button
                    onClick={() => handleLangChange('ja')}
                    className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-gray-50 flex items-center justify-between ${effectiveLang === 'ja' ? 'text-[#ff6b6b] font-bold' : 'text-[#2f3542]'}`}
                  >
                    <span>日本語</span>
                    <span>🇯🇵</span>
                  </button>
                </div>
              )}
            </div>

            {/* Create Recipe Button */}
            {onOpenCreateRecipe && (
              <button
                id="create-recipe-header-btn"
                onClick={onOpenCreateRecipe}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#ff6b6b]/20 transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.navCreateRecipe}</span>
              </button>
            )}

            {/* User Profile / Auth */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full border-2 border-[#ff6b6b]/40 hover:border-[#ff6b6b] transition-all"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e9ecef] rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-[#2f3542]">{currentUser.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 bg-[#ff6b6b]/10 text-[#ff6b6b] rounded-full">
                        {currentUser.badge}
                      </span>
                    </div>
                    <button
                      onClick={() => { handleTabChange('community'); setShowUserMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      <span>내 블로그 글 보기</span>
                    </button>
                    <button
                      onClick={() => { handleTabChange('bookmarks'); setShowUserMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Bookmark className="w-4 h-4 text-[#ff6b6b]" />
                      <span>스크랩 레시피</span>
                    </button>
                    {onLogout && (
                      <button
                        onClick={() => { onLogout(); setShowUserMenu(false); }}
                        className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t.navLogout}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                id="login-modal-btn"
                onClick={onOpenAuth}
                className="px-3.5 py-2 rounded-xl bg-[#2f3542] hover:bg-[#1e222b] text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t.navLogin}</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-gray-100 text-xs font-semibold text-gray-600 overflow-x-auto gap-1">
          <button
            onClick={() => handleTabChange('home')}
            className={`px-2 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${effectiveTab === 'home' || effectiveTab === 'recipes' ? 'text-[#ff6b6b] bg-[#ff6b6b]/10' : ''}`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>레시피</span>
          </button>
          <button
            onClick={() => handleTabChange('fridge')}
            className={`px-2 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${effectiveTab === 'fridge' ? 'text-[#ff6b6b] bg-[#ff6b6b]/10' : ''}`}
          >
            <Refrigerator className="w-3.5 h-3.5 text-[#4ecdc4]" />
            <span>냉장고</span>
          </button>
          <button
            onClick={() => handleTabChange('community')}
            className={`px-2 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${effectiveTab === 'community' ? 'text-[#ff6b6b] bg-[#ff6b6b]/10' : ''}`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>블로그</span>
          </button>
          <button
            onClick={() => handleTabChange('live')}
            className={`px-2 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${effectiveTab === 'live' ? 'text-[#ff6b6b] bg-[#ff6b6b]/10' : ''}`}
          >
            <Radio className="w-3.5 h-3.5 text-red-500" />
            <span>라이브</span>
          </button>
          <button
            onClick={() => handleTabChange('backend')}
            className={`px-2 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${effectiveTab === 'backend' ? 'text-[#ff6b6b] bg-[#ff6b6b]/10' : ''}`}
          >
            <Server className="w-3.5 h-3.5 text-purple-600" />
            <span>아키텍처</span>
          </button>
          {onOpenCreateRecipe && (
            <button
              onClick={onOpenCreateRecipe}
              className="px-2 py-1.5 rounded-lg bg-[#ff6b6b] text-white flex items-center gap-1 whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>작성</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
