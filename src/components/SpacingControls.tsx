import React from "react";

export interface SpacingConfig {
  fontSize: number;
  lineHeight: number;
  sectionGap: number;
  projectGap: number;
  paddingX: number;
  paddingY: number;
}

interface SpacingControlsProps {
  spacing: SpacingConfig;
  onUpdate: (updater: (prev: SpacingConfig) => SpacingConfig) => void;
}

export const SpacingControls: React.FC<SpacingControlsProps> = ({
  spacing,
  onUpdate,
}) => {
  const { fontSize, lineHeight, sectionGap, projectGap, paddingX, paddingY } =
    spacing;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs text-zinc-600">
      {/* Font Size */}
      <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-lg">
        <span className="font-semibold text-zinc-700">Font:</span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() =>
              onUpdate((prev) => ({
                ...prev,
                fontSize: Math.max(9.5, parseFloat((prev.fontSize - 0.5).toFixed(1))),
              }))
            }
            className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
            title="Decrease Font Size"
          >
            －
          </button>
          <span className="w-8 text-center font-mono font-bold text-zinc-900 text-[11px]">
            {fontSize}
          </span>
          <button
            onClick={() =>
              onUpdate((prev) => ({
                ...prev,
                fontSize: Math.min(14.5, parseFloat((prev.fontSize + 0.5).toFixed(1))),
              }))
            }
            className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
            title="Increase Font Size"
          >
            ＋
          </button>
        </div>
      </div>

      {/* Line Height */}
      <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-lg">
        <span className="font-semibold text-zinc-700">Line:</span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() =>
              onUpdate((prev) => ({
                ...prev,
                lineHeight: Math.max(1.1, parseFloat((prev.lineHeight - 0.05).toFixed(2))),
              }))
            }
            className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
            title="Decrease Line Height"
          >
            －
          </button>
          <span className="w-8 text-center font-mono font-bold text-zinc-900 text-[11px]">
            {lineHeight}
          </span>
          <button
            onClick={() =>
              onUpdate((prev) => ({
                ...prev,
                lineHeight: Math.min(1.6, parseFloat((prev.lineHeight + 0.05).toFixed(2))),
              }))
            }
            className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
            title="Increase Line Height"
          >
            ＋
          </button>
        </div>
      </div>

      {/* Section Gap */}
      <div className="hidden md:flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-lg">
        <span className="font-semibold text-zinc-700">Sec:</span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() =>
              onUpdate((prev) => ({
                ...prev,
                sectionGap: Math.max(4, prev.sectionGap - 2),
              }))
            }
            className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
            title="Decrease Section Gap"
          >
            －
          </button>
          <span className="w-6 text-center font-mono font-bold text-zinc-900 text-[11px]">
            {sectionGap}
          </span>
          <button
            onClick={() =>
              onUpdate((prev) => ({
                ...prev,
                sectionGap: Math.min(24, prev.sectionGap + 2),
              }))
            }
            className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
            title="Increase Section Gap"
          >
            ＋
          </button>
        </div>
      </div>

      {/* Project Gap */}
      <div className="hidden lg:flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-lg">
        <span className="font-semibold text-zinc-700">Proj:</span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() =>
              onUpdate((prev) => ({
                ...prev,
                projectGap: Math.max(2, prev.projectGap - 2),
              }))
            }
            className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
            title="Decrease Project Gap"
          >
            －
          </button>
          <span className="w-6 text-center font-mono font-bold text-zinc-900 text-[11px]">
            {projectGap}
          </span>
          <button
            onClick={() =>
              onUpdate((prev) => ({
                ...prev,
                projectGap: Math.min(20, prev.projectGap + 2),
              }))
            }
            className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
            title="Increase Project Gap"
          >
            ＋
          </button>
        </div>
      </div>

      {/* Page Padding */}
      <div className="hidden xl:flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-lg">
        <span className="font-semibold text-zinc-700">Pad:</span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() =>
              onUpdate((prev) => ({
                ...prev,
                paddingY: Math.max(16, prev.paddingY - 4),
                paddingX: Math.max(20, prev.paddingX - 4),
              }))
            }
            className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
            title="Decrease Padding"
          >
            －
          </button>
          <span className="w-10 text-center font-mono font-bold text-zinc-900 text-[11px]">
            {paddingY}x{paddingX}
          </span>
          <button
            onClick={() =>
              onUpdate((prev) => ({
                ...prev,
                paddingY: Math.min(50, prev.paddingY + 4),
                paddingX: Math.min(60, prev.paddingX + 4),
              }))
            }
            className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
            title="Increase Padding"
          >
            ＋
          </button>
        </div>
      </div>
    </div>
  );
};
