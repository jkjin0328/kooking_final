import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, Check, Sparkles } from 'lucide-react';
import { UserProfile, Language } from '../types';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSocialLogin = (provider: 'kakao' | 'naver' | 'google') => {
    const socialNames: Record<string, string> = {
      kakao: '카카오 요리사',
      naver: '네이버 블로거',
      google: '구글 셰프',
    };

    const user: UserProfile = {
      id: `user-${provider}-${Date.now()}`,
      name: socialNames[provider] || '미식가',
      email: `${provider}_user@kooking.com`,
      avatar: provider === 'naver' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      badge: provider === 'naver' ? '인플루언서' : '쿠킹 크리에이터',
      scraps: ['recipe-1', 'recipe-2'],
      likedRecipes: ['recipe-1'],
    };

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    onLoginSuccess(user);
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const user: UserProfile = {
      id: `user-email-${Date.now()}`,
      name: name.trim() || email.split('@')[0] || '쿠킹 셰프',
      email: email.trim(),
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      badge: '골드 셰프',
      scraps: ['recipe-1', 'recipe-3'],
      likedRecipes: ['recipe-1', 'recipe-2'],
    };

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#e9ecef] animate-scale-up">
        
        {/* Header */}
        <div className="p-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-[#ff6b6b] tracking-tight">Kooking</span>
            <span className="text-xs bg-[#ff6b6b]/10 text-[#ff6b6b] px-2 py-0.5 rounded-full font-bold">
              간편 로그인
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 space-y-5">
          <div className="text-center">
            <h3 className="text-lg font-bold text-[#2f3542]">
              {mode === 'login' ? 'Kooking에 오신 것을 환영합니다!' : 'Kooking 셰프 회원가입'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              로그인하고 나만의 레시피 스크랩과 블로그 포스팅을 시작하세요.
            </p>
          </div>

          {/* 3대 소셜 로그인 버튼 (카카오, 네이버, 구글) */}
          <div className="space-y-2">
            <button
              onClick={() => handleSocialLogin('kakao')}
              className="w-full py-3 px-4 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <span className="text-sm">🟡</span>
              <span>카카오 1초 간편 로그인</span>
            </button>

            <button
              onClick={() => handleSocialLogin('naver')}
              className="w-full py-3 px-4 bg-[#03C75A] hover:bg-[#02b351] text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <span className="text-xs font-black bg-white text-[#03C75A] px-1 rounded">N</span>
              <span>네이버 아이디로 로그인</span>
            </button>

            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-2xs transition-all"
            >
              <span className="text-sm">🌐</span>
              <span>Google 계정으로 계속하기</span>
            </button>
          </div>

          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-3 text-[11px] text-gray-400 font-medium">또는 이메일 로그인</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <input
                  type="text"
                  placeholder="닉네임 / 셰프명"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#ff6b6b]"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                required
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#ff6b6b]"
              />
            </div>

            <div>
              <input
                type="password"
                required
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#ff6b6b]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-[#ff6b6b]/20 transition-all"
            >
              {mode === 'login' ? '이메일로 로그인' : '무료 회원가입 완료'}
            </button>
          </form>

          <div className="text-center pt-1">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-xs text-gray-500 hover:text-[#ff6b6b] font-medium"
            >
              {mode === 'login' ? '계정이 없으신가요? 회원가입하기' : '이미 계정이 있으신가요? 로그인'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
