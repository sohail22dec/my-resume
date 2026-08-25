import { useRef, useState, useEffect } from "react";
import { resumeData } from "./resumeData";
import type { ResumeDataType } from "./resumeData";
import {
  LinkedInIcon,
  GitHubIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  PrinterIcon,
  ExternalLinkIcon,
  PanelLeftIcon,
  SparklesIcon,
  Edit3Icon,
  ChevronLeftIcon,
  RefreshCwIcon,
  BotIcon,
} from "./icons";
import { tailorResumeWithAI, ALL_AI_MODELS } from "./aiTailor";
import type { TailorResponse } from "./aiTailor";
import { ResumeEditorPanel } from "./ResumeEditorPanel";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";

const getCleanDomain = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/https?:\/\/(www\.)?/, "");
  }
};

export default function App() {
  const resumeRef = useRef<HTMLDivElement>(null);

  // Sidebar Toggle State (Open by default on desktop)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Active Tab State ('ai' or 'edit')
  const [activeTab, setActiveTab] = useState<"ai" | "edit">("ai");

  // Resume Data State (Can be tailored by AI or edited manually)
  const [activeResume, setActiveResume] = useState<ResumeDataType>(resumeData);
  const [isTailored, setIsTailored] = useState<boolean>(false);
  const [tailoredRole, setTailoredRole] = useState<string>("");

  // Dynamic Spacing State (px / ratio)
  const [fontSize, setFontSize] = useState<number>(11.5);
  const [lineHeight, setLineHeight] = useState<number>(1.4);
  const [sectionGap, setSectionGap] = useState<number>(16);
  const [projectGap, setProjectGap] = useState<number>(12);
  const [paddingY, setPaddingY] = useState<number>(32);
  const [paddingX, setPaddingX] = useState<number>(40);

  // AI State
  const [userGroqKey, setUserGroqKey] = useState<string>(
    () => localStorage.getItem("groq_api_key") || ""
  );
  const [userGeminiKey, setUserGeminiKey] = useState<string>(
    () => localStorage.getItem("gemini_api_key") || ""
  );
  const [selectedModel, setSelectedModel] = useState<string>("openai/gpt-oss-120b");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const editableClass =
    "outline-none rounded px-1 transition-all cursor-text hover:bg-amber-50 hover:ring-1 hover:ring-amber-400 focus:bg-amber-50 focus:ring-2 focus:ring-zinc-900 print:hover:bg-transparent print:hover:ring-0 print:focus:ring-0";

  const handleEditableBlur = (fieldPath: string, newValue: string) => {
    const trimmed = newValue.trim();
    if (!trimmed && fieldPath !== "demoUrl") return;

    if (fieldPath === "name") setActiveResume((r) => ({ ...r, name: newValue }));
    else if (fieldPath === "title") setActiveResume((r) => ({ ...r, title: newValue }));
    else if (fieldPath === "summary") setActiveResume((r) => ({ ...r, summary: newValue }));
    else if (fieldPath.startsWith("contact.")) {
      const field = fieldPath.split(".")[1];
      setActiveResume((r) => ({ ...r, contact: { ...r.contact, [field]: newValue } }));
    } else if (fieldPath.startsWith("skillCat.")) {
      const idx = parseInt(fieldPath.split(".")[1]);
      setActiveResume((r) => ({
        ...r,
        skills: r.skills.map((s, i) => (i === idx ? { ...s, category: newValue } : s)),
      }));
    } else if (fieldPath.startsWith("skillItems.")) {
      const idx = parseInt(fieldPath.split(".")[1]);
      const items = newValue.split(",").map((i) => i.trim()).filter(Boolean);
      setActiveResume((r) => ({
        ...r,
        skills: r.skills.map((s, i) => (i === idx ? { ...s, items } : s)),
      }));
    } else if (fieldPath.startsWith("projName.")) {
      const pIdx = parseInt(fieldPath.split(".")[1]);
      setActiveResume((r) => ({
        ...r,
        projects: r.projects.map((p, i) => (i === pIdx ? { ...p, name: newValue } : p)),
      }));
    } else if (fieldPath.startsWith("projSubtitle.")) {
      const pIdx = parseInt(fieldPath.split(".")[1]);
      setActiveResume((r) => ({
        ...r,
        projects: r.projects.map((p, i) => (i === pIdx ? { ...p, subtitle: newValue } : p)),
      }));
    } else if (fieldPath.startsWith("projTech.")) {
      const pIdx = parseInt(fieldPath.split(".")[1]);
      const tech = newValue.split(",").map((t) => t.trim()).filter(Boolean);
      setActiveResume((r) => ({
        ...r,
        projects: r.projects.map((p, i) => (i === pIdx ? { ...p, tech } : p)),
      }));
    } else if (fieldPath.startsWith("projBullet.")) {
      const parts = fieldPath.split(".");
      const pIdx = parseInt(parts[1]);
      const bIdx = parseInt(parts[2]);
      setActiveResume((r) => ({
        ...r,
        projects: r.projects.map((p, i) => {
          if (i !== pIdx) return p;
          return {
            ...p,
            bullets: p.bullets.map((b, bi) => (bi === bIdx ? newValue : b)),
          };
        }),
      }));
    } else if (fieldPath.startsWith("edu.")) {
      const field = fieldPath.split(".")[1];
      setActiveResume((r) => ({
        ...r,
        education: { ...r.education, [field]: newValue },
      }));
    }
  };

  // Check env keys
  const hasEnvGroq = Boolean(import.meta.env.VITE_GROQ_API_KEY);
  const hasEnvGemini = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveGroqKey = (key: string) => {
    setUserGroqKey(key);
    localStorage.setItem("groq_api_key", key);
  };

  const handleSaveGeminiKey = (key: string) => {
    setUserGeminiKey(key);
    localStorage.setItem("gemini_api_key", key);
  };

  const handleRunAiTailor = async () => {
    setErrorMsg(null);

    if (!jobDescription.trim()) {
      setErrorMsg("Please paste a target Job Description (JD) in the text area.");
      return;
    }

    setIsLoading(true);
    try {
      if (userGroqKey) handleSaveGroqKey(userGroqKey);
      if (userGeminiKey) handleSaveGeminiKey(userGeminiKey);

      const tailored: TailorResponse = await tailorResumeWithAI(
        jobDescription,
        selectedModel,
        userGroqKey,
        userGeminiKey,
        resumeData
      );

      setActiveResume({
        ...resumeData,
        title: tailored.title || resumeData.title,
        summary: tailored.summary || resumeData.summary,
        skills: tailored.skills && tailored.skills.length > 0 ? tailored.skills : resumeData.skills,
        projects:
          tailored.projects && tailored.projects.length > 0
            ? tailored.projects.map((p, idx) => ({
                ...resumeData.projects[idx],
                name: p.name || resumeData.projects[idx]?.name || "",
                subtitle: p.subtitle || resumeData.projects[idx]?.subtitle || "",
                tech: p.tech || resumeData.projects[idx]?.tech || [],
                bullets: p.bullets || resumeData.projects[idx]?.bullets || [],
              }))
            : resumeData.projects,
      });

      setIsTailored(true);
      setTailoredRole(tailored.title);
      setIsLoading(false);
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "Failed to tailor resume with AI.";
      setErrorMsg(message);
    }
  };

  const handleResetResume = () => {
    setActiveResume(resumeData);
    setIsTailored(false);
    setTailoredRole("");
    setErrorMsg(null);
  };

  const currentSelectedOption =
    ALL_AI_MODELS.find((m) => m.id === selectedModel) || ALL_AI_MODELS[0];

  return (
    <div className="min-h-screen flex flex-col items-center pb-[80px] bg-zinc-100/70 text-zinc-900 font-sans print:bg-white print:pb-0 relative">
      {/* Top Header Bar with Shadcn Zinc Styling */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs sticky top-0 z-40 print:hidden transition-all">
        <div className="max-w-[1700px] mx-auto px-3 sm:px-6 py-2.5 flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Brand & Sidebar Toggle */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Sidebar Toggle Button */}
              <Button
                variant={isSidebarOpen ? "default" : "outline"}
                size="sm"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                title="Toggle Sidebar (Ctrl+B / ⌘B)"
              >
                <PanelLeftIcon size={15} />
                <span className="hidden sm:inline">
                  {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                </span>
                <kbd className="hidden md:inline-block ml-1 px-1 py-0.2 bg-zinc-800 text-[10px] text-zinc-300 rounded font-mono border border-zinc-700">
                  ⌘B
                </kbd>
              </Button>

              <span className="text-xs sm:text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-1.5">
                <SparklesIcon size={15} className="text-indigo-600" />
                <span>Agentic AI Resume</span>
              </span>
            </div>

            {/* Status Badge */}
            {isTailored ? (
              <Badge variant="success">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Tailored</span>
              </Badge>
            ) : (
              <Badge variant="ai">
                <BotIcon size={12} />
                <span>Groq & Gemini</span>
              </Badge>
            )}
          </div>

          {/* Touch-Optimized Spacing Stepper Controls */}
          <div className="w-full lg:w-auto grid grid-cols-2 md:grid-cols-4 lg:flex items-center justify-between gap-2 bg-zinc-100/90 border border-zinc-200 p-1.5 sm:px-2.5 sm:py-1 rounded-xl shadow-2xs text-xs">
            {/* Font Size Stepper */}
            <div className="flex items-center justify-between gap-1 bg-white border border-zinc-200 p-1 rounded-lg shadow-2xs">
              <span className="font-bold text-zinc-700 text-[11px] shrink-0 pl-1">🔤 Font:</span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setFontSize((prev) => Math.max(9.5, parseFloat((prev - 0.5).toFixed(1))))}
                  className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
                  title="Decrease Font Size"
                >
                  −
                </button>
                <input
                  type="number"
                  step="0.5"
                  min="9.5"
                  max="14.5"
                  value={fontSize}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) setFontSize(val);
                  }}
                  className="w-11 text-center font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 rounded py-0.5 text-[11px] focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                />
                <button
                  onClick={() => setFontSize((prev) => Math.min(14.5, parseFloat((prev + 0.5).toFixed(1))))}
                  className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
                  title="Increase Font Size"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Line Height Stepper */}
            <div className="flex items-center justify-between gap-1 bg-white border border-zinc-200 p-1 rounded-lg shadow-2xs">
              <span className="font-bold text-zinc-700 text-[11px] shrink-0 pl-1">↕️ Height:</span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setLineHeight((prev) => Math.max(1.1, parseFloat((prev - 0.05).toFixed(2))))}
                  className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
                  title="Decrease Line Height"
                >
                  −
                </button>
                <input
                  type="number"
                  step="0.05"
                  min="1.1"
                  max="1.6"
                  value={lineHeight}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) setLineHeight(val);
                  }}
                  className="w-11 text-center font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 rounded py-0.5 text-[11px] focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                />
                <button
                  onClick={() => setLineHeight((prev) => Math.min(1.6, parseFloat((prev + 0.05).toFixed(2))))}
                  className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
                  title="Increase Line Height"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Section Gap Stepper */}
            <div className="flex items-center justify-between gap-1 bg-white border border-zinc-200 p-1 rounded-lg shadow-2xs">
              <span className="font-bold text-zinc-700 text-[11px] shrink-0 pl-1">📏 Gap:</span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => {
                    setSectionGap((prev) => {
                      const next = Math.max(4, prev - 1);
                      setProjectGap(Math.round(next * 0.75));
                      return next;
                    });
                  }}
                  className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
                  title="Decrease Section Gap"
                >
                  −
                </button>
                <input
                  type="number"
                  step="1"
                  min="4"
                  max="28"
                  value={sectionGap}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      setSectionGap(val);
                      setProjectGap(Math.round(val * 0.75));
                    }
                  }}
                  className="w-10 text-center font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 rounded py-0.5 text-[11px] focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setSectionGap((prev) => {
                      const next = Math.min(28, prev + 1);
                      setProjectGap(Math.round(next * 0.75));
                      return next;
                    });
                  }}
                  className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
                  title="Increase Section Gap"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Padding Stepper */}
            <div className="flex items-center justify-between gap-1 bg-white border border-zinc-200 p-1 rounded-lg shadow-2xs">
              <span className="font-bold text-zinc-700 text-[11px] shrink-0 pl-1">🖼️ Pad:</span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => {
                    setPaddingY((prev) => {
                      const next = Math.max(12, prev - 2);
                      setPaddingX(Math.round(next * 1.25));
                      return next;
                    });
                  }}
                  className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
                  title="Decrease Padding"
                >
                  −
                </button>
                <input
                  type="number"
                  step="2"
                  min="12"
                  max="48"
                  value={paddingY}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      setPaddingY(val);
                      setPaddingX(Math.round(val * 1.25));
                    }
                  }}
                  className="w-10 text-center font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 rounded py-0.5 text-[11px] focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setPaddingY((prev) => {
                      const next = Math.min(48, prev + 2);
                      setPaddingX(Math.round(next * 1.25));
                      return next;
                    });
                  }}
                  className="w-5 h-5 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded text-xs transition-colors cursor-pointer"
                  title="Increase Padding"
                >
                  ＋
                </button>
              </div>
            </div>
          </div>

          {/* Action Header Buttons: Reset & Download PDF */}
          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetResume}
              title="Reset resume to original master data"
            >
              <RefreshCwIcon size={13} />
              <span>Reset</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handlePrint}
            >
              <PrinterIcon size={15} />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="w-full max-w-[1700px] mx-auto px-2 sm:px-4 my-4 sm:my-6 flex items-start justify-center gap-6 relative print:m-0 print:p-0 print:block">
        {/* Mobile / Tablet Drawer Backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs z-40 xl:hidden print:hidden"
          />
        )}

        {/* Toggleable Sidebar (Desktop Docked or Slide-Out + Mobile Off-Canvas Drawer) */}
        <aside
          className={`
            fixed xl:sticky top-0 xl:top-[68px] left-0 z-50 xl:z-20 h-full xl:h-[calc(100vh-88px)]
            bg-white border-r xl:border border-zinc-200 xl:rounded-2xl shadow-2xl xl:shadow-lg
            transition-all duration-300 ease-in-out shrink-0 print:hidden flex flex-col overflow-hidden
            ${
              isSidebarOpen
                ? "w-[92vw] sm:w-[460px] xl:w-[460px] translate-x-0 opacity-100"
                : "w-0 -translate-x-full xl:translate-x-0 xl:w-0 xl:p-0 xl:border-0 opacity-0 pointer-events-none"
            }
          `}
        >
          {/* Sidebar Header (Shadcn Style) */}
          <div className="bg-zinc-950 text-white px-4 py-3 flex items-center justify-between shrink-0 border-b border-zinc-800 select-none">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-400/30">
                {activeTab === "ai" ? <SparklesIcon size={16} /> : <Edit3Icon size={16} />}
              </div>
              <div>
                <h2 className="text-xs font-bold text-zinc-100 leading-none">
                  {activeTab === "ai" ? "AI Resume Tailor" : "Resume UI Editor"}
                </h2>
                <span className="text-[10px] text-zinc-400 font-medium">
                  {activeTab === "ai" ? "ATS Keyword Alignment" : "Interactive Field Editor"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Badge variant="success">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Sync</span>
              </Badge>

              {/* Close Button */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Collapse Sidebar"
              >
                <ChevronLeftIcon size={18} />
              </button>
            </div>
          </div>

          {/* Shadcn-Style Segmented Tabs */}
          <div className="p-2.5 bg-zinc-50 border-b border-zinc-200 shrink-0">
            <div className="grid grid-cols-2 p-1 bg-zinc-200/80 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveTab("ai")}
                className={`py-1.5 px-3 flex items-center justify-center gap-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === "ai"
                    ? "bg-white text-zinc-900 shadow-xs font-bold"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <SparklesIcon size={13} />
                <span>AI Tailor</span>
              </button>
              <button
                onClick={() => setActiveTab("edit")}
                className={`py-1.5 px-3 flex items-center justify-center gap-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === "edit"
                    ? "bg-white text-zinc-900 shadow-xs font-bold"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Edit3Icon size={13} />
                <span>UI Editor</span>
              </button>
            </div>
          </div>

          {/* Sidebar Body Content */}
          <div className="flex-1 overflow-y-auto bg-white">
            {activeTab === "ai" ? (
              <div className="p-4 space-y-4 text-xs">
                {/* 1. Model Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-zinc-800 text-xs flex items-center gap-1.5">
                      <BotIcon size={14} />
                      <span>1. Select AI Model:</span>
                    </label>
                    <Badge variant={currentSelectedOption.provider === "groq" ? "secondary" : "ai"}>
                      {currentSelectedOption.provider === "groq" ? "⚡ Groq LPU" : "✨ Gemini"}
                    </Badge>
                  </div>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 font-bold text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <optgroup label="⚡ Groq Models (Ultra-Fast LPUs)">
                      {ALL_AI_MODELS.filter((m) => m.provider === "groq").map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="✨ Google Gemini Models">
                      {ALL_AI_MODELS.filter((m) => m.provider === "gemini").map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Manual Key override if .env keys missing */}
                {(!hasEnvGroq && currentSelectedOption.provider === "groq") ||
                (!hasEnvGemini && currentSelectedOption.provider === "gemini") ? (
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Enter API Key:</label>
                    <Input
                      type="password"
                      placeholder="Paste Key Here..."
                      value={currentSelectedOption.provider === "groq" ? userGroqKey : userGeminiKey}
                      onChange={(e) =>
                        currentSelectedOption.provider === "groq"
                          ? handleSaveGroqKey(e.target.value)
                          : handleSaveGeminiKey(e.target.value)
                      }
                      className="font-mono"
                    />
                  </div>
                ) : null}

                {/* 2. Job Description Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-zinc-800 text-xs">
                      2. Paste Job Description (JD):
                    </label>
                    <div className="flex items-center gap-2">
                      {jobDescription.length > 0 && (
                        <>
                          <span className="text-[10px] text-zinc-500 font-semibold bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                            {jobDescription.length} chars
                          </span>
                          <button
                            onClick={() => setJobDescription("")}
                            className="text-[11px] text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer"
                          >
                            Clear
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <Textarea
                    rows={8}
                    placeholder="Paste job description text from LinkedIn, Internshala, Wellfound, or company portals here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[180px] max-h-[360px] bg-zinc-50 border-zinc-300"
                  />
                </div>

                {/* 3. Action Button */}
                <div className="pt-1 space-y-2">
                  <Button
                    disabled={isLoading}
                    onClick={handleRunAiTailor}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2.5 rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Tailoring via AI...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon size={15} />
                        <span>Tailor Resume with AI</span>
                      </>
                    )}
                  </Button>

                  {isTailored && (
                    <Button
                      variant="outline"
                      onClick={handleResetResume}
                      className="w-full"
                    >
                      <RefreshCwIcon size={13} />
                      <span>Reset to Original Resume</span>
                    </Button>
                  )}
                </div>

                {/* Error / Success Notifications */}
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-[11px]">
                    <span className="font-bold">⚠️ Error: </span>
                    {errorMsg}
                  </div>
                )}

                {isTailored && !errorMsg && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg text-[11px]">
                    <div className="font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Tailored for: {tailoredRole}</span>
                    </div>
                    <p className="text-[10px] text-emerald-700 mt-0.5">
                      Resume updated live on the canvas 👉
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <ResumeEditorPanel
                resume={activeResume}
                onChange={(updated) => setActiveResume(updated)}
                onReset={handleResetResume}
              />
            )}
          </div>
        </aside>

        {/* Right / Center Canvas: Live Resume Preview */}
        <main className="flex-1 flex justify-center w-full min-w-0 transition-all duration-300">

        {/* Right Side: Live Resume Container */}
        <div
          id="resume-page"
          ref={resumeRef}
          style={
            {
              padding: `${paddingY}px ${paddingX}px`,
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              "--resume-font-size": `${fontSize}px`,
              "--resume-line-height": lineHeight,
              "--resume-padding": `${paddingY}px ${paddingX}px`,
              "--resume-section-gap": `${sectionGap}px`,
            } as React.CSSProperties
          }
          className="w-full max-w-[794px] bg-white shadow-xl rounded border border-slate-200 relative overflow-hidden transition-all duration-150 ease-out print:overflow-visible print:m-0 print:shadow-none print:border-none print:w-full print:rounded-none max-md:p-[24px_16px] max-md:mt-0 max-md:rounded-none"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[5px] bg-slate-900 print:bg-slate-900 print:h-[5px]"></div>

          {/* Edit Hint Banner (Non-printable) */}
          <div className="mb-3 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold rounded-lg flex items-center justify-between print:hidden select-none">
            <span className="flex items-center gap-1.5">
              <span>✏️</span>
              <span><strong>Click-to-Edit Resume:</strong> Click on any text directly on this resume to edit it!</span>
            </span>
            <span className="text-[10px] bg-amber-200/60 px-2 py-0.5 rounded text-amber-900">Live Sync</span>
          </div>

          {/* Header - Single Column ATS Optimized */}
          <header className="flex flex-col items-center text-center mb-2 print:mb-1.5">
            <h1
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleEditableBlur("name", e.currentTarget.innerText)}
              className={`text-[2.2em] font-black text-slate-900 leading-tight tracking-tight uppercase print:font-extrabold mb-0.5 ${editableClass}`}
            >
              {activeResume.name}
            </h1>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleEditableBlur("title", e.currentTarget.innerText)}
              className={`text-[1.1em] font-bold tracking-widest text-slate-600 uppercase mb-1.5 ${editableClass}`}
            >
              {activeResume.title}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.95em] text-slate-700">
              {"location" in activeResume.contact && activeResume.contact.location && (
                <span className="flex items-center gap-1">
                  <span className="text-slate-500"><MapPinIcon size={13} /></span>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleEditableBlur("contact.location", e.currentTarget.innerText)}
                    className={editableClass}
                  >
                    {activeResume.contact.location}
                  </span>
                </span>
              )}
              {"phone" in activeResume.contact && activeResume.contact.phone && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-slate-700 decoration-transparent">
                    <span className="text-slate-500"><PhoneIcon size={13} /></span>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleEditableBlur("contact.phone", e.currentTarget.innerText)}
                      className={editableClass}
                    >
                      {activeResume.contact.phone}
                    </span>
                  </span>
                </>
              )}
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-700 decoration-transparent">
                <span className="text-slate-500"><MailIcon size={13} /></span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleEditableBlur("contact.email", e.currentTarget.innerText)}
                  className={editableClass}
                >
                  {activeResume.contact.email}
                </span>
              </span>
              <span className="text-slate-300">•</span>
              <a href={activeResume.contact.linkedin} className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors decoration-transparent" target="_blank" rel="noreferrer">
                <span className="text-slate-500"><LinkedInIcon /></span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleEditableBlur("contact.linkedin", e.currentTarget.innerText)}
                  className={editableClass}
                >
                  {activeResume.contact.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              </a>
              <span className="text-slate-300">•</span>
              <a href={activeResume.contact.github} className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors decoration-transparent" target="_blank" rel="noreferrer">
                <span className="text-slate-500"><GitHubIcon /></span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleEditableBlur("contact.github", e.currentTarget.innerText)}
                  className={editableClass}
                >
                  {activeResume.contact.github.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              </a>
            </div>
          </header>

          {/* Divider */}
          <div className="h-px bg-slate-300 my-2 print:my-1.5"></div>

          {/* Summary */}
          <section style={{ marginBottom: `${sectionGap}px` }} className="break-inside-avoid">
            <h2 className="text-[1.05em] font-bold tracking-[0.1em] uppercase text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1 inline-block">
              Professional Summary
            </h2>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleEditableBlur("summary", e.currentTarget.innerText)}
              className={`text-[1em] text-slate-700 text-justify ${editableClass}`}
            >
              {activeResume.summary}
            </p>
          </section>

          {/* Technical Skills */}
          <section style={{ marginBottom: `${sectionGap}px` }} className="break-inside-avoid">
            <h2 className="text-[1.05em] font-bold tracking-[0.1em] uppercase text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1 inline-block">
              Technical Skills
            </h2>
            <div className="flex flex-col gap-1">
              {activeResume.skills.map((skillGroup, sIdx) => (
                <div key={sIdx} className="flex items-start gap-1.5 text-[0.98em]">
                  <span className="text-slate-500 font-bold select-none text-[0.9em] mt-[2px]">•</span>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleEditableBlur(`skillCat.${sIdx}`, e.currentTarget.innerText)}
                    className={`font-bold text-slate-800 shrink-0 ${editableClass}`}
                  >
                    {skillGroup.category}
                  </span>
                  <span className="font-bold text-slate-800">:</span>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleEditableBlur(`skillItems.${sIdx}`, e.currentTarget.innerText)}
                    className={`text-slate-700 flex-1 ${editableClass}`}
                  >
                    {skillGroup.items.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Projects / Technical Experience */}
          <section style={{ marginBottom: `${sectionGap}px` }}>
            <h2 className="text-[1.05em] font-bold tracking-[0.1em] uppercase text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1.5 inline-block">
              Technical Experience & Projects
            </h2>
            <div className="flex flex-col" style={{ gap: `${projectGap}px` }}>
              {activeResume.projects.map((project, idx) => (
                <div key={idx} className="break-inside-avoid print:break-inside-avoid">
                  <div className="flex items-start justify-between gap-3 mb-0.5 flex-wrap">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleEditableBlur(`projName.${idx}`, e.currentTarget.innerText)}
                        className={`text-[1.12em] font-bold text-slate-900 ${editableClass}`}
                      >
                        {project.name}
                      </h3>
                      <span className="text-[1.02em] text-slate-600 font-medium">|</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleEditableBlur(`projSubtitle.${idx}`, e.currentTarget.innerText)}
                        className={`text-[1.02em] text-slate-600 font-medium ${editableClass}`}
                      >
                        {project.subtitle}
                      </span>
                    </div>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[0.9em] text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1 transition-colors decoration-transparent"
                      >
                        <span>Live Demo</span>
                        <span className="hidden print:inline text-slate-400 font-normal ml-0.5">
                          ({getCleanDomain(project.demoUrl)})
                        </span>
                        <ExternalLinkIcon size={13} />
                      </a>
                    )}
                  </div>
                  <div className="mb-0.5 flex items-baseline gap-1">
                    <span className="text-[0.95em] font-semibold text-slate-700 shrink-0">Technologies:</span>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleEditableBlur(`projTech.${idx}`, e.currentTarget.innerText)}
                      className={`text-[0.95em] text-slate-600 italic ${editableClass}`}
                    >
                      {project.tech.join(", ")}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-0.5 list-none ml-0.5">
                    {project.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-[1em] text-slate-700">
                        <span className="text-slate-600 font-bold select-none text-[11px] mt-[1px]">•</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleEditableBlur(`projBullet.${idx}.${bIdx}`, e.currentTarget.innerText)}
                          className={`flex-1 ${editableClass}`}
                        >
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="mb-0 break-inside-avoid print:break-inside-avoid">
            <h2 className="text-[1.05em] font-bold tracking-[0.1em] uppercase text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1.5 inline-block">
              Education
            </h2>
            <div className="flex items-start justify-between gap-4 print:break-inside-avoid">
              <div className="flex-1">
                <h3
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleEditableBlur("edu.degree", e.currentTarget.innerText)}
                  className={`text-[1.12em] font-bold text-slate-900 mb-0.5 ${editableClass}`}
                >
                  {activeResume.education.degree}
                </h3>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleEditableBlur("edu.institution", e.currentTarget.innerText)}
                  className={`text-[1.02em] text-slate-700 font-medium ${editableClass}`}
                >
                  {activeResume.education.institution}
                </p>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleEditableBlur("edu.cgpa", e.currentTarget.innerText)}
                  className={`text-[0.95em] text-slate-600 mt-0.5 ${editableClass}`}
                >
                  {activeResume.education.cgpa}
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5 shrink-0">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleEditableBlur("edu.duration", e.currentTarget.innerText)}
                  className={`text-[1.02em] font-semibold text-slate-800 ${editableClass}`}
                >
                  {activeResume.education.duration}
                </span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleEditableBlur("edu.location", e.currentTarget.innerText)}
                  className={`text-[0.95em] text-slate-500 ${editableClass}`}
                >
                  {activeResume.education.location}
                </span>
              </div>
            </div>
          </section>

        </div>
        </main>

      </div>

    </div>
  );
}

