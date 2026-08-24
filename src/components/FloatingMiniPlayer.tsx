import React, { useState } from 'react';
import { X, Minimize2, Maximize2, Video, Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface FloatingMiniPlayerProps {
  videoUrl: string | null;
  title: string;
  onClose: () => void;
}

export const FloatingMiniPlayer: React.FC<FloatingMiniPlayerProps> = ({
  videoUrl,
  title,
  onClose,
}) => {
  if (!videoUrl) return null;

  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div
      id="floating-pip-container"
      className="fixed bottom-6 right-6 z-40 bg-[#2f3542] rounded-2xl shadow-2xl overflow-hidden border border-white/20 text-white animate-slide-up w-72 sm:w-80"
    >
      {/* Mini Player Bar */}
      <div className="px-3 py-2 bg-[#202530] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 truncate max-w-[180px]">
          <Video className="w-3.5 h-3.5 text-[#ff6b6b] flex-shrink-0" />
          <span className="font-bold truncate">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-400 hover:text-white rounded"
            title={isMinimized ? '확대' : '축소'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-red-400 rounded"
            title="닫기"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="relative aspect-video bg-black">
          <video
            src={videoUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};
