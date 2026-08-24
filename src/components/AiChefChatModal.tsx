import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, ChefHat, RefreshCw, Wine, Flame, Clock } from 'lucide-react';
import { Recipe, Language } from '../types';
import { I18N_DICTIONARY } from '../locales/i18n';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  suggestedRecipes?: Recipe[];
}

interface AiChefChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

export const AiChefChatModal: React.FC<AiChefChatModalProps> = ({
  isOpen,
  onClose,
  lang = 'ko',
  recipes,
  onSelectRecipe,
}) => {
  if (!isOpen) return null;

  const t = I18N_DICTIONARY[lang || 'ko'] || I18N_DICTIONARY.ko;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: '안녕하세요! 저는 Kooking의 AI 수석 셰프 & 소믈리에입니다 🧑‍🍳✨\n오늘 어떤 요리를 만들고 싶으신가요? 냉장고 재료 맞춤 레시피 추천부터 와인/음료 페어링, 대체 재료 문의까지 무엇이든 물어보세요!',
      time: '방금 전',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const QUICK_QUESTIONS = [
    '🥩 삼겹살에 어울리는 와인이나 사이드 메뉴 추천해줘',
    '🥑 다이어트 중인데 500kcal 이하 고단백 저녁 레시피',
    '🥛 생크림 없을 때 까르보나라 대체 재료 알려줘',
    '⚡ 15분 안에 초간단으로 만들 수 있는 자취요리',
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const query = (customPrompt || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call backend AI proxy
      const response = await fetch('/api/ai/chef-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      let aiResponseText = '';
      if (response.ok) {
        const data = await response.json();
        aiResponseText = data.reply;
      } else {
        // Fallback intelligent response
        aiResponseText = generateSmartFallback(query);
      }

      // Check matching recipes from current catalog
      const matched = recipes.filter((r) =>
        query.toLowerCase().split(' ').some((word) => r.title.toLowerCase().includes(word) || r.categoryLabel.includes(word))
      );

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        suggestedRecipes: matched.slice(0, 2),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: generateSmartFallback(query),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartFallback = (query: string) => {
    if (query.includes('와인') || query.includes('페어링') || query.includes('술')) {
      return `🍷 **AI 소믈리에 추천 페어링**:\n- **기름진 육류(삼겹살, 스테이크)**: 탄닌감이 있고 산도가 받쳐주는 카베르네 소비뇽(Cabernet Sauvignon)이나 시라(Syrah)를 추천합니다.\n- **해산물/오일 파스타**: 산뜻한 산미의 소비뇽 블랑 또는 샤르도네가 찰떡궁합입니다!\n- **매콤한 한식**: 가벼운 탄산이 있는 막걸리나 라거 맥주, 리슬링 와인이 매운맛을 부드럽게 감싸줍니다.`;
    }
    if (query.includes('대체') || query.includes('없을 때')) {
      return `💡 **셰프의 비밀 대체 재료 팁**:\n- **생크림 없을 때**: 우유 200ml + 버터 1큰술을 약불에 녹여 섞거나, 우유에 슬라이스 치즈를 녹여 사용하세요.\n- **미림/맛술 없을 때**: 청주 또는 소주에 설탕 0.5스푼을 타서 사용하세요.\n- **굴소스 없을 때**: 진간장 1T + 설탕 0.5T + 멸치액젓 0.3T를 배합하면 감칠맛이 살아납니다!`;
    }
    if (query.includes('다이어트') || query.includes('칼로리')) {
      return `🥑 **다이어터 맞춤 고단백 레시피 제안**:\n- **추천**: 닭가슴살 아보카도 웜샐러드 or 생연어 덮밥\n- **영양 포인트**: 당류를 줄이고 단백질 30g 이상, 건강한 불포화지방을 섭취해 포만감을 오래 유지하세요!`;
    }
    return `🧑‍🍳 **AI 셰프의 제안**:\n질문해주신 '${query}'에 가장 잘 어울리는 맞춤 조리법을 분석했습니다. 조리 시 중불에서 충분히 예열하고, 재료 본연의 맛을 살리는 것이 핵심입니다. Kooking 레시피 목록에서 추천 메뉴를 확인해보세요!`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#e9ecef] flex flex-col h-[80vh] max-h-[700px] animate-scale-up">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[#ff6b6b] via-rose-500 to-purple-600 px-6 py-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black flex items-center gap-2">
                <span>AI 수석 셰프 & 소믈리에</span>
                <span className="text-[10px] bg-white/30 px-2 py-0.5 rounded-full font-bold">
                  Gemini 2.5
                </span>
              </h2>
              <p className="text-xs text-white/80">
                실시간 맞춤 레시피 질의응답 & 페어링 자문
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#f8f9fa]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                  msg.sender === 'user' ? 'bg-[#2f3542]' : 'bg-[#ff6b6b]'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-[#2f3542] text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-[#e9ecef] rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Suggested recipe chips if any */}
                {msg.suggestedRecipes && msg.suggestedRecipes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <span className="text-[11px] font-bold text-[#ff6b6b] block">
                      📌 추천 연관 레시피:
                    </span>
                    {msg.suggestedRecipes.map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => {
                          onClose();
                          onSelectRecipe(rec);
                        }}
                        className="flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer border border-gray-200 transition-colors"
                      >
                        <img src={rec.imageUrl} alt={rec.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h6 className="text-xs font-bold text-[#2f3542] line-clamp-1">{rec.title}</h6>
                          <span className="text-[10px] text-gray-400">⏱️ {rec.cookTime}분 · 🔥 {rec.calories} kcal</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-gray-300' : 'text-gray-400'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-2xl border border-gray-200 w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#ff6b6b]" />
              <span>AI 셰프가 최적의 요리 팁을 분석하고 있습니다...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Question Buttons */}
        <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-none">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] bg-gray-100 hover:bg-[#ff6b6b]/10 hover:text-[#ff6b6b] text-gray-600 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border border-gray-200"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white border-t border-[#e9ecef] flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="AI 셰프에게 요리 비법, 재료 대체, 와인 페어링을 물어보세요..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-[#e9ecef] rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#ff6b6b]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-2.5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-1 shadow-md shadow-[#ff6b6b]/25 transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
