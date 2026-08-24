import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Plus, 
  Trash2, 
  Sliders, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  Clock, 
  Users, 
  Flame, 
  Utensils 
} from 'lucide-react';
import { Recipe, Ingredient, CookingStep, Language } from '../types';
import { I18N_DICTIONARY } from '../locales/i18n';
import confetti from 'canvas-confetti';

interface RecipeCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecipe: (newRecipe: Recipe) => void;
  lang?: Language;
}

export const RecipeCreateModal: React.FC<RecipeCreateModalProps> = ({
  isOpen,
  onClose,
  onSaveRecipe,
  lang = 'ko',
}) => {
  if (!isOpen) return null;

  const t = I18N_DICTIONARY[lang || 'ko'] || I18N_DICTIONARY.ko;

  // Recipe Meta Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'korean' | 'western' | 'asian' | 'diet' | 'airfryer'>('korean');
  const [difficulty, setDifficulty] = useState<'쉬움' | '보통' | '어려움'>('보통');
  const [prepTime, setPrepTime] = useState<number>(10);
  const [cookTime, setCookTime] = useState<number>(20);
  const [servings, setServings] = useState<number>(2);
  const [tagsInput, setTagsInput] = useState<string>('집밥, 초간단, 저녁메뉴');

  // Feature 4: Drag & Drop Image & Feature 16: Canvas Filter state
  const [rawImageSrc, setRawImageSrc] = useState<string>(
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
  );
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showCanvasEditor, setShowCanvasEditor] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [filterMode, setFilterMode] = useState<'normal' | 'grayscale' | 'sepia' | 'warm'>('normal');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic Ingredients List
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 'new-1', name: '주재료', amount: 200, unit: 'g', price: 4000, isEssential: true },
    { id: 'new-2', name: '양파', amount: 0.5, unit: '개', price: 600, isEssential: false },
    { id: 'new-3', name: '진간장', amount: 1, unit: '큰술', price: 300, isEssential: true },
  ]);

  // Feature 5: Dynamic Cooking Steps
  const [steps, setSteps] = useState<CookingStep[]>([
    {
      stepNumber: 1,
      title: '재료 손질하기',
      description: '모든 채소와 고기를 깨끗이 씻어 먹기 좋은 크기로 손질합니다.',
      timeSeconds: 180,
      tip: '물기를 키친타월로 닦아내면 볶을 때 기름이 덜 튑니다.',
    },
    {
      stepNumber: 2,
      title: '팬 예열 및 볶기',
      description: '달군 팬에 식용유를 두르고 중불에서 고루 볶아줍니다.',
      timeSeconds: 300,
      tip: '센 불에서 빠르게 볶아야 채소의 아삭함이 유지됩니다.',
    },
  ]);

  // Handle Drag and Drop Image
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setRawImageSrc(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setRawImageSrc(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Feature 16: Canvas Filter Render & Export
  const applyCanvasFilters = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = 600;
      canvas.height = 450;
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${
        filterMode === 'grayscale' ? 'grayscale(100%)' : filterMode === 'sepia' ? 'sepia(100%)' : filterMode === 'warm' ? 'sepia(30%) saturate(140%)' : 'none'
      }`;
      ctx.drawImage(img, 0, 0, 600, 450);
      const filteredDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setRawImageSrc(filteredDataUrl);
      setShowCanvasEditor(false);
    };
    img.src = rawImageSrc;
  };

  // Ingredients Handlers
  const addIngredientRow = () => {
    setIngredients([
      ...ingredients,
      { id: `new-${Date.now()}`, name: '', amount: 100, unit: 'g', price: 2000, isEssential: false },
    ]);
  };

  const removeIngredientRow = (index: number) => {
    setIngredients(ingredients.filter((_, idx) => idx !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  // Feature 5: Steps Handlers
  const addStepRow = () => {
    setSteps([
      ...steps,
      {
        stepNumber: steps.length + 1,
        title: `단계 ${steps.length + 1}`,
        description: '',
        timeSeconds: 120,
        tip: '',
      },
    ]);
  };

  const removeStepRow = (index: number) => {
    const filtered = steps.filter((_, idx) => idx !== index);
    setSteps(filtered.map((s, idx) => ({ ...s, stepNumber: idx + 1 })));
  };

  const updateStep = (index: number, field: keyof CookingStep, value: any) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  // Submit Recipe
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('레시피 제목을 입력해주세요.');
      return;
    }

    const categoryLabels: Record<string, string> = {
      korean: '한식',
      western: '양식',
      asian: '일식/아시안',
      diet: '다이어트/건강식',
      airfryer: '에어프라이어',
    };

    const newRecipe: Recipe = {
      id: `recipe-custom-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || '내가 작성한 맛있는 레시피',
      description: description.trim() || '간단하고 맛있는 홈메이드 요리 레시피입니다.',
      category: category as any,
      categoryLabel: categoryLabels[category] || '한식',
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      imageUrl: rawImageSrc,
      prepTime: Number(prepTime) || 10,
      cookTime: Number(cookTime) || 20,
      servings: Number(servings) || 2,
      difficulty: difficulty,
      calories: 450,
      rating: 5.0,
      reviewCount: 1,
      likesCount: 1,
      scrapsCount: 0,
      author: {
        name: '나의 셰프 노트',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        badge: '크리에이터',
      },
      nutrition: {
        calories: 450,
        carbs: 45,
        protein: 28,
        fat: 18,
        sodium: 620,
        sugar: 6,
      },
      ingredients: ingredients.filter((ing) => ing.name.trim().length > 0),
      steps: steps,
      mealkitPrice: 12900,
    };

    onSaveRecipe(newRecipe);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-[#e9ecef] animate-scale-up">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#ff6b6b]/15 via-white to-purple-50 px-6 py-4 border-b border-[#e9ecef] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ff6b6b] text-white flex items-center justify-center shadow-md shadow-[#ff6b6b]/20">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#2f3542]">
                새 레시피 등록하기
              </h2>
              <p className="text-xs text-gray-500">
                나만의 비법과 조리 단계를 공유해 보세요.
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
        <form onSubmit={handleSave} className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* ========================================================
              FEATURE 4: Drag & Drop Recipe Image Upload
              & FEATURE 16: Canvas Filter Editor
             ======================================================== */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              대표 요리 사진 (드래그 앤 드롭 & 캔버스 필터)
            </label>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all cursor-pointer bg-gray-50 ${
                isDragOver ? 'border-[#ff6b6b] bg-[#ff6b6b]/5' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {rawImageSrc ? (
                <div className="relative w-full h-full group">
                  <img
                    src={rawImageSrc}
                    alt="Recipe preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="px-3 py-1.5 bg-white text-gray-800 text-xs font-bold rounded-xl cursor-pointer hover:bg-gray-100 shadow-md">
                      사진 변경
                      <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCanvasEditor(true)}
                      className="px-3 py-1.5 bg-[#ff6b6b] text-white text-xs font-bold rounded-xl hover:bg-[#ff5252] shadow-md flex items-center gap-1"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>필터 & 보정</span>
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs font-bold text-gray-700">
                    {t.dragDropImage}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">PNG, JPG, WebP 최대 10MB</span>
                  <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                </label>
              )}
            </div>

            {/* Canvas Editor Drawer (Feature 16) */}
            {showCanvasEditor && (
              <div className="mt-3 p-4 bg-gray-900 rounded-2xl text-white space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-[#ff6b6b]" />
                    <span>HTML5 캔버스 이미지 필터 에디터</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCanvasEditor(false)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    닫기
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-300 mb-1">밝기 ({brightness}%)</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-[#ff6b6b]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">대비 ({contrast}%)</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-[#ff6b6b]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setFilterMode('normal')}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold ${filterMode === 'normal' ? 'bg-[#ff6b6b]' : 'bg-gray-800'}`}
                  >
                    원본
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('grayscale')}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold ${filterMode === 'grayscale' ? 'bg-[#ff6b6b]' : 'bg-gray-800'}`}
                  >
                    흑백
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('sepia')}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold ${filterMode === 'sepia' ? 'bg-[#ff6b6b]' : 'bg-gray-800'}`}
                  >
                    세피아
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('warm')}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold ${filterMode === 'warm' ? 'bg-[#ff6b6b]' : 'bg-gray-800'}`}
                  >
                    따뜻하게
                  </button>

                  <button
                    type="button"
                    onClick={applyCanvasFilters}
                    className="ml-auto px-4 py-1.5 bg-[#4ecdc4] text-white text-xs font-bold rounded-lg hover:bg-[#3db8af]"
                  >
                    필터 적용 완료
                  </button>
                </div>

                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">레시피 제목 *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 10분 만에 완성하는 바질 토마토 파스타"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#ff6b6b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">한 줄 소개</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="예: 생토마토의 상큼함과 신선한 바질향이 가득한 파스타"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#ff6b6b]"
              />
            </div>
          </div>

          {/* Category, Difficulty, Times, Servings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="korean">한식</option>
                <option value="western">양식</option>
                <option value="asian">일식/아시안</option>
                <option value="diet">다이어트/건강식</option>
                <option value="airfryer">에어프라이어</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">난이도</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="쉬움">쉬움</option>
                <option value="보통">보통</option>
                <option value="어려움">어려움</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">조리 시간 (분)</label>
              <input
                type="number"
                min="1"
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">기준 인원 (인분)</label>
              <input
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">태그 (쉼표로 구분)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="예: 파스타, 토마토, 자취요리, 홈파티"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#ff6b6b]"
            />
          </div>

          {/* Ingredients Manager */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#2f3542] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#ff6b6b]" />
                <span>재료 목록 ({ingredients.length}개)</span>
              </span>
              <button
                type="button"
                onClick={addIngredientRow}
                className="px-3 py-1 bg-white border border-gray-300 hover:border-[#ff6b6b] text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#ff6b6b]" />
                <span>재료 추가</span>
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={ing.id || idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="재료명 (예: 파스타면)"
                    value={ing.name}
                    onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                    className="flex-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                  <input
                    type="number"
                    placeholder="수량"
                    value={ing.amount}
                    onChange={(e) => updateIngredient(idx, 'amount', Number(e.target.value))}
                    className="w-16 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-center"
                  />
                  <input
                    type="text"
                    placeholder="단위 (g, 개, T)"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(idx, 'unit', e.target.value)}
                    className="w-16 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-center"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredientRow(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================
              FEATURE 5: Dynamic Step Management UI
             ======================================================== */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#2f3542] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>조리 순서 (Step) 동적 관리 ({steps.length}단계)</span>
              </span>
              <button
                type="button"
                onClick={addStepRow}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>단계 추가</span>
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#ff6b6b]">
                      STEP {step.stepNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-gray-500">타이머:</span>
                        <input
                          type="number"
                          placeholder="초"
                          value={step.timeSeconds || 120}
                          onChange={(e) => updateStep(idx, 'timeSeconds', Number(e.target.value))}
                          className="w-14 px-1.5 py-0.5 border border-gray-200 rounded text-xs text-center"
                        />
                        <span className="text-[10px] text-gray-400">초</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStepRow(idx)}
                        disabled={steps.length <= 1}
                        className="text-gray-400 hover:text-red-500 disabled:opacity-30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="단계 요약 제목 (예: 면 삶기)"
                    value={step.title}
                    onChange={(e) => updateStep(idx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold"
                  />

                  <textarea
                    rows={2}
                    placeholder="상세 조리 과정을 적어주세요."
                    value={step.description}
                    onChange={(e) => updateStep(idx, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                  />

                  <input
                    type="text"
                    placeholder="셰프 꿀팁 (선택)"
                    value={step.tip || ''}
                    onChange={(e) => updateStep(idx, 'tip', e.target.value)}
                    className="w-full px-3 py-1 bg-amber-50/60 border border-amber-200 rounded-lg text-[11px] text-amber-900"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-sm font-bold rounded-2xl shadow-lg shadow-[#ff6b6b]/25 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>레시피 발행하기</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
