import React, { useState } from 'react';
import { X, Server, Database, Code, ShieldCheck, Cpu, CheckCircle2, ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { BACKEND_30_API_SPECS, SYSTEM_ARCHITECTURE_MERMAID, DATABASE_ERD_MERMAID } from '../data/mockBackendDocs';

interface BackendDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendDocsModal: React.FC<BackendDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'endpoints' | 'architecture' | 'erd' | 'security'>('endpoints');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const methods = ['ALL', 'GET', 'POST', 'PUT', 'DELETE', 'ALL_VERB'];
  
  const filteredSpecs = selectedMethod === 'ALL'
    ? BACKEND_30_API_SPECS
    : BACKEND_30_API_SPECS.filter((s) => s.method === selectedMethod || (selectedMethod === 'ALL_VERB' && s.method === 'ALL'));

  const handleCopy = (id: number, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#e9ecef] flex flex-col h-[85vh] animate-scale-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2f3542] via-slate-800 to-indigo-900 px-6 py-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Server className="w-5 h-5 text-[#4ecdc4]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black flex items-center gap-2">
                <span>Kooking 30종 백엔드 시스템 및 API 아키텍처 명세서</span>
                <span className="text-[10px] bg-[#4ecdc4] text-slate-900 px-2 py-0.5 rounded-full font-bold">
                  v2.5 Architecture
                </span>
              </h2>
              <p className="text-xs text-white/70">
                Spring Boot & Node.js / Gemini AI Engine / Redis 분산 락 / PostgreSQL ERD 명세
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'endpoints'
                ? 'bg-[#ff6b6b] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>30개 RESTful API 전체 명세</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'bg-[#ff6b6b] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>시스템 아키텍처 다이어그램</span>
          </button>

          <button
            onClick={() => setActiveTab('erd')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'erd'
                ? 'bg-[#ff6b6b] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>ERD 데이터 모델링</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-[#ff6b6b] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>보안 & 성능 분산락 가이드</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          
          {/* TAB 1: 30 RESTful Endpoints */}
          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="flex gap-1.5">
                  {methods.map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMethod(m)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedMethod === m
                          ? 'bg-[#2f3542] text-white'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {m === 'ALL_VERB' ? 'ALL (GLOBAL)' : m}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-semibold">
                  총 {filteredSpecs.length}개 엔드포인트 표시 중
                </span>
              </div>

              <div className="space-y-3">
                {filteredSpecs.map((spec) => {
                  const isExpanded = expandedId === spec.id;
                  const methodColor = 
                    spec.method === 'GET' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    spec.method === 'POST' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                    spec.method === 'PUT' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    spec.method === 'PATCH' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                    spec.method === 'DELETE' ? 'bg-red-100 text-red-800 border-red-300' :
                    'bg-slate-100 text-slate-800 border-slate-300';

                  return (
                    <div key={spec.id} className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden transition-all">
                      <div
                        onClick={() => setExpandedId(isExpanded ? null : spec.id)}
                        className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/70"
                      >
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-black text-gray-400 w-6">#{spec.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black border ${methodColor}`}>
                            {spec.method}
                          </span>
                          <code className="text-xs font-bold text-[#2f3542] bg-gray-100 px-2 py-0.5 rounded">
                            {spec.endpoint}
                          </code>
                          <span className="text-xs font-bold text-gray-800 ml-1">
                            {spec.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#4ecdc4] bg-[#4ecdc4]/10 px-2 py-0.5 rounded">
                            {spec.category}
                          </span>
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                        </div>
                      </div>

                      {/* Expanded Specs Body */}
                      {isExpanded && (
                        <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50/50 space-y-3 text-xs">
                          <p className="text-gray-700 leading-relaxed pt-3">
                            {spec.description}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="bg-white p-3 rounded-xl border border-gray-200">
                              <span className="text-[10px] font-bold text-gray-400 block mb-1">🛠️ 적용 기술 스택 / 라이브러리</span>
                              <span className="font-semibold text-gray-800">{spec.techStack}</span>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-gray-200">
                              <span className="text-[10px] font-bold text-gray-400 block mb-1">🔒 보안 / 인가 정책</span>
                              <span className="font-semibold text-[#ff6b6b]">{spec.security}</span>
                            </div>
                          </div>

                          {/* Request Example */}
                          {spec.requestExample && (
                            <div>
                              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                                <span>요청 예시 (Request Payload / Query):</span>
                                <button
                                  onClick={() => handleCopy(spec.id * 100, spec.requestExample!)}
                                  className="text-gray-400 hover:text-gray-600 flex items-center gap-1"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>{copiedId === spec.id * 100 ? '복사됨' : '복사'}</span>
                                </button>
                              </div>
                              <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                                {spec.requestExample}
                              </pre>
                            </div>
                          )}

                          {/* Response Example */}
                          {spec.responseExample && (
                            <div>
                              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                                <span>응답 예시 (JSON Response):</span>
                                <button
                                  onClick={() => handleCopy(spec.id * 100 + 1, spec.responseExample!)}
                                  className="text-gray-400 hover:text-gray-600 flex items-center gap-1"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>{copiedId === spec.id * 100 + 1 ? '복사됨' : '복사'}</span>
                                </button>
                              </div>
                              <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                                {spec.responseExample}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: System Architecture Diagram */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="text-base font-bold text-[#2f3542] mb-2 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-600" />
                  <span>Kooking 클라우드 분산 아키텍처 다이어그램</span>
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  SPA 클라이언트, NGINX 리버스 프록시, Node.js/Express API 게이트웨이, Redis 캐시, Cloud DB 및 Google Gemini AI 엔진의 계층 구조입니다.
                </p>

                <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                  {SYSTEM_ARCHITECTURE_MERMAID}
                </pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-[#ff6b6b] mb-1">프론트엔드 레이어</h4>
                  <p className="text-xs text-gray-600">Vite + React 18, Tailwind CSS, Lucide Icons, Web Speech API, Chart.js, HTML5 Canvas.</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-[#4ecdc4]">백엔드 서비스 레이어</h4>
                  <p className="text-xs text-gray-600">Express, JWT/OAuth2 Auth, Redis Session/Rate-limiter, SSE 알림 파이프라인.</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-purple-600">AI 및 데이터 스토리지</h4>
                  <p className="text-xs text-gray-600">Gemini 2.5 Flash, PostgreSQL/Firestore, Redis Cache, Cloud Storage.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ERD Diagram */}
          {activeTab === 'erd' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-base font-bold text-[#2f3542] flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <span>데이터베이스 ERD 엔티티 관계도 (Mermaid)</span>
              </h3>
              <p className="text-xs text-gray-600">
                USERS, RECIPES, INGREDIENTS, COOKING_STEPS, REVIEWS, BLOG_POSTS, CART_ITEMS, MEALKITS 간의 1:N / N:M 정규화 데이터 모델입니다.
              </p>

              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                {DATABASE_ERD_MERMAID}
              </pre>
            </div>
          )}

          {/* TAB 4: Security & Optimization */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
                <h3 className="text-base font-bold text-[#2f3542] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#ff6b6b]" />
                  <span>백엔드 보안 및 프로덕션 운영 가이드</span>
                </h3>
                
                <div className="space-y-2 text-xs text-gray-700 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>API Rate Limiting (DDoS 차단):</strong> IP당 분당 100회 요청 제한 (express-rate-limit).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>JWT Bearer & Cookie Security:</strong> Access Token (15분), Refresh Token (7일, HttpOnly & SameSite=Strict).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Gemini AI 서버사이드 보안:</strong> 브라우저에 API 키를 노출하지 않고 `/api/ai/*` 라우트에서만 프록시 처리.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>CORS & Helmet 헤더:</strong> XSS, Clickjacking 방지 CSP 정책 및 NGINX 리버스 프록시 적용.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
