import React, { useState } from 'react';
import { 
  Recipe, 
  BlogPost, 
  UserProfile, 
  NoticeItem, 
  BannerItem, 
  ReportedItem 
} from '../types';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  BookOpen, 
  Home, 
  Users, 
  AlertTriangle, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Eye, 
  Search, 
  TrendingUp, 
  Sliders, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle,
  Database,
  ArrowUpRight,
  Sparkles,
  Server,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  recipes: Recipe[];
  blogPosts: BlogPost[];
  onClose?: () => void;
  onUpdateRecipes?: (newRecipes: Recipe[]) => void;
  onUpdateBlogPosts?: (newPosts: BlogPost[]) => void;
}

const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'n-1',
    title: '[공지] Kooking 2.0 대규모 업데이트 안내 (80종 레시피 & 블로그 시스템)',
    category: '공지',
    date: '2026.08.24',
    views: 3420,
    author: '시스템 관리자',
    isPinned: true,
    content: '새로운 50종의 고화질 레시피와 네이버 블로그 스타일의 마이페이지 기능이 정식 오픈되었습니다.'
  },
  {
    id: 'n-2',
    title: '[이벤트] 첫 레시피 등록 시 10,000 포인트 증정 이벤트',
    category: '이벤트',
    date: '2026.08.20',
    views: 1890,
    author: '운영팀',
    isPinned: true,
    content: '나만의 시크릿 레시피를 공유하고 밀키트 런칭 지원금을 받아보세요!'
  },
  {
    id: 'n-3',
    title: '[점검] 클라우드 분산 캐시 서버 정기 점검 완료',
    category: '점검',
    date: '2026.08.15',
    views: 890,
    author: '인프라팀',
    isPinned: false,
    content: 'Redis 분산 캐시 클러스터 튜닝으로 응답 속도가 35% 향상되었습니다.'
  }
];

const INITIAL_BANNERS: BannerItem[] = [
  {
    id: 'b-1',
    title: '미슐랭 셰프와 함께하는 주말 쿠킹 라이브',
    subtitle: '실시간 양방향 코칭과 즉석 밀키트 할인 쿠폰 증정',
    badgeText: 'HOT LIVE',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
    linkUrl: '#live',
    bgColor: '#ff6b6b',
    isActive: true,
    order: 1
  },
  {
    id: 'b-2',
    title: '제철 식재료로 차리는 여름철 건강 보양 밥상',
    subtitle: '원기 회복을 돕는 초간단 삼계탕 & 콩나물국밥 특집',
    badgeText: 'SEASONAL',
    imageUrl: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=800&auto=format&fit=crop&q=80',
    linkUrl: '#recipes',
    bgColor: '#4ecdc4',
    isActive: true,
    order: 2
  }
];

const INITIAL_REPORTS: ReportedItem[] = [
  {
    id: 'rep-1',
    type: 'comment',
    targetId: 'c-901',
    targetTitle: '불법 광고 링크 스팸 댓글',
    authorName: '스팸봇_992',
    reporterName: '요리연구가 김민서',
    reason: '광고 및 스팸 홍보성 댓글',
    date: '2026.08.24 14:10',
    status: 'pending'
  },
  {
    id: 'rep-2',
    type: 'post',
    targetId: 'post-103',
    targetTitle: '요리와 무관한 홍보성 게시글',
    authorName: '홍보요정',
    reporterName: '백선생 키친연구소',
    reason: '카테고리 불일치 및 영리 목적 광고',
    date: '2026.08.23 21:30',
    status: 'pending'
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  recipes,
  blogPosts,
  onClose,
  onUpdateRecipes,
  onUpdateBlogPosts
}) => {
  // Admin Tabs: 'overview' | 'community' | 'homepage' | 'users' | 'reports' | 'system'
  const [adminTab, setAdminTab] = useState<'overview' | 'community' | 'homepage' | 'users' | 'reports' | 'system'>('overview');

  // Notices & Banners State
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS);
  const [reports, setReports] = useState<ReportedItem[]>(INITIAL_REPORTS);

  // New Notice Modal / Input
  const [isNoticeFormOpen, setIsNoticeFormOpen] = useState<boolean>(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState<string>('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'공지' | '이벤트' | '업데이트' | '점검'>('공지');
  const [newNoticeContent, setNewNoticeContent] = useState<string>('');
  const [newNoticePinned, setNewNoticePinned] = useState<boolean>(false);

  // New Banner Modal / Input
  const [isBannerFormOpen, setIsBannerFormOpen] = useState<boolean>(false);
  const [newBannerTitle, setNewBannerTitle] = useState<string>('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState<string>('');
  const [newBannerBadge, setNewBannerBadge] = useState<string>('EVENT');
  const [newBannerImg, setNewBannerImg] = useState<string>('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80');

  // Community search & action
  const [communitySearch, setCommunitySearch] = useState<string>('');

  // Handlers
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim()) return;
    const item: NoticeItem = {
      id: `n-${Date.now()}`,
      title: newNoticeTitle,
      category: newNoticeCategory,
      date: new Date().toLocaleDateString('ko-KR'),
      views: 1,
      author: '시스템 관리자',
      isPinned: newNoticePinned,
      content: newNoticeContent
    };
    setNotices([item, ...notices]);
    setIsNoticeFormOpen(false);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(notices.filter(n => n.id !== id));
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim()) return;
    const banner: BannerItem = {
      id: `b-${Date.now()}`,
      title: newBannerTitle,
      subtitle: newBannerSubtitle,
      badgeText: newBannerBadge,
      imageUrl: newBannerImg,
      linkUrl: '#',
      bgColor: '#ff6b6b',
      isActive: true,
      order: banners.length + 1
    };
    setBanners([...banners, banner]);
    setIsBannerFormOpen(false);
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleToggleBannerActive = (id: string) => {
    setBanners(banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const handleDeleteBanner = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
  };

  const handleResolveReport = (id: string, action: 'resolved' | 'dismissed') => {
    setReports(reports.map(r => r.id === id ? { ...r, status: action } : r));
    alert(`신고 건이 ${action === 'resolved' ? '처리(삭제 및 제재)' : '기각'}되었습니다.`);
  };

  return (
    <div className="min-h-screen bg-[#1e222d] text-gray-100 pb-20 font-sans">
      
      {/* Top Header Bar */}
      <header className="bg-[#2f3542] border-b border-gray-700 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-white">Kooking Admin Center</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/40">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-[11px] text-gray-400">커뮤니티 및 홈페이지 통합 운영 관리 시스템</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-300 bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>서버 정상 가동 중 (응답 14ms)</span>
            </div>
            {onClose && (
              <button 
                onClick={onClose}
                className="px-3.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-bold transition-colors"
              >
                관리자 닫기
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Sub-Header */}
      <div className="bg-[#262c38] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none text-xs font-bold">
            <button
              onClick={() => setAdminTab('overview')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                adminTab === 'overview' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              운영 개요
            </button>

            <button
              onClick={() => setAdminTab('community')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                adminTab === 'community' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              커뮤니티 & 블로그 관리 ({blogPosts.length})
            </button>

            <button
              onClick={() => setAdminTab('homepage')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                adminTab === 'homepage' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Home className="w-4 h-4 text-amber-400" />
              홈페이지 & 배너 관리 ({banners.length})
            </button>

            <button
              onClick={() => setAdminTab('reports')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                adminTab === 'reports' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              신고 및 제재 관리
              {reports.filter(r => r.status === 'pending').length > 0 && (
                <span className="w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {reports.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setAdminTab('users')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                adminTab === 'users' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Users className="w-4 h-4 text-blue-400" />
              회원 & 셰프 권한 관리
            </button>

            <button
              onClick={() => setAdminTab('system')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                adminTab === 'system' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Settings className="w-4 h-4 text-gray-400" />
              시스템 설정 & 캐시
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* 1. OVERVIEW DASHBOARD */}
        {adminTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#2f3542] rounded-2xl p-5 border border-gray-700 shadow-sm">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                  <span>등록된 레시피 수</span>
                  <span className="text-emerald-400 font-bold">+50건 신규</span>
                </div>
                <div className="text-3xl font-black text-white mt-2">
                  {recipes.length} <span className="text-base font-normal text-gray-400">개</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-2">한식, 양식, 아시안, 다이어트, 베이킹</div>
              </div>

              <div className="bg-[#2f3542] rounded-2xl p-5 border border-gray-700 shadow-sm">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                  <span>블로그 커뮤니티 글</span>
                  <span className="text-blue-400 font-bold">+18건 오늘</span>
                </div>
                <div className="text-3xl font-black text-white mt-2">
                  {blogPosts.length} <span className="text-base font-normal text-gray-400">건</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-2">스마트에디터 작성 & 공감 활성화</div>
              </div>

              <div className="bg-[#2f3542] rounded-2xl p-5 border border-gray-700 shadow-sm">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                  <span>오늘 총 방문자 (PV)</span>
                  <span className="text-purple-400 font-bold">▲ 14.8%</span>
                </div>
                <div className="text-3xl font-black text-white mt-2">
                  14,820 <span className="text-base font-normal text-gray-400">회</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-2">평균 체류시간 4분 32초</div>
              </div>

              <div className="bg-[#2f3542] rounded-2xl p-5 border border-gray-700 shadow-sm">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                  <span>밀키트 당일 주문액</span>
                  <span className="text-amber-400 font-bold">84건 결제</span>
                </div>
                <div className="text-3xl font-black text-amber-400 mt-2">
                  ₩2,480,000
                </div>
                <div className="text-[11px] text-gray-400 mt-2">정산 예정액 ₩2,232,000</div>
              </div>
            </div>

            {/* Quick Actions & System Status Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Notices & Announcements Manager */}
              <div className="lg:col-span-2 bg-[#2f3542] rounded-2xl p-6 border border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-white">공지사항 & 이벤트 관리</h3>
                  </div>
                  <button
                    onClick={() => setIsNoticeFormOpen(true)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    새 공지 작성
                  </button>
                </div>

                {isNoticeFormOpen && (
                  <form onSubmit={handleAddNotice} className="mb-4 p-4 bg-gray-800 rounded-xl space-y-3 border border-gray-600">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-3">
                        <input 
                          type="text" 
                          placeholder="공지사항 제목을 입력하세요"
                          value={newNoticeTitle}
                          onChange={(e) => setNewNoticeTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <select 
                          value={newNoticeCategory}
                          onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white"
                        >
                          <option value="공지">공지</option>
                          <option value="이벤트">이벤트</option>
                          <option value="업데이트">업데이트</option>
                          <option value="점검">점검</option>
                        </select>
                      </div>
                    </div>
                    <textarea 
                      placeholder="공지 상세 내용을 입력하세요"
                      value={newNoticeContent}
                      onChange={(e) => setNewNoticeContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={newNoticePinned}
                          onChange={(e) => setNewNoticePinned(e.target.checked)}
                          className="rounded text-amber-500"
                        />
                        상단 고정 공지로 등록
                      </label>
                      <div className="flex gap-2">
                        <button 
                          type="button" 
                          onClick={() => setIsNoticeFormOpen(false)}
                          className="px-3 py-1.5 bg-gray-700 text-xs rounded-lg text-gray-300"
                        >
                          취소
                        </button>
                        <button 
                          type="submit" 
                          className="px-4 py-1.5 bg-amber-500 text-black font-bold text-xs rounded-lg hover:bg-amber-400"
                        >
                          등록하기
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {notices.map((n) => (
                    <div key={n.id} className="p-3.5 bg-gray-800/80 rounded-xl flex items-center justify-between text-xs border border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          n.category === '공지' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          n.category === '이벤트' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {n.category}
                        </span>
                        {n.isPinned && (
                          <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">📌 상단고정</span>
                        )}
                        <span className="font-bold text-gray-200">{n.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <span>{n.date}</span>
                        <span>조회 {n.views}</span>
                        <button 
                          onClick={() => handleDeleteNotice(n.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 1 Col: Server & Cache Health Monitor */}
              <div className="bg-[#2f3542] rounded-2xl p-6 border border-gray-700 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-700">
                  <Server className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">서버 인프라 상태</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-gray-800 rounded-lg">
                    <span className="text-gray-400">Node Express Server</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> 정상 (Port 3000)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-gray-800 rounded-lg">
                    <span className="text-gray-400">Redis In-Memory Cache</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> 적중률 94.2%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-gray-800 rounded-lg">
                    <span className="text-gray-400">Gemini 2.5 AI Engine</span>
                    <span className="text-purple-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> 연결됨 (Auto-Prompt)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-gray-800 rounded-lg">
                    <span className="text-gray-400">PWA 오프라인 ServiceWorker</span>
                    <span className="text-blue-400 font-bold">Ready (v2.4.0)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      confetti({ particleCount: 20, spread: 40 });
                      alert('전체 캐시가 성공적으로 갱신되었습니다! 🚀');
                    }}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <Database className="w-3.5 h-3.5" />
                    전체 레시피 캐시 갱신 (Purge Cache)
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. COMMUNITY & BLOG MODERATION */}
        {adminTab === 'community' && (
          <div className="bg-[#2f3542] rounded-2xl p-6 border border-gray-700 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-700">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  커뮤니티 게시글 & 댓글 모니터링
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">부적절한 게시글 숨김, 삭제 및 우수 블로그 게시글을 추천 설정합니다.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="게시글 검색..." 
                  value={communitySearch}
                  onChange={(e) => setCommunitySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-3">
              {blogPosts.map((post) => (
                <div key={post.id} className="p-4 bg-gray-800/90 rounded-xl border border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img src={post.coverImage} alt={post.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-purple-400">{post.author.name}</span>
                        <span className="text-gray-400">• {post.date}</span>
                        <span className="text-gray-400">• 조회 {post.views}</span>
                        <span className="text-red-400">• 공감 {post.likes}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{post.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{post.snippet}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                      onClick={() => alert(`'${post.title}' 게시글이 메인 추천 포스트로 설정되었습니다.`)}
                      className="px-3 py-1.5 bg-purple-600/30 text-purple-300 hover:bg-purple-600/50 border border-purple-500/40 rounded-lg text-xs font-bold"
                    >
                      메인 추천
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm(`'${post.title}' 게시글을 비공개 조치하시겠습니까?`)) {
                          alert('게시글이 비공개 처리되었습니다.');
                        }
                      }}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-xs font-bold"
                    >
                      숨김
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm(`'${post.title}' 게시글을 영구 삭제하시겠습니까?`)) {
                          if (onUpdateBlogPosts) {
                            onUpdateBlogPosts(blogPosts.filter(p => p.id !== post.id));
                          }
                          alert('게시글이 삭제되었습니다.');
                        }
                      }}
                      className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. HOMEPAGE & BANNER MANAGER */}
        {adminTab === 'homepage' && (
          <div className="bg-[#2f3542] rounded-2xl p-6 border border-gray-700 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-700">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-amber-400" />
                  홈페이지 메인 프로모션 배너 관리
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">메인 상단 히어로 배너 슬라이더에 노출할 프로모션 배너를 등록하고 순서를 변경합니다.</p>
              </div>

              <button
                onClick={() => setIsBannerFormOpen(true)}
                className="px-3.5 py-1.5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                새 배너 추가
              </button>
            </div>

            {isBannerFormOpen && (
              <form onSubmit={handleAddBanner} className="p-5 bg-gray-800 rounded-xl space-y-3 border border-gray-600">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 mb-1 block">배지 텍스트</label>
                    <input 
                      type="text" 
                      value={newBannerBadge}
                      onChange={(e) => setNewBannerBadge(e.target.value)}
                      placeholder="예: HOT EVENT"
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-gray-400 mb-1 block">배너 메인 타이틀</label>
                    <input 
                      type="text" 
                      value={newBannerTitle}
                      onChange={(e) => setNewBannerTitle(e.target.value)}
                      placeholder="예: 주말 파스타 쿠킹 클래스 OPEN"
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 mb-1 block">서브 카피</label>
                  <input 
                    type="text" 
                    value={newBannerSubtitle}
                    onChange={(e) => setNewBannerSubtitle(e.target.value)}
                    placeholder="배너 상세 설명 문구"
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 mb-1 block">이미지 URL</label>
                  <input 
                    type="text" 
                    value={newBannerImg}
                    onChange={(e) => setNewBannerImg(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsBannerFormOpen(false)}
                    className="px-3 py-1.5 bg-gray-700 text-xs rounded-lg text-gray-300"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-1.5 bg-[#ff6b6b] text-white font-bold text-xs rounded-lg hover:bg-[#ff5252]"
                  >
                    배너 등록
                  </button>
                </div>
              </form>
            )}

            {/* Banner List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {banners.map((b) => (
                <div key={b.id} className="p-4 bg-gray-800 rounded-xl border border-gray-700 flex flex-col justify-between space-y-3">
                  <div className="flex gap-3">
                    <img src={b.imageUrl} alt={b.title} className="w-24 h-20 rounded-lg object-cover flex-shrink-0" />
                    <div>
                      <span className="px-2 py-0.5 rounded bg-[#ff6b6b]/20 text-[#ff6b6b] text-[10px] font-bold">
                        {b.badgeText}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1">{b.title}</h4>
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{b.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700 text-xs">
                    <label className="flex items-center gap-1.5 text-gray-300 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={b.isActive}
                        onChange={() => handleToggleBannerActive(b.id)}
                        className="rounded text-emerald-500"
                      />
                      노출 활성화
                    </label>
                    <button 
                      onClick={() => handleDeleteBanner(b.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. REPORTS & PENALTIES */}
        {adminTab === 'reports' && (
          <div className="bg-[#2f3542] rounded-2xl p-6 border border-gray-700 shadow-sm space-y-4">
            <div className="pb-4 border-b border-gray-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                신고 내역 접수 및 제재 관리
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">사용자 신고 접수 건을 검토하여 즉시 삭제 또는 경고 조치를 처리합니다.</p>
            </div>

            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 bg-gray-800 rounded-xl border border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">
                        {rep.type === 'comment' ? '댓글 신고' : '게시글 신고'}
                      </span>
                      <span className="text-gray-400">{rep.date}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        rep.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {rep.status === 'pending' ? '처리 대기중' : '처리 완료'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">대상품목: {rep.targetTitle}</h4>
                    <p className="text-xs text-red-300 mt-0.5">신고사유: {rep.reason} (신고자: {rep.reporterName} / 피신고자: {rep.authorName})</p>
                  </div>

                  {rep.status === 'pending' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button 
                        onClick={() => handleResolveReport(rep.id, 'dismissed')}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs font-bold"
                      >
                        기각 (이상없음)
                      </button>
                      <button 
                        onClick={() => handleResolveReport(rep.id, 'resolved')}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold"
                      >
                        삭제 및 경고부여
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. USERS & CHEFS */}
        {adminTab === 'users' && (
          <div className="bg-[#2f3542] rounded-2xl p-6 border border-gray-700 shadow-sm space-y-4">
            <div className="pb-4 border-b border-gray-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                회원 권한 및 셰프 인증 관리
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">인플루언서 셰프 배지 발급 및 관리자 권한을 관리합니다.</p>
            </div>

            <div className="divide-y divide-gray-700 text-xs">
              {[
                { name: '요리연구가 김민서', email: 'minseo@kooking.me', role: 'Super Admin / Master Chef', posts: 14, status: 'Active' },
                { name: '백선생 키친연구소', email: 'chef_baek@kooking.me', role: 'Verified Chef', posts: 28, status: 'Active' },
                { name: '손맛장인 김순옥', email: 'soonok@kooking.me', role: 'Verified Chef', posts: 19, status: 'Active' },
                { name: '파티시에 유진', email: 'eugene_pastry@kooking.me', role: 'Verified Chef', posts: 12, status: 'Active' },
                { name: '일반회원_쿡스타', email: 'cook_star@gmail.com', role: 'VIP Member', posts: 3, status: 'Active' }
              ].map((user, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{user.name} <span className="text-gray-400 text-xs font-normal">({user.email})</span></div>
                    <div className="text-purple-300 text-[11px] mt-0.5 font-semibold">역할: {user.role} | 작성글: {user.posts}건</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => alert(`${user.name} 님에게 '공식 인증 셰프' 배지를 부여했습니다.`)}
                      className="px-3 py-1 bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-bold hover:bg-purple-600/50"
                    >
                      셰프 승인
                    </button>
                    <button 
                      onClick={() => alert(`${user.name} 회원 상태 변경 완료`)}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-600"
                    >
                      권한 수정
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. SYSTEM & CACHE */}
        {adminTab === 'system' && (
          <div className="bg-[#2f3542] rounded-2xl p-6 border border-gray-700 shadow-sm space-y-5">
            <div className="pb-4 border-b border-gray-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-400" />
                시스템 데이터 및 환경 설정
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-gray-800 rounded-xl space-y-2 border border-gray-700">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-400" /> 레시피 데이터베이스 백업
                </h4>
                <p className="text-gray-400 text-[11px]">80개 전 레시피 및 재료 영양성분 데이터를 JSON 또는 CSV로 내보냅니다.</p>
                <button 
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(recipes, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `kooking_recipes_backup_${Date.now()}.json`;
                    a.click();
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                >
                  JSON 백업 다운로드
                </button>
              </div>

              <div className="p-4 bg-gray-800 rounded-xl space-y-2 border border-gray-700">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-400" /> 긴급 점검 모드 (Maintenance Mode)
                </h4>
                <p className="text-gray-400 text-[11px]">일반 사용자의 접근을 차단하고 점검 안내 페이지로 전환합니다.</p>
                <button 
                  onClick={() => alert('점검 모드 설정 토글됨')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg"
                >
                  점검 모드 전환
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
