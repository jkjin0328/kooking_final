import React, { useState, useEffect } from 'react';
import { Recipe, BlogPost, CartItem, UserProfile, Language } from './types';
import { INITIAL_RECIPES } from './data/mockRecipes';
import { INITIAL_BLOG_POSTS } from './data/mockCommunity';
import { I18N_DICTIONARY } from './locales/i18n';

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryTags } from './components/CategoryTags';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { FridgeSearchModal } from './components/FridgeSearchModal';
import { RecipeCreateModal } from './components/RecipeCreateModal';
import { CommunityBlogView } from './components/CommunityBlogView';
import { BlogEditorModal } from './components/BlogEditorModal';
import { CompareModal } from './components/CompareModal';
import { AiChefChatModal } from './components/AiChefChatModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { BackendDocsModal } from './components/BackendDocsModal';
import { FloatingMiniPlayer } from './components/FloatingMiniPlayer';
import { Footer } from './components/Footer';

// Icons
import { 
  Sparkles, 
  Layers, 
  ChefHat, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  X, 
  BookOpen, 
  ArrowUp,
  Bookmark,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Global & Locale State
  const [lang, setLang] = useState<Language>('ko');
  const t = I18N_DICTIONARY[lang];

  // Active View Tab: 'home' (Recipes) | 'community' (Naver Blog Feed) | 'bookmarks'
  const [activeTab, setActiveTab] = useState<'home' | 'community' | 'bookmarks'>('home');

  // Recipes & Community State
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'rating' | 'time'>('popular');

  // User & Interaction State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['recipe-1', 'recipe-3']);
  const [likedRecipeIds, setLikedRecipeIds] = useState<string[]>(['recipe-1']);
  const [comparedRecipeIds, setComparedRecipeIds] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      recipeId: 'recipe-1',
      recipeTitle: '숙성 묵은지 돼지고기 김치찌개',
      name: '국내산 암퇘지 삼겹살',
      amountText: '300 g',
      price: 6500,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80',
    },
  ]);

  // Modal Visibility States
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isFridgeModalOpen, setIsFridgeModalOpen] = useState<boolean>(false);
  const [isRecipeCreateOpen, setIsRecipeCreateOpen] = useState<boolean>(false);
  const [isBlogEditorOpen, setIsBlogEditorOpen] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isBackendDocsOpen, setIsBackendDocsOpen] = useState<boolean>(false);

  // Floating PiP Video Player state (Feature 18)
  const [floatingVideo, setFloatingVideo] = useState<{ url: string; title: string } | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string>('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Recipe Interaction Handlers
  const handleToggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((item) => item !== id));
      showToast('스크랩 보관함에서 삭제되었습니다.');
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      showToast('레시피가 스크랩 보관함에 저장되었습니다! 📌');
    }
  };

  const handleToggleLike = (id: string) => {
    if (likedRecipeIds.includes(id)) {
      setLikedRecipeIds(likedRecipeIds.filter((item) => item !== id));
    } else {
      setLikedRecipeIds([...likedRecipeIds, id]);
      showToast('레시피에 좋아요를 남겼습니다! ❤️');
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    }
  };

  const handleToggleCompare = (id: string) => {
    if (comparedRecipeIds.includes(id)) {
      setComparedRecipeIds(comparedRecipeIds.filter((item) => item !== id));
    } else {
      if (comparedRecipeIds.length >= 4) {
        alert('레시피 비교는 최대 4개까지 가능합니다.');
        return;
      }
      setComparedRecipeIds([...comparedRecipeIds, id]);
      showToast('레시피 비교함에 담겼습니다! 📑');
    }
  };

  // Cart Handlers
  const handleAddToCart = (newItems: CartItem[]) => {
    setCartItems((prev) => [...prev, ...newItems]);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Community Blog Handlers
  const handleLikePost = (postId: string) => {
    setBlogPosts(
      blogPosts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
    showToast('게시글에 공감을 눌렀습니다! 💕');
  };

  const handleAddBlogComment = (postId: string, commentText: string, parentId?: string) => {
    setBlogPosts(
      blogPosts.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: currentUser?.name || '익명 푸드로거',
            avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            date: '방금 전',
            content: commentText,
            likes: 0,
            replies: [],
          };
          if (parentId) {
            const updated = (p.comments || []).map((c) =>
              c.id === parentId ? { ...c, replies: [...(c.replies || []), newComment] } : c
            );
            return { ...p, comments: updated, commentsCount: p.commentsCount + 1 };
          }
          return { ...p, comments: [newComment, ...(p.comments || [])], commentsCount: p.commentsCount + 1 };
        }
        return p;
      })
    );
  };

  // Filter and Sort Recipes
  const filteredRecipes = recipes
    .filter((recipe) => {
      // Category filter
      if (activeCategory !== 'all' && recipe.category !== activeCategory) {
        return false;
      }
      // Bookmarks filter
      if (activeTab === 'bookmarks' && !bookmarkedIds.includes(recipe.id)) {
        return false;
      }
      // Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = recipe.title.toLowerCase().includes(q);
        const matchSubtitle = recipe.subtitle.toLowerCase().includes(q);
        const matchIngredient = recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(q));
        const matchTag = recipe.tags.some((tag) => tag.toLowerCase().includes(q));
        return matchTitle || matchSubtitle || matchIngredient || matchTag;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.likesCount + b.reviewCount * 5) - (a.likesCount + a.reviewCount * 5);
      if (sortBy === 'latest') return 0;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'time') return a.cookTime - b.cookTime;
      return 0;
    });

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#2f3542] flex flex-col font-['Noto_Sans_KR',sans-serif]">
      
      {/* Toast Alert Popup */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#2f3542] text-white px-5 py-3 rounded-2xl shadow-xl border border-gray-600 text-xs sm:text-sm font-bold flex items-center gap-2 animate-slide-left">
          <Check className="w-4 h-4 text-[#4ecdc4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        bookmarksCount={bookmarkedIds.length}
        cartCount={cartItems.length}
        compareCount={comparedRecipeIds.length}
        currentLang={lang}
        onChangeLang={setLang}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          showToast('로그아웃 되었습니다.');
        }}
        onOpenCreateRecipe={() => setIsRecipeCreateOpen(true)}
        onOpenAIChat={() => setIsAiChatOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenBookmarks={() => setActiveTab('bookmarks')}
        onOpenBackendDocs={() => setIsBackendDocsOpen(true)}
        onOpenFridge={() => setIsFridgeModalOpen(true)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* Main Content Area based on Tab */}
      <main className="flex-1">
        {activeTab === 'community' ? (
          /* ========================================================
             COMMUNITY BLOG VIEW (Naver Blog Style Food Feed)
             ======================================================== */
          <CommunityBlogView
            posts={blogPosts}
            onOpenBlogEditor={() => setIsBlogEditorOpen(true)}
            lang={lang}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLikePost={handleLikePost}
            onAddComment={handleAddBlogComment}
            onOpenRecipeModalById={(recId) => {
              const target = recipes.find((r) => r.id === recId);
              if (target) setSelectedRecipe(target);
            }}
          />
        ) : (
          /* ========================================================
             HOME & RECIPES GRID VIEW
             ======================================================== */
          <>
            {/* Hero Section (Search, AI Chef trigger, Fridge trigger) */}
            {activeTab !== 'bookmarks' && (
              <HeroSection
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={() => {
                  const el = document.getElementById('recipes-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                onOpenFridgeModal={() => setIsFridgeModalOpen(true)}
                onOpenAiChat={() => setIsAiChatOpen(true)}
                onOpenCreateRecipe={() => setIsRecipeCreateOpen(true)}
                lang={lang}
              />
            )}

            {/* Bookmarks Page Title Banner if active */}
            {activeTab === 'bookmarks' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
                <div className="bg-white p-6 rounded-3xl border border-[#e9ecef] shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#ff6b6b]/10 text-[#ff6b6b] flex items-center justify-center">
                      <Bookmark className="w-5 h-5 fill-[#ff6b6b]" />
                    </div>
                    <div>
                      <h1 className="text-xl font-black text-[#2f3542]">내가 스크랩한 레시피 보관함</h1>
                      <p className="text-xs text-gray-500">언제든 다시 꺼내볼 수 있도록 저장된 {bookmarkedIds.length}개의 맞춤 레시피</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    전체 레시피로 돌아가기
                  </button>
                </div>
              </div>
            )}

            {/* Category Tag Pills & Sort Selector */}
            <CategoryTags
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              sortBy={sortBy}
              onSelectSortBy={setSortBy}
              recipesCount={filteredRecipes.length}
            />

            {/* Recipe Cards Grid Section */}
            <section id="recipes-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {filteredRecipes.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-[#e9ecef] shadow-xs my-8">
                  <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-[#2f3542] mb-1">
                    조건에 맞는 레시피를 찾을 수 없습니다.
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-6">
                    다른 키워드로 검색하거나 카테고리 필터를 초기화해보세요.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                      setActiveTab('home');
                    }}
                    className="px-6 py-2.5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-xs font-bold rounded-xl shadow-md shadow-[#ff6b6b]/25 transition-all"
                  >
                    전체 레시피 다시보기
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isBookmarked={bookmarkedIds.includes(recipe.id)}
                      isLiked={likedRecipeIds.includes(recipe.id)}
                      isCompared={comparedRecipeIds.includes(recipe.id)}
                      onToggleBookmark={(e) => {
                        e.stopPropagation();
                        handleToggleBookmark(recipe.id);
                      }}
                      onToggleLike={(e) => {
                        e.stopPropagation();
                        handleToggleLike(recipe.id);
                      }}
                      onToggleCompare={(e) => {
                        e.stopPropagation();
                        handleToggleCompare(recipe.id);
                      }}
                      onClickCard={(r) => setSelectedRecipe(r)}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* ========================================================
          FLOATING COMPARISON BAR (Feature 14)
         ======================================================== */}
      {comparedRecipeIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#2f3542] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-4 border border-white/20 animate-slide-up">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#4ecdc4]" />
            <span className="text-xs sm:text-sm font-bold">
              {comparedRecipeIds.length}개 레시피 비교함
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="open-compare-matrix-btn"
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-1.5 bg-[#4ecdc4] hover:bg-[#3db8af] text-[#2f3542] text-xs font-black rounded-full shadow-sm transition-all"
            >
              비교표 보기
            </button>
            <button
              onClick={() => setComparedRecipeIds([])}
              className="p-1 text-gray-400 hover:text-white"
              title="비우기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Scroll to Top & Quick AI Floating Button */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2.5">
        <button
          onClick={() => setIsAiChatOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff6b6b] to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-110 transition-all"
          title="AI 수석 셰프 챗봇"
        >
          <Sparkles className="w-5 h-5" />
        </button>

        <button
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full bg-white text-[#2f3542] border border-[#e9ecef] flex items-center justify-center shadow-md hover:bg-gray-50 hover:scale-105 transition-all"
          title="상단으로 이동"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Video PiP Mini Player (Feature 18) */}
      {floatingVideo && (
        <FloatingMiniPlayer
          videoUrl={floatingVideo.url}
          title={floatingVideo.title}
          onClose={() => setFloatingVideo(null)}
        />
      )}

      {/* ========================================================
          MODAL DIALOGS
         ======================================================== */}

      {/* 1. Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        lang={lang}
        isBookmarked={selectedRecipe ? bookmarkedIds.includes(selectedRecipe.id) : false}
        isLiked={selectedRecipe ? likedRecipeIds.includes(selectedRecipe.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onToggleLike={handleToggleLike}
        onAddToCart={handleAddToCart}
        onTriggerFloatingVideo={(videoUrl, title) => setFloatingVideo({ url: videoUrl, title })}
      />

      {/* 2. Fridge Matcher Modal */}
      <FridgeSearchModal
        isOpen={isFridgeModalOpen}
        onClose={() => setIsFridgeModalOpen(false)}
        recipes={recipes}
        lang={lang}
        onSelectRecipe={(r) => setSelectedRecipe(r)}
      />

      {/* 3. Recipe Create Modal */}
      <RecipeCreateModal
        isOpen={isRecipeCreateOpen}
        onClose={() => setIsRecipeCreateOpen(false)}
        onSaveRecipe={(newRec) => {
          setRecipes([newRec, ...recipes]);
          showToast('새 레시피가 성공적으로 등록되었습니다! 🍳');
        }}
        lang={lang}
      />

      {/* 4. Blog Post Editor Modal */}
      <BlogEditorModal
        isOpen={isBlogEditorOpen}
        onClose={() => setIsBlogEditorOpen(false)}
        onSavePost={(newPost) => {
          setBlogPosts([newPost, ...blogPosts]);
          setActiveTab('community');
          showToast('블로그 포스팅이 발행되었습니다! 📖');
        }}
        recipes={recipes}
        currentUser={currentUser}
      />

      {/* 5. Compare Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        comparedRecipes={recipes.filter((r) => comparedRecipeIds.includes(r.id))}
        onRemoveFromCompare={(id) => setComparedRecipeIds(comparedRecipeIds.filter((item) => item !== id))}
        onClearCompare={() => setComparedRecipeIds([])}
        onSelectRecipe={(r) => setSelectedRecipe(r)}
        lang={lang}
      />

      {/* 6. AI Chef Chat Modal */}
      <AiChefChatModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        lang={lang}
        recipes={recipes}
        onSelectRecipe={(r) => setSelectedRecipe(r)}
      />

      {/* 7. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        lang={lang}
      />

      {/* 8. Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`${user.name}님 환영합니다! ✨`);
        }}
        lang={lang}
      />

      {/* 9. 30 Backend APIs & System Architecture Specs Modal */}
      <BackendDocsModal
        isOpen={isBackendDocsOpen}
        onClose={() => setIsBackendDocsOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenBackendDocs={() => setIsBackendDocsOpen(true)}
        onOpenBlog={() => setActiveTab('community')}
        lang={lang}
      />

    </div>
  );
}
