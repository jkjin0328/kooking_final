import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Clock, 
  Flame, 
  Star, 
  Users, 
  Minus, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Printer, 
  Share2, 
  ShoppingCart, 
  Bookmark, 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Check, 
  Send, 
  ThumbsUp, 
  HelpCircle,
  Video
} from 'lucide-react';
import { Recipe, Ingredient, CookingStep, Review, CartItem, Language } from '../types';
import { I18N_DICTIONARY } from '../locales/i18n';
import confetti from 'canvas-confetti';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  lang?: Language;
  isBookmarked: boolean;
  isLiked: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleLike: (id: string) => void;
  onAddToCart: (items: CartItem[]) => void;
  onTriggerFloatingVideo?: (videoUrl: string, title: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  lang = 'ko',
  isBookmarked,
  isLiked,
  onToggleBookmark,
  onToggleLike,
  onAddToCart,
  onTriggerFloatingVideo,
}) => {
  if (!recipe) return null;

  const t = I18N_DICTIONARY[lang || 'ko'] || I18N_DICTIONARY.ko;

  // Feature 1: Serving Calculator state
  const [servings, setServings] = useState<number>(recipe.servings || 2);
  const servingRatio = servings / (recipe.servings || 2);

  // Active cooking step index for guided mode
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Feature 2: Step-by-Step Timer state
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(
    recipe.steps[0]?.timeSeconds || 180
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerCompleted, setTimerCompleted] = useState<boolean>(false);

  // Feature 11: Web Speech Recognition (Voice Mode)
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // Feature 12: TTS (Text-to-Speech)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Feature 13: Selected ingredients for cart
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    recipe.ingredients.forEach((ing) => {
      initial[ing.id] = true;
    });
    return initial;
  });

  // Feature 10: Review and Rating state
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewAuthor, setReviewAuthor] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewsList, setReviewsList] = useState<Review[]>(recipe.reviews || []);
  const [shareToast, setShareToast] = useState<string>('');

  // Update timer when active step changes
  useEffect(() => {
    const currentStepTime = recipe.steps[activeStepIndex]?.timeSeconds || 180;
    setTimerSecondsLeft(currentStepTime);
    setIsTimerRunning(false);
    setTimerCompleted(false);
  }, [activeStepIndex, recipe]);

  // Timer interval countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setTimerCompleted(true);
            playBeepSound();
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  // Audio Beep Sound via Web Audio API
  const playBeepSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio playback error', e);
    }
  };

  // Feature 12: TTS Speech function
  const handleReadStep = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('이 브라우저는 음성 합성을 지원하지 않습니다.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'en' ? 'en-US' : lang === 'ja' ? 'ja-JP' : 'ko-KR';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Feature 11: Web Speech Recognition Handler
  const toggleVoiceGuidedMode = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('현재 브라우저에서 음성 인식을 지원하지 않습니다. Chrome을 권장합니다.');
      return;
    }

    if (isVoiceActive) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsVoiceActive(false);
      setVoiceTranscript('');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'en' ? 'en-US' : lang === 'ja' ? 'ja-JP' : 'ko-KR';
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.trim().toLowerCase();
        setVoiceTranscript(`인식된 명령: "${command}"`);

        if (command.includes('다음') || command.includes('next') || command.includes('つぎ')) {
          setActiveStepIndex((prev) => Math.min(recipe.steps.length - 1, prev + 1));
          handleReadStep(recipe.steps[Math.min(recipe.steps.length - 1, activeStepIndex + 1)]?.description || '');
        } else if (command.includes('이전') || command.includes('prev') || command.includes('まえ')) {
          setActiveStepIndex((prev) => Math.max(0, prev - 1));
        } else if (command.includes('타이머') || command.includes('timer') || command.includes('시작') || command.includes('start')) {
          setIsTimerRunning(true);
        } else if (command.includes('정지') || command.includes('pause') || command.includes('스톱')) {
          setIsTimerRunning(false);
        } else if (command.includes('읽어') || command.includes('read')) {
          handleReadStep(recipe.steps[activeStepIndex]?.description || '');
        }
      };

      recognition.onerror = (e: any) => {
        console.error('Speech error', e);
        setIsVoiceActive(false);
      };

      recognition.onend = () => {
        if (isVoiceActive && recognitionRef.current) {
          try { recognition.start(); } catch (e) {}
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsVoiceActive(true);
      setVoiceTranscript('음성 인식 시작됨: "다음", "이전", "타이머", "읽어줘"');
    } catch (e) {
      console.error(e);
      alert('마이크 권한이 필요하거나 음성 인식 초기화에 실패했습니다.');
    }
  };

  // Feature 20: Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') {
        setActiveStepIndex((prev) => Math.min(recipe.steps.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveStepIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsTimerRunning((prev) => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        handleReadStep(recipe.steps[activeStepIndex]?.description || '');
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStepIndex, recipe]);

  // Feature 9: Print & Share
  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToast('레시피 링크가 클립보드에 복사되었습니다! ✨');
      setTimeout(() => setShareToast(''), 3000);
    }
  };

  // Feature 13: Add selected ingredients to cart
  const handleAddSelectedToCart = () => {
    const itemsToAdd: CartItem[] = recipe.ingredients
      .filter((ing) => selectedIngredientIds[ing.id])
      .map((ing) => ({
        id: `cart-${ing.id}-${Date.now()}`,
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        name: ing.name,
        amountText: `${Math.round(ing.amount * servingRatio * 10) / 10} ${ing.unit}`,
        price: ing.price ? Math.round(ing.price * servingRatio) : 2500,
        quantity: 1,
        image: recipe.imageUrl,
      }));

    if (itemsToAdd.length === 0) {
      alert('장바구니에 담을 재료를 1개 이상 선택해 주세요.');
      return;
    }

    onAddToCart(itemsToAdd);
    setShareToast(`선택한 ${itemsToAdd.length}개 재료가 장바구니에 담겼습니다! 🛒`);
    setTimeout(() => setShareToast(''), 3000);
  };

  // Feature 10: Submit Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim() || '요리초보',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      rating: userRating,
      date: '방금 전',
      content: reviewComment.trim(),
      likes: 0,
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewComment('');
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
  };

  // Chart.js Macronutrients Data
  const chartData = {
    labels: ['탄수화물 (Carbs)', '단백질 (Protein)', '지방 (Fat)'],
    datasets: [
      {
        data: [
          recipe.nutrition.carbs,
          recipe.nutrition.protein,
          recipe.nutrition.fat,
        ],
        backgroundColor: ['#4ecdc4', '#ff6b6b', '#f9ca24'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          font: { size: 11, family: 'Noto Sans KR' },
        },
      },
    },
  };

  const currentStep = recipe.steps[activeStepIndex] || recipe.steps[0];
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white">
      
      {/* Modal Container */}
      <div 
        id="recipe-detail-modal"
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#e9ecef] print:border-none print:shadow-none print:my-0 print:rounded-none animate-scale-up"
      >
        
        {/* Header Action Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#e9ecef] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ff6b6b] text-white">
              {recipe.categoryLabel}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              {recipe.difficulty} 난이도
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Print Button */}
            <button
              id="modal-print-btn"
              onClick={handlePrint}
              className="p-2 rounded-xl border border-[#e9ecef] hover:bg-gray-50 text-gray-700 transition-colors"
              title={t.printRecipe}
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Share Button */}
            <button
              id="modal-share-btn"
              onClick={handleShare}
              className="p-2 rounded-xl border border-[#e9ecef] hover:bg-gray-50 text-gray-700 transition-colors"
              title={t.shareSns}
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Like Button */}
            <button
              id="modal-like-btn"
              onClick={() => onToggleLike(recipe.id)}
              className={`p-2 rounded-xl border border-[#e9ecef] hover:bg-gray-50 transition-colors ${
                isLiked ? 'text-[#ff6b6b] border-[#ff6b6b]/40 bg-[#ff6b6b]/5' : 'text-gray-700'
              }`}
              title="좋아요"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#ff6b6b]' : ''}`} />
            </button>

            {/* Bookmark Button */}
            <button
              id="modal-bookmark-btn"
              onClick={() => onToggleBookmark(recipe.id)}
              className={`p-2 rounded-xl border border-[#e9ecef] hover:bg-gray-50 transition-colors ${
                isBookmarked ? 'text-[#ff6b6b] border-[#ff6b6b]/40 bg-[#ff6b6b]/5' : 'text-gray-700'
              }`}
              title="스크랩"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#ff6b6b]' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {shareToast && (
          <div className="bg-[#4ecdc4] text-white text-xs font-bold text-center py-2 px-4 animate-fade-in print:hidden">
            {shareToast}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-8 print:max-h-none print:p-4">
          
          {/* Top Title & Hero Banner */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-medium text-gray-500">
              {recipe.tags.map((tag, idx) => (
                <span key={idx} className="bg-gray-100 px-2.5 py-0.5 rounded-full">#{tag}</span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2f3542] leading-snug">
              {recipe.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              {recipe.description}
            </p>

            {/* Chef Profile Header */}
            <div className="mt-4 flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={recipe.author.avatar}
                  alt={recipe.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#2f3542] flex items-center gap-1.5">
                    <span>{recipe.author.name}</span>
                    <span className="text-[10px] bg-[#ff6b6b]/10 text-[#ff6b6b] px-2 py-0.5 rounded-full font-semibold">
                      {recipe.author.badge}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-400">검증된 공식 레시피</p>
                </div>
              </div>

              {/* Cooking Quick Stats */}
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 bg-gray-50 px-4 py-2 rounded-2xl">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#4ecdc4]" /> {recipe.cookTime}분 조리
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-[#ff6b6b]" /> {recipe.calories} kcal/인분
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" /> {recipe.rating.toFixed(1)} ({reviewsList.length})
                </span>
              </div>
            </div>
          </div>

          {/* Recipe Video Preview & Floating PiP Trigger (Feature 18) */}
          {recipe.videoUrl && (
            <div className="bg-gray-900 rounded-2xl overflow-hidden relative shadow-md group">
              <video
                src={recipe.videoUrl}
                controls
                className="w-full aspect-video object-cover"
                poster={recipe.imageUrl}
              />
              {onTriggerFloatingVideo && (
                <button
                  id="trigger-pip-btn"
                  onClick={() => onTriggerFloatingVideo(recipe.videoUrl!, recipe.title)}
                  className="absolute top-3 right-3 bg-black/70 hover:bg-[#ff6b6b] text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>미니 플레이어로 보기 (PiP)</span>
                </button>
              )}
            </div>
          )}

          {/* ========================================================
              FEATURE 1: Serving Calculator (+/- Auto Gram Calc)
              & FEATURE 13: Shopping Cart Ingredient Checkbox
             ======================================================== */}
          <div className="bg-[#f8f9fa] rounded-2xl p-5 sm:p-6 border border-[#e9ecef]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e9ecef]">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#2f3542] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#ff6b6b]" />
                  <span>{t.ingredientsTitle}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  인원수에 따라 모든 식재료 양이 실시간으로 자동 재계산됩니다.
                </p>
              </div>

              {/* Servings Counter Controls */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-[#e9ecef] shadow-xs">
                <span className="text-xs font-bold text-gray-600 mr-1">{t.servings}:</span>
                <button
                  id="serving-minus-btn"
                  onClick={() => setServings((prev) => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold transition-all disabled:opacity-40"
                  disabled={servings <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-black text-[#ff6b6b]">
                  {servings}
                </span>
                <button
                  id="serving-plus-btn"
                  onClick={() => setServings((prev) => Math.min(10, prev + 1))}
                  className="w-7 h-7 rounded-xl bg-[#ff6b6b] hover:bg-[#ff5252] text-white flex items-center justify-center font-bold transition-all disabled:opacity-40"
                  disabled={servings >= 10}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Ingredients Grid List with Checkbox */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {recipe.ingredients.map((ing) => {
                const scaledAmount = Math.round(ing.amount * servingRatio * 10) / 10;
                const isChecked = !!selectedIngredientIds[ing.id];
                const estPrice = ing.price ? Math.round(ing.price * servingRatio) : 2000;

                return (
                  <div
                    key={ing.id}
                    onClick={() =>
                      setSelectedIngredientIds((prev) => ({ ...prev, [ing.id]: !prev[ing.id] }))
                    }
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'bg-white border-[#ff6b6b]/40 shadow-xs'
                        : 'bg-white/50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isChecked
                            ? 'bg-[#ff6b6b] border-[#ff6b6b] text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-[#2f3542]">
                          {ing.name}
                        </span>
                        {ing.isEssential && (
                          <span className="ml-1.5 text-[10px] font-bold text-[#ff6b6b] bg-[#ff6b6b]/10 px-1.5 py-0.5 rounded">
                            필수
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-black text-[#2f3542]">
                        {scaledAmount} {ing.unit}
                      </span>
                      {ing.price && (
                        <p className="text-[10px] text-gray-400">
                          약 {estPrice.toLocaleString()}원
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart CTA Button */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#e9ecef]">
              <span className="text-xs text-gray-500">
                선택한 재료를 장바구니에 담아 바로 신선 배송 밀키트로 주문할 수 있습니다.
              </span>
              <button
                id="add-ingredients-cart-btn"
                onClick={handleAddSelectedToCart}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2f3542] hover:bg-[#1e222b] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
              >
                <ShoppingCart className="w-4 h-4 text-[#4ecdc4]" />
                <span>{t.addToCart}</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              FEATURE 2: Step Timer, FEATURE 11: Voice Guided Mode,
              FEATURE 12: TTS, FEATURE 20: Keyboard Navigation
             ======================================================== */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#2f3542] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>{t.stepsTitle}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  단계별 조리 시간 타이머, TTS 음성 안내 및 음성 제어를 지원합니다.
                </p>
              </div>

              {/* Voice & TTS Tools */}
              <div className="flex items-center gap-2">
                <button
                  id="voice-mode-toggle-btn"
                  onClick={toggleVoiceGuidedMode}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                    isVoiceActive
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-white border border-[#e9ecef] text-gray-700 hover:bg-gray-50'
                  }`}
                  title={t.voiceHelp}
                >
                  {isVoiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  <span>{isVoiceActive ? '음성인식 켜짐' : '음성인식 요리모드'}</span>
                </button>

                <button
                  id="tts-read-step-btn"
                  onClick={() => handleReadStep(currentStep.description)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-[#e9ecef] ${
                    isSpeaking
                      ? 'bg-[#4ecdc4] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  title={t.ttsReadStep}
                >
                  <Volume2 className="w-4 h-4 text-purple-600" />
                  <span>{isSpeaking ? '읽는 중...' : '단계 읽기'}</span>
                </button>
              </div>
            </div>

            {/* Voice Transcript Banner if active */}
            {isVoiceActive && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2 rounded-xl flex items-center justify-between animate-fade-in">
                <span>🎙️ {voiceTranscript || t.voiceListening}</span>
                <span className="text-[10px] text-gray-500">명령어: "다음", "이전", "타이머", "읽어줘"</span>
              </div>
            )}

            {/* Interactive Step Navigator Banner */}
            <div className="bg-gradient-to-r from-[#ff6b6b]/10 via-purple-50 to-[#4ecdc4]/10 p-5 rounded-2xl border border-[#ff6b6b]/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-[#ff6b6b] uppercase tracking-wider">
                  STEP {activeStepIndex + 1} / {recipe.steps.length}
                </span>

                {/* Step Switch Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeStepIndex === 0}
                    className="p-1.5 rounded-lg bg-white text-gray-700 disabled:opacity-30 hover:bg-gray-100 transition-all border border-gray-200"
                    title="이전 단계 (←)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveStepIndex((prev) => Math.min(recipe.steps.length - 1, prev + 1))}
                    disabled={activeStepIndex === recipe.steps.length - 1}
                    className="p-1.5 rounded-lg bg-white text-gray-700 disabled:opacity-30 hover:bg-gray-100 transition-all border border-gray-200"
                    title="다음 단계 (→)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h4 className="text-base sm:text-lg font-black text-[#2f3542] mb-2">
                {currentStep.title}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {currentStep.description}
              </p>

              {currentStep.tip && (
                <div className="mt-3 p-3 bg-white/80 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <span className="font-bold">💡 셰프 꿀팁:</span>
                  <span>{currentStep.tip}</span>
                </div>
              )}

              {/* Step Timer Box (Feature 2) */}
              {currentStep.timeSeconds && currentStep.timeSeconds > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl sm:text-3xl font-black font-mono tracking-wider ${
                      timerCompleted ? 'text-emerald-600 animate-bounce' : isTimerRunning ? 'text-[#ff6b6b]' : 'text-[#2f3542]'
                    }`}>
                      {formatTimer(timerSecondsLeft)}
                    </div>
                    {timerCompleted && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {t.timerDone}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      id="step-timer-toggle-btn"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-white transition-all shadow-sm ${
                        isTimerRunning
                          ? 'bg-amber-500 hover:bg-amber-600'
                          : 'bg-[#ff6b6b] hover:bg-[#ff5252]'
                      }`}
                    >
                      {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isTimerRunning ? t.pauseTimer : t.startTimer} (Space)</span>
                    </button>

                    <button
                      id="step-timer-reset-btn"
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerSecondsLeft(currentStep.timeSeconds || 180);
                        setTimerCompleted(false);
                      }}
                      className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
                      title={t.resetTimer}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* All Steps Accordion / List */}
            <div className="space-y-3 pt-2">
              {recipe.steps.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    activeStepIndex === idx
                      ? 'bg-white border-[#ff6b6b] shadow-md ring-2 ring-[#ff6b6b]/10'
                      : 'bg-white hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                      activeStepIndex === idx
                        ? 'bg-[#ff6b6b] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {step.stepNumber}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold text-[#2f3542]">
                      {step.title}
                    </h5>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {step.description}
                    </p>
                  </div>
                  {step.timeSeconds && (
                    <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap">
                      ⏱️ {Math.floor(step.timeSeconds / 60)}분
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================
              FEATURE 3: Nutrition Chart (Chart.js Macronutrients)
             ======================================================== */}
          <div className="bg-white rounded-2xl p-6 border border-[#e9ecef] shadow-xs">
            <h3 className="text-base sm:text-lg font-bold text-[#2f3542] flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>{t.nutritionTitle}</span>
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              1인분 기준 식약처 표준 영양 성분 데이터 분석 (총 {recipe.calories} kcal)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Doughnut Chart */}
              <div className="relative h-48 w-full flex items-center justify-center">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                  <span className="text-xl font-black text-[#2f3542]">{recipe.calories}</span>
                  <span className="text-[10px] text-gray-400 font-semibold">kcal / 인분</span>
                </div>
              </div>

              {/* Nutrition Detail Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>탄수화물 (Carbohydrates)</span>
                    <span className="text-[#4ecdc4]">{recipe.nutrition.carbs}g</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#4ecdc4] h-full rounded-full"
                      style={{ width: `${Math.min(100, (recipe.nutrition.carbs / 100) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>단백질 (Protein)</span>
                    <span className="text-[#ff6b6b]">{recipe.nutrition.protein}g</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#ff6b6b] h-full rounded-full"
                      style={{ width: `${Math.min(100, (recipe.nutrition.protein / 60) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>지방 (Fat)</span>
                    <span className="text-amber-500">{recipe.nutrition.fat}g</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, (recipe.nutrition.fat / 50) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
                  <span>나트륨: <strong>{recipe.nutrition.sodium}mg</strong></span>
                  <span>당류: <strong>{recipe.nutrition.sugar}g</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              FEATURE 10: Reviews & Star Rating Calculator
             ======================================================== */}
          <div className="bg-[#f8f9fa] rounded-2xl p-6 border border-[#e9ecef]">
            <h3 className="text-base sm:text-lg font-bold text-[#2f3542] flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>요리 후기 및 별점 ({reviewsList.length})</span>
            </h3>

            {/* Review Input Form */}
            <form onSubmit={handleSubmitReview} className="bg-white p-4 rounded-2xl border border-gray-200 mb-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-600 mr-2">내 별점:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-amber-400 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          (hoverRating || userRating) >= star ? 'fill-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-500 ml-2">{userRating}점</span>
                </div>

                <input
                  type="text"
                  placeholder="닉네임 (선택)"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#ff6b6b]"
                />
              </div>

              <div className="relative">
                <textarea
                  rows={2}
                  placeholder="레시피로 요리해보신 소감이나 나만의 팁을 남겨주세요!"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#ff6b6b] text-[#2f3542]"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 bottom-3 px-4 py-1.5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                >
                  <Send className="w-3 h-3" />
                  <span>등록</span>
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <img src={rev.avatar} alt={rev.author} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs font-bold text-[#2f3542]">{rev.author}</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">{rev.date}</span>
                  </div>
                  <p className="text-xs text-gray-700">{rev.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
