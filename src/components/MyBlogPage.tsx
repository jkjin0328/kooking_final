import React, { useState } from 'react';
import { 
  Recipe, 
  BlogPost, 
  UserProfile, 
  Neighbor, 
  GuestbookEntry, 
  Language 
} from '../types';
import { 
  User as UserIcon, 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Edit3, 
  Plus, 
  Search, 
  Calendar, 
  Eye, 
  Settings, 
  Users, 
  BookOpen, 
  Grid, 
  List, 
  Layout, 
  Lock, 
  Globe, 
  Sparkles, 
  TrendingUp, 
  Check, 
  Send, 
  Image as ImageIcon,
  Palette,
  ExternalLink,
  ChefHat,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MyBlogPageProps {
  currentUser: UserProfile | null;
  recipes: Recipe[];
  blogPosts: BlogPost[];
  bookmarkedRecipeIds: string[];
  likedRecipeIds: string[];
  onOpenRecipeDetail: (recipe: Recipe) => void;
  onOpenBlogEditor: () => void;
  onToggleBookmark: (id: string) => void;
  onToggleLikeRecipe: (id: string) => void;
  onLikePost: (id: string) => void;
  onOpenCreateRecipe: () => void;
  onOpenAdmin?: () => void;
}

const DEFAULT_NEIGHBORS: Neighbor[] = [
  {
    id: 'n-1',
    name: '백선생 키친연구소',
    blogTitle: '집밥 백선생의 만능 레시피 노트',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'mutual',
    lastPostTitle: '초간단 5분 만능 간장 소스와 활용 요리 3가지',
    lastPostTime: '2시간 전'
  },
  {
    id: 'n-2',
    name: '손맛장인 김순옥',
    blogTitle: '순옥이네 사계절 발효와 장맛 이야기',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'mutual',
    lastPostTitle: '봄동 겉절이 황금 양념장과 칼국수 꿀조합',
    lastPostTime: '5시간 전'
  },
  {
    id: 'n-3',
    name: '파티시에 유진',
    blogTitle: '달콤한 프랑스 구움과자 홈베이킹 연구소',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'following',
    lastPostTitle: '실패 없는 바스크 치즈케이크 굽는 오븐 온도 팁',
    lastPostTime: '1일 전'
  },
  {
    id: 'n-4',
    name: '비스트로 오너셰프 레오',
    blogTitle: '지중해 오일 파스타와 와인 페어링',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'mutual',
    lastPostTitle: '생면 파스타 반죽 텍스처 잡는 셰프의 비밀',
    lastPostTime: '2일 전'
  }
];

const DEFAULT_GUESTBOOK: GuestbookEntry[] = [
  {
    id: 'gb-1',
    author: '홈카페 바리스타 준',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    content: '민서 셰프님! 지난주에 올려주신 티라미수 레시피 보고 카페 메뉴로 테스트해봤는데 손님들 반응이 너무 폭발적입니다. 늘 좋은 레시피 감사해요! ☕🍰',
    date: '2026.08.23 15:40',
    isSecret: false,
    reply: '준 님 감사합니다! 홈카페 메뉴로 인기라니 정말 뿌듯하네요. 다음주에 커피 젤리 디저트도 올릴게요!',
    replyDate: '2026.08.23 16:10'
  },
  {
    id: 'gb-2',
    author: '자취생 백과사전',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    content: '서로이웃 신청 수락해주셔서 감사합니다! 앞으로 자주 소통하며 맛있는 팁 많이 배워갈게요~ 즐거운 주말 보내세요 😊',
    date: '2026.08.22 19:20',
    isSecret: false,
  },
  {
    id: 'gb-3',
    author: '비공개 이웃',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: '비밀글입니다. 쿠킹클래스 오프라인 일정 문의드립니다.',
    date: '2026.08.21 11:05',
    isSecret: true,
    reply: '비밀 답변이 등록되었습니다: 다음 달 마포 스튜디오에서 소규모 클래스가 열릴 예정입니다.',
    replyDate: '2026.08.21 13:30'
  }
];

export const MyBlogPage: React.FC<MyBlogPageProps> = ({
  currentUser,
  recipes,
  blogPosts,
  bookmarkedRecipeIds,
  likedRecipeIds,
  onOpenRecipeDetail,
  onOpenBlogEditor,
  onToggleBookmark,
  onToggleLikeRecipe,
  onLikePost,
  onOpenCreateRecipe,
  onOpenAdmin
}) => {
  // Active Tab within Naver Blog MyPage
  const [blogTab, setBlogTab] = useState<'posts' | 'scraps' | 'myrecipes' | 'neighbors' | 'guestbook' | 'stats' | 'settings'>('posts');
  
  // Blog Post View Mode: 'album' | 'feed' | 'list'
  const [viewMode, setViewMode] = useState<'album' | 'feed' | 'list'>('feed');
  
  // Category Filtering in Blog
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchPostQuery, setSearchPostQuery] = useState<string>('');

  // Blog Skin & Theme
  const [skinTheme, setSkinTheme] = useState<'default' | 'mint' | 'warm' | 'forest' | 'lavender'>('default');
  const [blogTitle, setBlogTitle] = useState<string>('민서의 맛있는 사계절 식탁 🍳');
  const [blogSubtitle, setBlogSubtitle] = useState<string>('좋은 식재료와 온기 가득한 집밥 레시피를 기록하는 푸드로그');
  const [coverImage, setCoverImage] = useState<string>('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&auto=format&fit=crop&q=80');

  // Guestbook & Neighbor state
  const [guestbookList, setGuestbookList] = useState<GuestbookEntry[]>(DEFAULT_GUESTBOOK);
  const [newGuestMessage, setNewGuestMessage] = useState<string>('');
  const [isSecretMessage, setIsSecretMessage] = useState<boolean>(false);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  // Neighbors state
  const [neighborsList, setNeighborsList] = useState<Neighbor[]>(DEFAULT_NEIGHBORS);
  const [neighborTab, setNeighborTab] = useState<'feed' | 'list' | 'requests'>('feed');
  const [neighborRequests, setNeighborRequests] = useState([
    { id: 'req-1', name: '이탈리안 셰프 마르코', blogTitle: '정통 파스타 & 리조또 쿠킹북', avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80', message: '안녕하세요 셰프님! 평소 글 너무 잘 보고 있습니다. 서로이웃 신청해요!' }
  ]);

  // Selected single post viewer
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');

  // User Profile Data Fallback
  const profileName = currentUser?.name || '요리연구가 김민서';
  const profileAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const profileBio = currentUser?.bio || '제철 식재료로 차리는 정갈한 식탁. 쿠킹 클래스 운영 중 & 푸드 칼럼니스트.';
  const todayCount = 1428;
  const totalCount = 58940;
  const neighborCount = 1842;

  // Blog categories
  const categories = [
    { id: 'all', name: '전체 글 보기', count: blogPosts.length },
    { id: 'homecook', name: '🍳 집밥 & 가정식', count: 12 },
    { id: 'baking', name: '🥐 홈베이킹 & 디저트', count: 8 },
    { id: 'diet', name: '🥗 다이어트 & 클린식', count: 6 },
    { id: 'tips', name: '💡 조리 & 보관 꿀팁', count: 5 },
    { id: 'review', name: '📝 밀키트 & 식재료 리뷰', count: 4 },
  ];

  // Bookmarked recipes list
  const bookmarkedRecipes = recipes.filter(r => bookmarkedRecipeIds.includes(r.id));
  
  // User's own recipes
  const myRecipes = recipes.slice(0, 8); // Display first 8 as sample user-authored

  // Handlers
  const handleAddGuestbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestMessage.trim()) return;
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      author: '방문자 (' + (currentUser?.name || '요리애호가') + ')',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      content: newGuestMessage,
      date: new Date().toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      isSecret: isSecretMessage
    };
    setGuestbookList([newEntry, ...guestbookList]);
    setNewGuestMessage('');
    setIsSecretMessage(false);
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
  };

  const handleSendReply = (id: string) => {
    const text = replyTextMap[id];
    if (!text?.trim()) return;
    setGuestbookList(guestbookList.map(item => item.id === id ? {
      ...item,
      reply: text,
      replyDate: new Date().toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    } : item));
    setReplyTextMap({ ...replyTextMap, [id]: '' });
    setActiveReplyId(null);
  };

  const handleAcceptNeighbor = (reqId: string) => {
    const req = neighborRequests.find(r => r.id === reqId);
    if (req) {
      setNeighborsList([...neighborsList, {
        id: req.id,
        name: req.name,
        blogTitle: req.blogTitle,
        avatar: req.avatar,
        status: 'mutual',
        lastPostTitle: '새로운 서로이웃이 되었습니다!',
        lastPostTime: '방금 전'
      }]);
      setNeighborRequests(neighborRequests.filter(r => r.id !== reqId));
    }
  };

  // Skin color accents
  const skinAccents = {
    default: { headerBg: 'from-[#2f3542] to-[#1e222d]', primary: '#ff6b6b', ring: 'ring-[#ff6b6b]' },
    mint: { headerBg: 'from-[#00b894] to-[#008369]', primary: '#00b894', ring: 'ring-[#00b894]' },
    warm: { headerBg: 'from-[#e17055] to-[#d63031]', primary: '#e17055', ring: 'ring-[#e17055]' },
    forest: { headerBg: 'from-[#2d3436] to-[#0984e3]', primary: '#0984e3', ring: 'ring-[#0984e3]' },
    lavender: { headerBg: 'from-[#6c5ce7] to-[#a29bfe]', primary: '#6c5ce7', ring: 'ring-[#6c5ce7]' }
  };

  const currentTheme = skinAccents[skinTheme];

  return (
    <div className="min-h-screen bg-[#f1f2f6] pb-24 text-[#2f3542] font-sans">
      
      {/* 1. Naver Blog Header Banner */}
      <div className="relative w-full bg-white border-b border-[#e9ecef] shadow-sm">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 md:h-72 w-full overflow-hidden bg-gray-900">
          <img 
            src={coverImage} 
            alt="Blog Cover" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Top Blog Navigation Info */}
          <div className="absolute top-4 right-4 sm:right-8 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs">
            <span className="font-medium text-emerald-400">TODAY <strong className="text-white">{todayCount.toLocaleString()}</strong></span>
            <span className="text-gray-400">|</span>
            <span className="font-medium text-gray-300">TOTAL <strong className="text-white">{totalCount.toLocaleString()}</strong></span>
          </div>

          {/* Blog Title & Bio in Cover */}
          <div className="absolute bottom-6 left-4 sm:left-8 md:left-12 text-white max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#ff6b6b] text-white text-xs font-bold uppercase tracking-wider">
                NAVER INFLUENCER
              </span>
              <span className="text-xs text-white/80 font-medium">
                kooking.me/blog/chef_minseo
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">
              {blogTitle}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-white/90 font-medium drop-shadow">
              {blogSubtitle}
            </p>
          </div>
        </div>

        {/* Blog Global Nav Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between py-3 gap-3 border-t border-gray-100">
            {/* Nav Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
              <button
                onClick={() => { setBlogTab('posts'); setSelectedPost(null); }}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  blogTab === 'posts' 
                    ? 'bg-[#2f3542] text-white shadow-sm' 
                    : 'text-[#2f3542] hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                블로그 글 ({blogPosts.length})
              </button>

              <button
                onClick={() => setBlogTab('scraps')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  blogTab === 'scraps' 
                    ? 'bg-[#2f3542] text-white shadow-sm' 
                    : 'text-[#2f3542] hover:bg-gray-100'
                }`}
              >
                <Bookmark className="w-4 h-4 text-amber-500" />
                스크랩북 ({bookmarkedRecipeIds.length})
              </button>

              <button
                onClick={() => setBlogTab('myrecipes')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  blogTab === 'myrecipes' 
                    ? 'bg-[#2f3542] text-white shadow-sm' 
                    : 'text-[#2f3542] hover:bg-gray-100'
                }`}
              >
                <ChefHat className="w-4 h-4 text-[#ff6b6b]" />
                내 레시피 ({myRecipes.length})
              </button>

              <button
                onClick={() => setBlogTab('neighbors')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  blogTab === 'neighbors' 
                    ? 'bg-[#2f3542] text-white shadow-sm' 
                    : 'text-[#2f3542] hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4 text-blue-500" />
                이웃 목록 ({neighborCount})
              </button>

              <button
                onClick={() => setBlogTab('guestbook')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  blogTab === 'guestbook' 
                    ? 'bg-[#2f3542] text-white shadow-sm' 
                    : 'text-[#2f3542] hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                안부글 / 방명록 ({guestbookList.length})
              </button>

              <button
                onClick={() => setBlogTab('stats')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  blogTab === 'stats' 
                    ? 'bg-[#2f3542] text-white shadow-sm' 
                    : 'text-[#2f3542] hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-purple-500" />
                블로그 통계
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={onOpenBlogEditor}
                className="px-3.5 py-1.5 rounded-lg bg-[#03c75a] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm hover:bg-[#02b150] transition-colors"
                title="네이버 스마트에디터 스타일 글쓰기"
              >
                <Edit3 className="w-4 h-4" />
                글쓰기
              </button>

              <button
                onClick={() => setBlogTab('settings')}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-[#e9ecef] bg-white text-[#2f3542] font-semibold text-xs sm:text-sm flex items-center gap-1 hover:bg-gray-50 transition-colors"
                title="블로그 관리 및 스킨 설정"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">관리</span>
              </button>

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm hover:bg-purple-700 transition-colors"
                  title="관리자 전용 대시보드"
                >
                  <ShieldCheck className="w-4 h-4" />
                  관리자 센터
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT SIDEBAR: Profile & Widgets */}
          <div className="lg:col-span-1 space-y-5">
            
            {/* Profile Widget Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#e9ecef] shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <img 
                    src={profileAvatar} 
                    alt={profileName} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-[#ff6b6b]"
                  />
                  <span className="absolute bottom-0 right-0 bg-[#03c75a] text-white p-1 rounded-full text-[10px] font-bold">
                    <Check className="w-3 h-3" />
                  </span>
                </div>

                <h2 className="text-lg font-bold text-[#2f3542] flex items-center gap-1.5">
                  {profileName}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 mt-1 rounded-full bg-[#ff6b6b]/10 text-[#ff6b6b]">
                  {currentUser?.badge || '인플루언서 셰프'}
                </span>

                <p className="text-xs text-gray-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {profileBio}
                </p>

                {/* Profile Counter Metrics */}
                <div className="grid grid-cols-3 w-full border-t border-b border-gray-100 py-3 my-3 text-center">
                  <div>
                    <div className="text-[11px] text-gray-500 font-medium">게시글</div>
                    <div className="text-sm font-bold text-[#2f3542]">{blogPosts.length}</div>
                  </div>
                  <div className="border-x border-gray-100">
                    <div className="text-[11px] text-gray-500 font-medium">이웃</div>
                    <div className="text-sm font-bold text-[#2f3542]">{neighborCount}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500 font-medium">스크랩</div>
                    <div className="text-sm font-bold text-[#2f3542]">{bookmarkedRecipeIds.length}</div>
                  </div>
                </div>

                {/* Profile Action Buttons */}
                <div className="flex items-center gap-2 w-full">
                  <button 
                    onClick={() => {
                      confetti({ particleCount: 30, spread: 50 });
                      alert('이웃 신청이 완료되었습니다! 🤝');
                    }}
                    className="flex-1 py-2 bg-[#03c75a] hover:bg-[#02b150] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    이웃추가
                  </button>
                  <button 
                    onClick={() => setBlogTab('guestbook')}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-[#2f3542] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    안부글
                  </button>
                </div>
              </div>
            </div>

            {/* Category Directory Widget */}
            <div className="bg-white rounded-2xl p-5 border border-[#e9ecef] shadow-sm">
              <h3 className="text-sm font-bold text-[#2f3542] mb-3 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>카테고리</span>
                <span className="text-xs font-normal text-gray-400">전체 ({blogPosts.length})</span>
              </h3>
              <ul className="space-y-1 text-xs font-medium">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setBlogTab('posts');
                        setSelectedPost(null);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        selectedCategory === cat.id && blogTab === 'posts'
                          ? 'bg-[#ff6b6b]/10 text-[#ff6b6b] font-bold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[11px] text-gray-400">({cat.count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Neighbors Widget */}
            <div className="bg-white rounded-2xl p-5 border border-[#e9ecef] shadow-sm">
              <h3 className="text-sm font-bold text-[#2f3542] mb-3 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>다녀간 이웃</span>
                <span className="text-xs text-[#03c75a] font-bold cursor-pointer" onClick={() => setBlogTab('neighbors')}>더보기</span>
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {DEFAULT_NEIGHBORS.map((n) => (
                  <div key={n.id} className="flex flex-col items-center text-center group cursor-pointer" title={n.name}>
                    <img 
                      src={n.avatar} 
                      alt={n.name} 
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 group-hover:scale-105 transition-transform"
                    />
                    <span className="text-[10px] text-gray-600 truncate w-full mt-1 font-medium">{n.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Banner Widget */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Kooking Pro Recipe Book
              </div>
              <h4 className="text-sm font-extrabold leading-snug">
                민서 셰프의 시크릿 비법 소스 5종 전자책 무료 배포
              </h4>
              <p className="text-[11px] text-white/80 mt-1">
                이웃 추가 시 즉시 다운로드 링크 전송!
              </p>
            </div>

          </div>

          {/* RIGHT MAIN CONTENT AREA */}
          <div className="lg:col-span-3">

            {/* 1. BLOG POSTS VIEW */}
            {blogTab === 'posts' && (
              <div>
                {/* Single Post Detail Reader Mode */}
                {selectedPost ? (
                  <div className="bg-white rounded-2xl border border-[#e9ecef] shadow-sm p-6 sm:p-8">
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="mb-4 text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1"
                    >
                      ← 목록으로 돌아가기
                    </button>

                    <div className="border-b border-gray-100 pb-5 mb-6">
                      <div className="flex items-center gap-2 text-xs text-[#ff6b6b] font-bold mb-2">
                        <span>🍳 집밥 & 일상 레시피</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">{selectedPost.date}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2f3542]">
                        {selectedPost.title}
                      </h2>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={selectedPost.author.avatar} 
                            alt={selectedPost.author.name}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200" 
                          />
                          <div>
                            <div className="text-xs font-bold text-[#2f3542]">{selectedPost.author.name}</div>
                            <div className="text-[11px] text-gray-400">조회 {selectedPost.views.toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => onLikePost(selectedPost.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#ff6b6b]/30 text-[#ff6b6b] bg-[#ff6b6b]/5 text-xs font-bold hover:bg-[#ff6b6b]/15 transition-colors"
                          >
                            <Heart className="w-3.5 h-3.5 fill-[#ff6b6b]" />
                            공감 {selectedPost.likes}
                          </button>
                          <button 
                            onClick={() => {
                              navigator.clipboard?.writeText?.(window.location.href);
                              alert('게시글 주소가 복사되었습니다! 🔗');
                            }}
                            className="p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Post Cover & Rich Content */}
                    <div className="prose max-w-none text-[#2f3542] text-sm leading-relaxed space-y-4">
                      {selectedPost.coverImage && (
                        <div className="rounded-xl overflow-hidden my-4">
                          <img 
                            src={selectedPost.coverImage} 
                            alt={selectedPost.title} 
                            className="w-full h-80 object-cover"
                          />
                        </div>
                      )}
                      
                      <p className="text-base text-gray-700 leading-relaxed font-medium whitespace-pre-line">
                        {selectedPost.content}
                      </p>

                      {/* Additional photos if any */}
                      {selectedPost.images && selectedPost.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 my-4">
                          {selectedPost.images.map((img, idx) => (
                            <img key={idx} src={img} alt="Post detail" className="rounded-xl h-48 w-full object-cover" />
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-4">
                        {selectedPost.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-gray-100 pt-6 mt-8">
                      <h4 className="text-sm font-bold text-[#2f3542] mb-4 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-[#03c75a]" />
                        댓글 ({selectedPost.comments.length})
                      </h4>

                      {/* Comments list */}
                      <div className="space-y-3 mb-6">
                        {selectedPost.comments.map((c) => (
                          <div key={c.id} className="p-3.5 bg-[#f8f9fa] rounded-xl text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img src={c.avatar} alt={c.author} className="w-6 h-6 rounded-full object-cover" />
                                <span className="font-bold text-[#2f3542]">{c.author}</span>
                              </div>
                              <span className="text-[10px] text-gray-400">{c.date}</span>
                            </div>
                            <p className="text-gray-700 pl-8 font-medium">{c.content}</p>
                          </div>
                        ))}
                      </div>

                      {/* Add Comment Input */}
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="따뜻한 댓글을 남겨주세요 (네이버 클린봇 작동 중)"
                          className="flex-1 px-4 py-2.5 text-xs bg-[#f8f9fa] border border-[#e9ecef] rounded-xl focus:outline-none focus:border-[#03c75a]"
                        />
                        <button 
                          onClick={() => {
                            if (!commentInput.trim()) return;
                            selectedPost.comments.push({
                              id: `c-${Date.now()}`,
                              author: currentUser?.name || '익명 셰프',
                              avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                              date: '방금 전',
                              content: commentInput,
                              likes: 0
                            });
                            setCommentInput('');
                            confetti({ particleCount: 20, spread: 40 });
                          }}
                          className="px-4 py-2 bg-[#03c75a] text-white font-bold text-xs rounded-xl hover:bg-[#02b150]"
                        >
                          등록
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Post List Feed View */
                  <div className="space-y-4">
                    {/* Control Bar: View Switcher & Search */}
                    <div className="bg-white rounded-2xl p-4 border border-[#e9ecef] shadow-sm flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#2f3542]">
                          {categories.find(c => c.id === selectedCategory)?.name || '전체 글'} 
                          <strong className="text-[#ff6b6b] ml-1">({blogPosts.length})</strong>
                        </span>
                      </div>

                      {/* View mode toggle */}
                      <div className="flex items-center gap-1 bg-[#f8f9fa] p-1 rounded-xl border border-gray-200 text-xs">
                        <button
                          onClick={() => setViewMode('feed')}
                          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold ${
                            viewMode === 'feed' ? 'bg-white shadow-xs text-black' : 'text-gray-500'
                          }`}
                        >
                          <Layout className="w-3.5 h-3.5" />
                          블로그형
                        </button>
                        <button
                          onClick={() => setViewMode('album')}
                          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold ${
                            viewMode === 'album' ? 'bg-white shadow-xs text-black' : 'text-gray-500'
                          }`}
                        >
                          <Grid className="w-3.5 h-3.5" />
                          앨범형
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold ${
                            viewMode === 'list' ? 'bg-white shadow-xs text-black' : 'text-gray-500'
                          }`}
                        >
                          <List className="w-3.5 h-3.5" />
                          목록형
                        </button>
                      </div>
                    </div>

                    {/* 1) Feed View (Classic Naver Blog Feed) */}
                    {viewMode === 'feed' && (
                      <div className="space-y-6">
                        {blogPosts.map((post) => (
                          <div 
                            key={post.id} 
                            className="bg-white rounded-2xl border border-[#e9ecef] shadow-sm p-6 sm:p-7 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#ff6b6b]">🍳 집밥 요리</span>
                                <span>•</span>
                                <span>{post.date}</span>
                              </div>
                              <span className="text-[11px] text-gray-400">조회 {post.views}</span>
                            </div>

                            <h3 
                              onClick={() => setSelectedPost(post)}
                              className="text-xl sm:text-2xl font-bold text-[#2f3542] hover:text-[#ff6b6b] cursor-pointer transition-colors"
                            >
                              {post.title}
                            </h3>

                            {post.coverImage && (
                              <div 
                                onClick={() => setSelectedPost(post)}
                                className="my-4 rounded-xl overflow-hidden cursor-pointer max-h-96"
                              >
                                <img 
                                  src={post.coverImage} 
                                  alt={post.title} 
                                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                                />
                              </div>
                            )}

                            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                              {post.snippet || post.content}
                            </p>

                            <div className="flex flex-wrap gap-1 mb-4">
                              {post.tags.map((tag, idx) => (
                                <span key={idx} className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => onLikePost(post.id)}
                                  className="flex items-center gap-1 font-bold text-[#ff6b6b] hover:opacity-80"
                                >
                                  <Heart className="w-4 h-4 fill-[#ff6b6b]" />
                                  공감 {post.likes}
                                </button>
                                <button 
                                  onClick={() => setSelectedPost(post)}
                                  className="flex items-center gap-1 font-bold text-gray-600 hover:text-black"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  댓글 {post.commentsCount || post.comments.length}
                                </button>
                              </div>

                              <button 
                                onClick={() => setSelectedPost(post)}
                                className="text-xs font-bold text-gray-800 hover:text-[#ff6b6b] flex items-center gap-1"
                              >
                                본문 더보기 <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 2) Album Card View */}
                    {viewMode === 'album' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {blogPosts.map((post) => (
                          <div 
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className="bg-white rounded-2xl border border-[#e9ecef] shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                          >
                            <div className="h-44 w-full overflow-hidden bg-gray-100">
                              <img 
                                src={post.coverImage} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-4">
                              <div className="text-[11px] text-[#ff6b6b] font-bold mb-1">레시피 노트</div>
                              <h4 className="text-sm font-bold text-[#2f3542] line-clamp-2 group-hover:text-[#ff6b6b] transition-colors">
                                {post.title}
                              </h4>
                              <p className="text-xs text-gray-500 line-clamp-2 mt-1.5">
                                {post.snippet || post.content}
                              </p>
                              <div className="flex items-center justify-between text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-100">
                                <span>{post.date}</span>
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center gap-0.5 text-[#ff6b6b] font-bold"><Heart className="w-3 h-3 fill-[#ff6b6b]" /> {post.likes}</span>
                                  <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" /> {post.comments.length}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 3) List Table View */}
                    {viewMode === 'list' && (
                      <div className="bg-white rounded-2xl border border-[#e9ecef] shadow-sm overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#f8f9fa] text-gray-600 font-bold border-b border-gray-200">
                            <tr>
                              <th className="py-3 px-4 w-20">분류</th>
                              <th className="py-3 px-4">글 제목</th>
                              <th className="py-3 px-4 w-24 text-center">작성일</th>
                              <th className="py-3 px-4 w-16 text-center">조회</th>
                              <th className="py-3 px-4 w-16 text-center">공감</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium">
                            {blogPosts.map((post) => (
                              <tr 
                                key={post.id} 
                                onClick={() => setSelectedPost(post)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                              >
                                <td className="py-3 px-4 text-gray-500">집밥</td>
                                <td className="py-3 px-4 font-bold text-[#2f3542] hover:text-[#ff6b6b]">
                                  {post.title}
                                  {post.comments.length > 0 && (
                                    <span className="text-[#ff6b6b] ml-1 font-bold">[{post.comments.length}]</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-center text-gray-400">{post.date}</td>
                                <td className="py-3 px-4 text-center text-gray-500">{post.views}</td>
                                <td className="py-3 px-4 text-center text-[#ff6b6b] font-bold">{post.likes}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. SCRAPS TAB */}
            {blogTab === 'scraps' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 border border-[#e9ecef] shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#2f3542]">내 스크랩 보관함</h3>
                    <p className="text-xs text-gray-500 mt-0.5">내가 스크랩한 맛있는 레시피 모음입니다.</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                    총 {bookmarkedRecipes.length}개 보관 중
                  </span>
                </div>

                {bookmarkedRecipes.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 border border-[#e9ecef] text-center text-gray-500 text-sm">
                    <Bookmark className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    아직 스크랩한 레시피가 없습니다. 탐색 탭에서 마음에 드는 레시피를 스크랩해보세요!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {bookmarkedRecipes.map((r) => (
                      <div 
                        key={r.id}
                        className="bg-white rounded-2xl border border-[#e9ecef] p-4 shadow-sm flex gap-3 hover:shadow-md transition-shadow"
                      >
                        <img 
                          src={r.imageUrl} 
                          alt={r.title} 
                          onClick={() => onOpenRecipeDetail(r)}
                          className="w-24 h-24 rounded-xl object-cover cursor-pointer flex-shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-[#ff6b6b]">{r.categoryLabel}</span>
                            <h4 
                              onClick={() => onOpenRecipeDetail(r)}
                              className="text-xs sm:text-sm font-bold text-[#2f3542] line-clamp-1 cursor-pointer hover:text-[#ff6b6b]"
                            >
                              {r.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{r.subtitle}</p>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[11px]">
                            <span className="text-gray-400">⏱ {r.cookTime + r.prepTime}분</span>
                            <button 
                              onClick={() => onToggleBookmark(r.id)}
                              className="text-red-500 hover:underline font-medium text-[10px]"
                            >
                              스크랩 취소
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. MY RECIPES TAB */}
            {blogTab === 'myrecipes' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 border border-[#e9ecef] shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#2f3542]">내가 등록한 레시피</h3>
                    <p className="text-xs text-gray-500 mt-0.5">내가 직접 공유한 레시피와 밀키트 연동 현황입니다.</p>
                  </div>
                  <button 
                    onClick={onOpenCreateRecipe}
                    className="px-3.5 py-1.5 bg-[#ff6b6b] text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm hover:bg-[#ff5252]"
                  >
                    <Plus className="w-4 h-4" />
                    새 레시피 등록
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myRecipes.map((r) => (
                    <div 
                      key={r.id}
                      className="bg-white rounded-2xl border border-[#e9ecef] p-4 shadow-sm flex gap-3 hover:shadow-md transition-shadow"
                    >
                      <img 
                        src={r.imageUrl} 
                        alt={r.title} 
                        onClick={() => onOpenRecipeDetail(r)}
                        className="w-24 h-24 rounded-xl object-cover cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#ff6b6b]">{r.categoryLabel}</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">밀키트 판매중</span>
                          </div>
                          <h4 
                            onClick={() => onOpenRecipeDetail(r)}
                            className="text-xs sm:text-sm font-bold text-[#2f3542] line-clamp-1 cursor-pointer hover:text-[#ff6b6b] mt-1"
                          >
                            {r.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                            <span>❤️ {r.likesCount}</span>
                            <span>📌 {r.scrapsCount}</span>
                            <span>⭐ {r.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[11px]">
                          <span className="font-bold text-emerald-600">₩{(r.mealkitPrice || 12000).toLocaleString()}원</span>
                          <button 
                            onClick={() => onOpenRecipeDetail(r)}
                            className="text-[#ff6b6b] font-bold hover:underline"
                          >
                            상세보기 →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. NEIGHBORS TAB */}
            {blogTab === 'neighbors' && (
              <div className="space-y-4">
                {/* Neighbor Sub Tabs */}
                <div className="bg-white rounded-2xl p-4 border border-[#e9ecef] shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNeighborTab('feed')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        neighborTab === 'feed' ? 'bg-[#03c75a] text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      이웃 새 글 소식
                    </button>
                    <button
                      onClick={() => setNeighborTab('list')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        neighborTab === 'list' ? 'bg-[#03c75a] text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      이웃 목록 ({neighborsList.length})
                    </button>
                    <button
                      onClick={() => setNeighborTab('requests')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                        neighborTab === 'requests' ? 'bg-[#03c75a] text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      받은 이웃 신청
                      {neighborRequests.length > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#ff6b6b] text-white text-[10px] flex items-center justify-center font-bold">
                          {neighborRequests.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Neighbor Feed */}
                {neighborTab === 'feed' && (
                  <div className="space-y-3">
                    {neighborsList.map((n) => (
                      <div key={n.id} className="bg-white rounded-2xl p-4 border border-[#e9ecef] shadow-sm flex items-start gap-3">
                        <img src={n.avatar} alt={n.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#2f3542]">{n.name} <span className="text-gray-400 font-normal">({n.blogTitle})</span></span>
                            <span className="text-gray-400 text-[11px]">{n.lastPostTime}</span>
                          </div>
                          <h4 className="text-sm font-bold text-[#2f3542] mt-1 hover:text-[#03c75a] cursor-pointer">
                            {n.lastPostTitle}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            식재료의 본연의 맛을 살리는 최적의 밸런스와 황금 양념 배합법을 확인해보세요...
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Neighbor List */}
                {neighborTab === 'list' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {neighborsList.map((n) => (
                      <div key={n.id} className="bg-white rounded-2xl p-4 border border-[#e9ecef] shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={n.avatar} alt={n.name} className="w-12 h-12 rounded-full object-cover" />
                          <div>
                            <div className="text-xs font-bold text-[#2f3542]">{n.name}</div>
                            <div className="text-[11px] text-gray-500 truncate max-w-[150px]">{n.blogTitle}</div>
                            <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.2 rounded font-semibold">서로이웃</span>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 rounded-lg">
                          방문
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Neighbor Requests */}
                {neighborTab === 'requests' && (
                  <div className="space-y-3">
                    {neighborRequests.length === 0 ? (
                      <div className="bg-white rounded-2xl p-8 text-center text-xs text-gray-500">
                        받은 이웃 신청이 없습니다.
                      </div>
                    ) : (
                      neighborRequests.map((req) => (
                        <div key={req.id} className="bg-white rounded-2xl p-5 border border-[#e9ecef] shadow-sm">
                          <div className="flex items-center gap-3">
                            <img src={req.avatar} alt={req.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                              <div className="text-xs font-bold text-[#2f3542]">{req.name}</div>
                              <div className="text-[11px] text-gray-500">{req.blogTitle}</div>
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-700">
                            "{req.message}"
                          </div>
                          <div className="flex justify-end gap-2 mt-3">
                            <button 
                              onClick={() => setNeighborRequests(neighborRequests.filter(r => r.id !== req.id))}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold rounded-lg text-gray-600"
                            >
                              거절
                            </button>
                            <button 
                              onClick={() => handleAcceptNeighbor(req.id)}
                              className="px-4 py-1.5 bg-[#03c75a] hover:bg-[#02b150] text-xs font-bold rounded-lg text-white"
                            >
                              수락
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 5. GUESTBOOK TAB */}
            {blogTab === 'guestbook' && (
              <div className="space-y-5">
                {/* Write Guestbook Form */}
                <div className="bg-white rounded-2xl p-5 border border-[#e9ecef] shadow-sm">
                  <h3 className="text-sm font-bold text-[#2f3542] mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#03c75a]" />
                    안부글 남기기
                  </h3>
                  <form onSubmit={handleAddGuestbook} className="space-y-3">
                    <textarea
                      value={newGuestMessage}
                      onChange={(e) => setNewGuestMessage(e.target.value)}
                      placeholder="블로그 주인장에게 따뜻한 안부 한마디를 남겨주세요."
                      rows={3}
                      className="w-full p-3 text-xs bg-[#f8f9fa] border border-[#e9ecef] rounded-xl focus:outline-none focus:border-[#03c75a]"
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={isSecretMessage}
                          onChange={(e) => setIsSecretMessage(e.target.checked)}
                          className="rounded text-[#03c75a]"
                        />
                        <Lock className="w-3 h-3 text-gray-400" />
                        비밀글로 작성
                      </label>

                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#03c75a] hover:bg-[#02b150] text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        안부글 등록
                      </button>
                    </div>
                  </form>
                </div>

                {/* Guestbook List */}
                <div className="space-y-4">
                  {guestbookList.map((entry) => (
                    <div key={entry.id} className="bg-white rounded-2xl p-5 border border-[#e9ecef] shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <img src={entry.authorAvatar} alt={entry.author} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <span className="text-xs font-bold text-[#2f3542]">{entry.author}</span>
                            {entry.isSecret && (
                              <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                                <Lock className="w-2.5 h-2.5" /> 비밀글
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-400">{entry.date}</span>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed font-medium">
                        {entry.content}
                      </p>

                      {/* Owner Reply */}
                      {entry.reply && (
                        <div className="bg-[#f8f9fa] rounded-xl p-3.5 text-xs text-gray-700 space-y-1 border-l-2 border-[#03c75a]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#03c75a]">블로그 주인 (민서 셰프)</span>
                            <span className="text-gray-400">{entry.replyDate}</span>
                          </div>
                          <p className="text-gray-600">{entry.reply}</p>
                        </div>
                      )}

                      {/* Reply button for blog owner */}
                      {!entry.reply && (
                        <div>
                          {activeReplyId === entry.id ? (
                            <div className="mt-2 space-y-2">
                              <textarea
                                value={replyTextMap[entry.id] || ''}
                                onChange={(e) => setReplyTextMap({ ...replyTextMap, [entry.id]: e.target.value })}
                                placeholder="답글을 입력하세요..."
                                rows={2}
                                className="w-full p-2.5 text-xs bg-[#f8f9fa] border border-[#e9ecef] rounded-xl focus:outline-none focus:border-[#03c75a]"
                              />
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => setActiveReplyId(null)}
                                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium"
                                >
                                  취소
                                </button>
                                <button 
                                  onClick={() => handleSendReply(entry.id)}
                                  className="px-3 py-1 bg-[#03c75a] text-white text-xs rounded-lg font-bold"
                                >
                                  답글 달기
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setActiveReplyId(entry.id)}
                              className="text-[11px] font-bold text-gray-500 hover:text-[#03c75a] flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" /> 답글 쓰기
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. STATS TAB */}
            {blogTab === 'stats' && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl p-6 border border-[#e9ecef] shadow-sm">
                  <h3 className="text-base font-bold text-[#2f3542] mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    블로그 방문자 및 유입 통계
                  </h3>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 font-medium">오늘 방문자 (Today)</div>
                      <div className="text-xl font-extrabold text-[#ff6b6b] mt-1">1,428명</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 font-medium">어제 방문자</div>
                      <div className="text-xl font-extrabold text-[#2f3542] mt-1">2,150명</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 font-medium">누적 방문자 (Total)</div>
                      <div className="text-xl font-extrabold text-blue-600 mt-1">58,940명</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 font-medium">이웃 증감</div>
                      <div className="text-xl font-extrabold text-emerald-600 mt-1">+24명 /주</div>
                    </div>
                  </div>

                  {/* Weekly Visitor Chart (Visual Bars) */}
                  <h4 className="text-xs font-bold text-gray-700 mb-3">최근 7일간 일별 방문자 추이</h4>
                  <div className="flex items-end justify-between h-40 bg-[#f8f9fa] rounded-xl p-4 gap-2">
                    {[
                      { day: '월 (08.18)', count: 1840, height: '70%' },
                      { day: '화 (08.19)', count: 1920, height: '75%' },
                      { day: '수 (08.20)', count: 2300, height: '90%' },
                      { day: '목 (08.21)', count: 1750, height: '65%' },
                      { day: '금 (08.22)', count: 2150, height: '82%' },
                      { day: '토 (08.23)', count: 2600, height: '100%' },
                      { day: '오늘 (08.24)', count: 1428, height: '55%' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                        <span className="text-[10px] font-bold text-[#ff6b6b] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                          {item.count}
                        </span>
                        <div 
                          style={{ height: item.height }} 
                          className="w-full max-w-[28px] bg-gradient-to-t from-[#ff6b6b] to-[#ff8787] rounded-t-md transition-all group-hover:brightness-110"
                        />
                        <span className="text-[10px] text-gray-500 mt-2 whitespace-nowrap">{item.day}</span>
                      </div>
                    ))}
                  </div>

                  {/* Search inflow keywords */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-700 mb-3">인기 유입 검색어 TOP 5</h4>
                    <div className="space-y-2 text-xs">
                      {[
                        { keyword: '김치찌개 맛있게 끓이는법 황금레시피', percent: '34%' },
                        { keyword: '노오븐 티라미수 마스카포네 크림', percent: '22%' },
                        { keyword: '에어프라이어 통삼겹 바베큐 시간', percent: '18%' },
                        { keyword: '마녀스프 다이어트 식단', percent: '14%' },
                        { keyword: '바스크 치즈케이크 굽는법', percent: '12%' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                          <span className="font-bold text-gray-700">{idx + 1}. {item.keyword}</span>
                          <span className="font-extrabold text-[#ff6b6b]">{item.percent}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SETTINGS & SKIN CUSTOMIZER */}
            {blogTab === 'settings' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e9ecef] shadow-sm space-y-6">
                <h3 className="text-base font-bold text-[#2f3542] pb-3 border-b border-gray-100 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#ff6b6b]" />
                  블로그 꾸미기 & 정보 설정
                </h3>

                {/* Blog Info Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">블로그 제목</label>
                    <input 
                      type="text" 
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      className="w-full p-2.5 text-xs bg-[#f8f9fa] border border-[#e9ecef] rounded-xl focus:outline-none focus:border-[#ff6b6b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">블로그 소개글 (서브타이틀)</label>
                    <input 
                      type="text" 
                      value={blogSubtitle}
                      onChange={(e) => setBlogSubtitle(e.target.value)}
                      className="w-full p-2.5 text-xs bg-[#f8f9fa] border border-[#e9ecef] rounded-xl focus:outline-none focus:border-[#ff6b6b]"
                    />
                  </div>

                  {/* Skin Palette Picker */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">블로그 스킨 테마</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'default', name: '클래식 다크', color: 'bg-slate-800' },
                        { id: 'mint', name: '스위트 민트', color: 'bg-emerald-500' },
                        { id: 'warm', name: '웜 코랄', color: 'bg-orange-500' },
                        { id: 'forest', name: '딥 포레스트', color: 'bg-sky-700' },
                        { id: 'lavender', name: '라벤더 퍼플', color: 'bg-purple-600' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSkinTheme(t.id as any)}
                          className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                            skinTheme === t.id ? 'border-black ring-2 ring-black/10' : 'border-gray-200'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${t.color}`} />
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cover Preset Picker */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">헤더 커버 이미지 변경</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1547496502-affa22d38842?w=1600&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&auto=format&fit=crop&q=80',
                      ].map((imgUrl, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setCoverImage(imgUrl)}
                          className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 ${
                            coverImage === imgUrl ? 'border-[#ff6b6b]' : 'border-transparent'
                          }`}
                        >
                          <img src={imgUrl} alt="Cover preset" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => {
                      confetti({ particleCount: 30, spread: 50 });
                      alert('블로그 설정이 저장되었습니다! ✨');
                    }}
                    className="px-6 py-2.5 bg-[#2f3542] hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    설정 저장하기
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};
