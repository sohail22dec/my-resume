import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { PanelLeftIcon, RefreshCwIcon, PrinterIcon, SparklesIcon } from "../icons";
import { SpacingControls, type SpacingConfig } from "./SpacingControls";

interface NavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  spacing: SpacingConfig;
  onUpdateSpacing: (updater: (prev: SpacingConfig) => SpacingConfig) => void;
  onResetResume: () => void;
  onPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  spacing,
  onUpdateSpacing,
  onResetResume,
  onPrint,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-2xs print:hidden">
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand + Sidebar Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant={isSidebarOpen ? "secondary" : "outline"}
            size="sm"
            onClick={onToggleSidebar}
            className="flex items-center gap-2 border-zinc-200 cursor-pointer"
            title="Toggle Sidebar (Ctrl+B / Cmd+B)"
          >
            <PanelLeftIcon size={15} />
            <span className="hidden sm:inline font-semibold">
              {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            </span>
            <Badge variant="outline" className="px-1.5 py-0 text-[10px] hidden md:inline-flex">
              ⌘B
            </Badge>
          </Button>

          <div className="flex items-center gap-2 border-l border-zinc-200 pl-3">
            <span className="text-zinc-800 font-extrabold tracking-tight text-sm sm:text-base flex items-center gap-1.5">
              <SparklesIcon size={16} className="text-zinc-700" />
              <span>Agentic AI Resume</span>
            </span>
            <Badge variant="secondary" className="text-[10px] hidden lg:inline-flex">
              1-Page A4 ATS
            </Badge>
          </div>
        </div>

        {/* Center: Spacing Steppers */}
        <SpacingControls spacing={spacing} onUpdate={onUpdateSpacing} />

        {/* Right: Reset & Download PDF */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetResume}
            title="Reset resume to original master data"
          >
            <RefreshCwIcon size={13} />
            <span>Reset</span>
          </Button>
          <Button variant="default" size="sm" onClick={onPrint}>
            <PrinterIcon size={15} />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
