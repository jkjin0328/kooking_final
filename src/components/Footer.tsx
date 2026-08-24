import React from 'react';
import { ChefHat, Heart, Shield, Code, Github, Terminal, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Language } from '../types';
import { I18N_DICTIONARY } from '../locales/i18n';

interface FooterProps {
  onOpenBackendDocs: () => void;
  onOpenBlog: () => void;
  lang?: Language;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBackendDocs, onOpenBlog, lang = 'ko' }) => {
  const t = I18N_DICTIONARY[lang || 'ko'] || I18N_DICTIONARY.ko;

  return (
    <footer className="bg-[#2f3542] text-gray-300 pt-12 pb-8 border-t border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-700/60">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <ChefHat className="w-6 h-6 text-[#ff6b6b]" />
              <span className="text-xl font-black tracking-tight">Kooking</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              요리의 모든 순간을 스마트하게 연결하는 대한민국 대표 프리미엄 레시피 & 푸드로그 플랫폼
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[11px] bg-[#ff6b6b]/20 text-[#ff6b6b] px-2.5 py-1 rounded-full font-bold">
                AI Powered by Gemini
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">주요 서비스</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#recipes-grid" className="hover:text-[#ff6b6b] transition-colors">🍳 테마별 레시피 탐색</a></li>
              <li><button onClick={onOpenBlog} className="hover:text-[#ff6b6b] transition-colors text-left">📖 블로그 커뮤니티 피드</button></li>
              <li><span className="hover:text-[#ff6b6b] cursor-pointer">🥑 맞춤 다이어트 식단</span></li>
              <li><span className="hover:text-[#ff6b6b] cursor-pointer">📦 신선 밀키트 새벽배송</span></li>
            </ul>
          </div>

          {/* Col 3: Smart Tech */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">스마트 쿠킹 기술</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><span>🎙️ Web Speech 음성 제어 요리모드</span></li>
              <li><span>⏱️ 인터랙티브 조리 타이머 & 사운드</span></li>
              <li><span>📊 Chart.js 3대 영양소 분석</span></li>
              <li><span>🎨 HTML5 Canvas 이미지 보정 에디터</span></li>
            </ul>
          </div>

          {/* Col 4: Backend Specs & Dev Docs */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">아키텍처 명세</h4>
            <p className="text-xs text-gray-400">
              30종 RESTful 엔드포인트와 분산 클라우드 시스템 아키텍처 및 ERD 명세서입니다.
            </p>
            <button
              id="footer-backend-docs-btn"
              onClick={onOpenBackendDocs}
              className="w-full py-2.5 px-3 bg-white/10 hover:bg-[#ff6b6b] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all border border-white/20"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{t.backendSpecs} (30 APIs)</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <div className="flex items-center gap-1">
            <span>© 2026 Kooking Platform. All rights reserved. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#ff6b6b] fill-[#ff6b6b] inline" />
            <span>for chefs and home cooks.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hover:text-gray-300 cursor-pointer">이용약관</span>
            <span className="hover:text-gray-300 cursor-pointer">개인정보처리방침</span>
            <span className="hover:text-gray-300 cursor-pointer">고객센터</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
