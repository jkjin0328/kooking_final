import React, { useState } from 'react';
import { X, UploadCloud, BookOpen, Check, Sparkles, ChefHat } from 'lucide-react';
import { BlogPost, Recipe, UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface BlogEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePost: (newPost: BlogPost) => void;
  recipes: Recipe[];
  currentUser: UserProfile | null;
}

export const BlogEditorModal: React.FC<BlogEditorModalProps> = ({
  isOpen,
  onClose,
  onSavePost,
  recipes,
  currentUser,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [snippet, setSnippet] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('집밥일기, 홈스토랑, 요리레시피');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');
  const [coverImageUrl, setCoverImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 본문 내용을 모두 작성해주세요.');
      return;
    }

    const linkedRecipe = recipes.find((r) => r.id === selectedRecipeId);

    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      snippet: snippet.trim() || content.slice(0, 100) + '...',
      content: content.trim(),
      author: {
        name: currentUser?.name || '마스터 셰프',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        badge: currentUser?.badge || '푸드로거',
      },
      coverImage: coverImageUrl,
      images: [coverImageUrl],
      date: new Date().toLocaleDateString('ko-KR') + ' 방금 전',
      views: 1,
      likes: 1,
      commentsCount: 0,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      recipeId: linkedRecipe?.id,
      recipeTitle: linkedRecipe?.title,
      comments: [],
    };

    onSavePost(newPost);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#e9ecef] animate-scale-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/15 via-white to-purple-50 px-6 py-4 border-b border-[#e9ecef] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#2f3542]">
                네이버 블로그 스타일 요리 글쓰기
              </h2>
              <p className="text-xs text-gray-500">
                요리 과정 사진과 솔직한 후기, 나만의 조리 팁을 기록해보세요.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePublish} className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          
          {/* Cover Photo */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              대표 커버 사진
            </label>
            <div className="relative aspect-[21/9] rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden group bg-gray-50 flex items-center justify-center">
              <img
                src={coverImageUrl}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="px-4 py-2 bg-white text-gray-800 text-xs font-bold rounded-xl cursor-pointer hover:bg-gray-100 shadow-md">
                  커버 사진 변경
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">글 제목 *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: [주말 홈스토랑] 실패 없는 인생 김치찌개 황금레시피 후기 🍲"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:border-[#ff6b6b]"
            />
          </div>

          {/* Subtitle / Snippet */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">한 줄 요약 (미리보기)</label>
            <input
              type="text"
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
              placeholder="피드 목록에 보여질 매력적인 한 줄 요약을 적어주세요."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#ff6b6b]"
            />
          </div>

          {/* Link Recipe Option */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <ChefHat className="w-4 h-4 text-[#ff6b6b]" />
              <span>연관 레시피 카드 첨부 (선택)</span>
            </label>
            <select
              value={selectedRecipeId}
              onChange={(e) => setSelectedRecipeId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="">레시피 첨부 안 함</option>
              {recipes.map((rec) => (
                <option key={rec.id} value={rec.id}>
                  {rec.title} ({rec.author.name})
                </option>
              ))}
            </select>
          </div>

          {/* Body Content */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">본문 이야기 (마크다운 지원) *</label>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`안녕하세요! 요리를 사랑하는 푸드로거입니다 ✨\n\n이번 주말에는 Kooking 레시피를 보며 직접 요리를 해보았어요.\n\n### 💡 나만의 꿀팁 3가지:\n1. 불조절 타이머를 적극 활용하세요.\n2. 신김치에는 설탕을 살짝 넣어주세요.\n\n맛있게 드셨다면 공감과 댓글 부탁드립니다! 💕`}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-[#ff6b6b]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">해시태그 (쉼표로 구분)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="예: 김치찌개, 저녁메뉴, 집밥일기, 꿀팁"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#ff6b6b]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-[#ff6b6b] text-white text-sm font-bold rounded-2xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>블로그에 포스팅 발행하기</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
