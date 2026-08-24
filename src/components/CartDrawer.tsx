import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, CreditCard, Sparkles, Truck } from 'lucide-react';
import { CartItem, Language } from '../types';
import { I18N_DICTIONARY } from '../locales/i18n';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  lang?: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  lang = 'ko',
}) => {
  if (!isOpen) return null;

  const t = I18N_DICTIONARY[lang || 'ko'] || I18N_DICTIONARY.ko;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 30000 || subtotal === 0 ? 0 : 3000;
  const grandTotal = subtotal + shippingFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    alert(`🎉 총 ${grandTotal.toLocaleString()}원의 신선 밀키트 주문이 완료되었습니다!\n(내일 아침 7시 새벽배송 예정)`);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-left">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#e9ecef] flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ff6b6b] text-white flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2f3542]">
                장바구니 / 밀키트 주문함
              </h2>
              <p className="text-xs text-gray-500">
                총 {cartItems.length}종의 신선 식재료
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-3 border-b border-emerald-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <Truck className="w-4 h-4 text-emerald-600" />
            {subtotal >= 30000 ? (
              <span>✨ 3만원 이상 구매로 <strong>무료배송</strong> 혜택 적용!</span>
            ) : (
              <span>
                <strong>{(30000 - subtotal).toLocaleString()}원</strong> 더 담으면 무료배송!
              </span>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 divide-y divide-gray-100">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">장바구니가 비어 있습니다.</p>
              <p className="text-xs mt-1">레시피 상세페이지에서 원하는 재료를 담아보세요.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <span className="text-[10px] text-gray-400 block truncate">{item.recipeTitle}</span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#2f3542]">{item.name}</h4>
                  <span className="text-[11px] text-gray-500">{item.amountText}</span>
                  <p className="text-xs font-black text-[#ff6b6b] mt-0.5">
                    {(item.price * item.quantity).toLocaleString()}원
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
                  <button
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-6 h-6 rounded-lg bg-white text-gray-600 flex items-center justify-center shadow-2xs"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-[#2f3542]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-lg bg-white text-gray-600 flex items-center justify-center shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Remove item */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Calculation & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#e9ecef] bg-gray-50 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span className="font-semibold text-gray-800">{subtotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>배송비 (새벽배송)</span>
                <span className="font-semibold text-gray-800">
                  {shippingFee === 0 ? '무료' : `+${shippingFee.toLocaleString()}원`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#2f3542] pt-2 border-t border-gray-200">
                <span>최종 결제 금액</span>
                <span className="text-base text-[#ff6b6b]">{grandTotal.toLocaleString()}원</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white text-sm font-bold rounded-2xl shadow-lg shadow-[#ff6b6b]/25 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>{grandTotal.toLocaleString()}원 원클릭 간편 주문</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
