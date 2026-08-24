import React, { useState } from 'react';
import { BlogPost, BlogComment, Language, UserProfile } from '../types';
import { 
  BookOpen, 
  Heart, 
  MessageSquare, 
  Eye, 
  PlusCircle, 
  Share2, 
  Send, 
  CornerDownRight, 
  Tag, 
  Sparkles, 
  Clock, 
  X,
  ChefHat
} from 'lucide-react';
import { I18N_DICTIONARY } from '../locales/i18n';
import confetti from 'canvas-confetti';

interface CommunityBlogViewProps {
  posts: BlogPost[];
  onOpenBlogEditor: () => void;
  lang: Language;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, comment: string, parentId?: string) => void;
  onOpenRecipeModalById?: (recipeId: string) => void;
}

export const CommunityBlogView: React.FC<CommunityBlogViewProps> = ({
  posts,
  onOpenBlogEditor,
  lang,
  currentUser,
  onOpenAuth,
  onLikePost,
  onAddComment,
  onOpenRecipeModalById,
}) => {
  const t = I18N_DICTIONARY[lang];
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'diary' | 'tips' | 'best'>('all');
  const [commentText, setCommentText] = useState<string>('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedPost) return;

    onAddComment(selectedPost.id, commentText.trim());
    
    // Update local state for immediate feedback
    const newComment: BlogComment = {
      id: `c-${Date.now()}`,
      author: currentUser?.name || '익명 푸드로거',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      date: '방금 전',
      content: commentText.trim(),
      likes: 0,
      replies: [],
    };

    setSelectedPost({
      ...selectedPost,
      comments: [newComment, ...(selectedPost.comments || [])],
      commentsCount: selectedPost.commentsCount + 1,
    });

    setCommentText('');
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
  };

  const handlePostReply = (parentId: string) => {
    if (!replyText.trim() || !selectedPost) return;

    onAddComment(selectedPost.id, replyText.trim(), parentId);

    // Update parent comment in selectedPost
    const updatedComments = (selectedPost.comments || []).map((c) => {
      if (c.id === parentId) {
        const newReply: BlogComment = {
          id: `r-${Date.now()}`,
          author: currentUser?.name || '익명 푸드로거',
          avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          date: '방금 전',
          content: replyText.trim(),
          likes: 0,
        };
        return { ...c, replies: [...(c.replies || []), newReply] };
      }
      return c;
    });

    setSelectedPost({
      ...selectedPost,
      comments: updatedComments,
      commentsCount: selectedPost.commentsCount + 1,
    });

    setReplyingToId(null);
    setReplyText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Blog Community Hero Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#ff6b6b]/10 to-purple-500/10 rounded-3xl p-6 sm:p-10 border border-[#e9ecef] mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 text-xs font-bold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>네이버 블로그 스타일 요리 커뮤니티</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2f3542] leading-tight">
            맛있는 요리 일기와 나만의 꿀팁을 <br className="hidden sm:inline" />
            블로그 포스팅으로 공유해보세요!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl">
            누구나 자유롭게 요리 과정 사진과 솔직한 후기, 비법 양념 팁을 작성하고 소통할 수 있는 오픈 쿠킹 피드입니다.
          </p>
        </div>

        <button
          id="write-blog-post-btn"
          onClick={currentUser ? onOpenBlogEditor : onOpenAuth}
          className="px-6 py-3.5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-sm sm:text-base font-bold rounded-2xl shadow-lg shadow-[#ff6b6b]/25 transition-all flex items-center gap-2 flex-shrink-0 hover:scale-105"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t.writeBlogPost}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategoryTab('all')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeCategoryTab === 'all'
                ? 'bg-[#2f3542] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체 피드
          </button>
          <button
            onClick={() => setActiveCategoryTab('diary')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeCategoryTab === 'diary'
                ? 'bg-[#2f3542] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🍳 요리일기 / 홈스토랑
          </button>
          <button
            onClick={() => setActiveCategoryTab('tips')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeCategoryTab === 'tips'
                ? 'bg-[#2f3542] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            💡 셰프 비법 꿀팁
          </button>
          <button
            onClick={() => setActiveCategoryTab('best')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeCategoryTab === 'best'
                ? 'bg-[#2f3542] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🔥 주간 베스트
          </button>
        </div>

        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
          총 <strong className="text-[#ff6b6b]">{posts.length}</strong>개의 포스팅
        </span>
      </div>

      {/* Blog Posts Grid List (Naver Blog Feed Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            id={`blog-post-card-${post.id}`}
            onClick={() => handleOpenPost(post)}
            className="bg-white rounded-2xl overflow-hidden border border-[#e9ecef] shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.date}</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5">
                {/* Author Info */}
                <div className="flex items-center gap-2.5 mb-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#2f3542] flex items-center gap-1">
                      <span>{post.author.name}</span>
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">
                        {post.author.badge}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-[#2f3542] hover:text-[#ff6b6b] transition-colors line-clamp-2 leading-snug mb-2">
                  {post.title}
                </h3>

                {/* Snippet */}
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-4">
                  {post.snippet}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[10px] text-[#ff6b6b] bg-[#ff6b6b]/10 px-2 py-0.5 rounded-md font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Stats (Views, Likes, Comments) */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-gray-400" /> {post.views}
                </span>
                <span className="flex items-center gap-1 text-[#ff6b6b]">
                  <Heart className="w-3.5 h-3.5 fill-[#ff6b6b]" /> {post.likes}
                </span>
                <span className="flex items-center gap-1 text-purple-600">
                  <MessageSquare className="w-3.5 h-3.5" /> {post.commentsCount}
                </span>
              </div>

              <span className="text-xs font-bold text-[#2f3542] hover:text-[#ff6b6b]">
                글 전체보기 →
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* ========================================================
          DETAILED BLOG POST MODAL WITH COMMENTS & REPLIES
         ======================================================== */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#e9ecef] animate-scale-up">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#e9ecef] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={selectedPost.author.avatar}
                  alt={selectedPost.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#2f3542]">{selectedPost.author.name}</h4>
                  <span className="text-[10px] text-gray-400">{selectedPost.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLikePost(selectedPost.id)}
                  className="px-3 py-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Heart className="w-4 h-4 fill-red-500" />
                  <span>{selectedPost.likes}</span>
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
              
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#2f3542] leading-snug">
                  {selectedPost.title}
                </h1>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedPost.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs text-[#ff6b6b] bg-[#ff6b6b]/10 px-2 py-0.5 rounded-md font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cover Photo */}
              <div className="rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="w-full max-h-96 object-cover"
                />
              </div>

              {/* Linked Recipe Card if any */}
              {selectedPost.recipeTitle && (
                <div
                  onClick={() => {
                    if (selectedPost.recipeId && onOpenRecipeModalById) {
                      onOpenRecipeModalById(selectedPost.recipeId);
                    }
                  }}
                  className="p-4 bg-gradient-to-r from-[#ff6b6b]/10 to-amber-50 rounded-2xl border border-[#ff6b6b]/30 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <ChefHat className="w-6 h-6 text-[#ff6b6b]" />
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold uppercase">연관 레시피 바로가기</span>
                      <h5 className="text-xs sm:text-sm font-bold text-[#2f3542]">{selectedPost.recipeTitle}</h5>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#ff6b6b]">레시피 보기 →</span>
                </div>
              )}

              {/* Rich Content Article */}
              <div className="text-sm sm:text-base text-[#2f3542] leading-relaxed whitespace-pre-line space-y-4 font-normal">
                {selectedPost.content}
              </div>

              {/* Comments Section (Hierarchical 대댓글) */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-base font-bold text-[#2f3542] mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <span>댓글 ({selectedPost.comments?.length || 0})</span>
                </h3>

                {/* Comment Input Box */}
                <form onSubmit={handlePostComment} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={currentUser ? '따뜻한 댓글을 남겨주세요...' : '로그인 후 댓글을 작성할 수 있습니다.'}
                    disabled={!currentUser}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#ff6b6b]"
                  />
                  <button
                    type="submit"
                    disabled={!currentUser || !commentText.trim()}
                    className="px-5 py-2.5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                    <span>등록</span>
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {(selectedPost.comments || []).map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={comment.avatar}
                            alt={comment.author}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-[#2f3542]">{comment.author}</span>
                          <span className="text-[10px] text-gray-400">{comment.date}</span>
                        </div>
                        <button
                          onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                          className="text-[11px] text-purple-600 hover:underline font-semibold"
                        >
                          답글 쓰기
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-700 ml-8">{comment.content}</p>

                      {/* Nested Replies (대댓글) */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-8 pl-3 border-l-2 border-purple-200 space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="bg-white p-2.5 rounded-xl border border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <CornerDownRight className="w-3 h-3 text-purple-500" />
                                <img
                                  src={reply.avatar}
                                  alt={reply.author}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                                <span className="text-xs font-bold text-[#2f3542]">{reply.author}</span>
                                <span className="text-[10px] text-gray-400">{reply.date}</span>
                              </div>
                              <p className="text-xs text-gray-700 ml-5">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input Form */}
                      {replyingToId === comment.id && (
                        <div className="mt-3 ml-8 flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="답글을 작성하세요..."
                            className="flex-1 px-3 py-1.5 bg-white border border-purple-300 rounded-lg text-xs focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handlePostReply(comment.id)}
                            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold"
                          >
                            작성
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
