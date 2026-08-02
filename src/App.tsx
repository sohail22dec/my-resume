import { useRef, useState, useEffect } from "react";
import { resumeData } from "./resumeData";
import type { ResumeDataType } from "./resumeData";
import { LinkedInIcon, GitHubIcon, MailIcon, PhoneIcon, MapPinIcon, PrinterIcon, ExternalLinkIcon } from "./icons";
import { tailorResumeWithAI, ALL_AI_MODELS } from "./aiTailor";
import type { TailorResponse } from "./aiTailor";

const getCleanDomain = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/https?:\/\/(www\.)?/, "");
  }
};

export default function App() {
  const resumeRef = useRef<HTMLDivElement>(null);

  // Resume Data State (Can be tailored by AI)
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
  const [userGroqKey, setUserGroqKey] = useState<string>("");
  const [userGeminiKey, setUserGeminiKey] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("openai/gpt-oss-120b");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAiPanelCollapsed, setIsAiPanelCollapsed] = useState<boolean>(false);

  // Check env keys
  const hasEnvGroq = Boolean(import.meta.env.VITE_GROQ_API_KEY);
  const hasEnvGemini = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

  useEffect(() => {
    const savedGroq = localStorage.getItem("groq_api_key");
    const savedGemini = localStorage.getItem("gemini_api_key");
    if (savedGroq) setUserGroqKey(savedGroq);
    if (savedGemini) setUserGeminiKey(savedGemini);
  }, []);

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
        projects: tailored.projects && tailored.projects.length > 0
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
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || "Failed to tailor resume with AI.");
    }
  };

  const handleResetResume = () => {
    setActiveResume(resumeData);
    setIsTailored(false);
    setTailoredRole("");
    setErrorMsg(null);
  };

  const currentSelectedOption = ALL_AI_MODELS.find((m) => m.id === selectedModel) || ALL_AI_MODELS[0];

  return (
    <div className="min-h-screen flex flex-col items-center pb-[80px] bg-slate-100 text-slate-900 font-sans print:bg-white print:pb-0 relative">

      {/* Top Header Bar with Mobile-Optimized Spacing Controls & Download PDF */}
      <div className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40 print:hidden">
        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Brand Badge & Status */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-2 shrink-0">
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">✨ Agentic AI Resume</span>
            {isTailored ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Tailored</span>
              </div>
            ) : (
              <span className="text-[10px] sm:text-[11px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-bold border border-purple-200">
                Groq & Gemini AI
              </span>
            )}
          </div>

          {/* Touch-Optimized Spacing Stepper Controls (Plus/Minus Buttons + Direct Editable Number Input) */}
          <div className="w-full lg:w-auto grid grid-cols-2 md:grid-cols-4 lg:flex items-center justify-between gap-2.5 bg-slate-50 border border-slate-200 p-2 sm:px-3 sm:py-1.5 rounded-xl shadow-inner text-xs">
            
            {/* Font Size Stepper */}
            <div className="flex items-center justify-between gap-1 bg-white border border-slate-200 p-1 sm:p-1.5 rounded-lg shadow-2xs">
              <span className="font-bold text-slate-700 text-[11px] sm:text-xs shrink-0 pl-0.5">🔤 Font:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFontSize((prev) => Math.max(9.5, parseFloat((prev - 0.5).toFixed(1))))}
                  className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded text-xs transition-colors cursor-pointer"
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
                  className="w-12 text-center font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded py-0.5 text-[11px] sm:text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
                <button
                  onClick={() => setFontSize((prev) => Math.min(14.5, parseFloat((prev + 0.5).toFixed(1))))}
                  className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded text-xs transition-colors cursor-pointer"
                  title="Increase Font Size"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Line Height Stepper */}
            <div className="flex items-center justify-between gap-1 bg-white border border-slate-200 p-1 sm:p-1.5 rounded-lg shadow-2xs">
              <span className="font-bold text-slate-700 text-[11px] sm:text-xs shrink-0 pl-0.5">↕️ Height:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLineHeight((prev) => Math.max(1.1, parseFloat((prev - 0.05).toFixed(2))))}
                  className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded text-xs transition-colors cursor-pointer"
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
                  className="w-12 text-center font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded py-0.5 text-[11px] sm:text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
                <button
                  onClick={() => setLineHeight((prev) => Math.min(1.6, parseFloat((prev + 0.05).toFixed(2))))}
                  className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded text-xs transition-colors cursor-pointer"
                  title="Increase Line Height"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Section Gap Stepper */}
            <div className="flex items-center justify-between gap-1 bg-white border border-slate-200 p-1 sm:p-1.5 rounded-lg shadow-2xs">
              <span className="font-bold text-slate-700 text-[11px] sm:text-xs shrink-0 pl-0.5">📏 Gap:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setSectionGap((prev) => {
                      const next = Math.max(4, prev - 1);
                      setProjectGap(Math.round(next * 0.75));
                      return next;
                    });
                  }}
                  className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded text-xs transition-colors cursor-pointer"
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
                  className="w-11 text-center font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded py-0.5 text-[11px] sm:text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setSectionGap((prev) => {
                      const next = Math.min(28, prev + 1);
                      setProjectGap(Math.round(next * 0.75));
                      return next;
                    });
                  }}
                  className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded text-xs transition-colors cursor-pointer"
                  title="Increase Section Gap"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Padding Stepper */}
            <div className="flex items-center justify-between gap-1 bg-white border border-slate-200 p-1 sm:p-1.5 rounded-lg shadow-2xs">
              <span className="font-bold text-slate-700 text-[11px] sm:text-xs shrink-0 pl-0.5">🖼️ Pad:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setPaddingY((prev) => {
                      const next = Math.max(12, prev - 2);
                      setPaddingX(Math.round(next * 1.25));
                      return next;
                    });
                  }}
                  className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded text-xs transition-colors cursor-pointer"
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
                  className="w-11 text-center font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded py-0.5 text-[11px] sm:text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setPaddingY((prev) => {
                      const next = Math.min(48, prev + 2);
                      setPaddingX(Math.round(next * 1.25));
                      return next;
                    });
                  }}
                  className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded text-xs transition-colors cursor-pointer"
                  title="Increase Padding"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* Full-width Download PDF Button on Mobile */}
          <button
            className="w-full lg:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white border-none px-5 py-2.5 sm:py-2 rounded-lg text-xs font-bold cursor-pointer transition-all hover:bg-slate-800 tracking-wide shadow-sm shrink-0"
            onClick={handlePrint}
          >
            <PrinterIcon size={16} />
            Download / Print PDF
          </button>

        </div>
      </div>

      {/* Dual-Pane Side-by-Side Main Container */}
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-6 my-6 flex flex-col xl:flex-row items-start justify-center gap-6 print:m-0 print:p-0 print:block">

        {/* Left Side: AI Resume Tailor Panel (Sticky & Viewport Bounded on large screens - Bigger Mode) */}
        <div className="w-full xl:w-[480px] bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden shrink-0 print:hidden xl:sticky xl:top-[68px] xl:max-h-[calc(100vh-80px)] flex flex-col">

          {/* Panel Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <span className="text-base">✨</span>
              <h2 className="text-sm font-extrabold tracking-tight">AI Resume Tailor</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>.env Active</span>
              </span>
              <button
                onClick={() => setIsAiPanelCollapsed(!isAiPanelCollapsed)}
                className="text-slate-400 hover:text-white font-extrabold text-sm px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
                title={isAiPanelCollapsed ? "Expand Panel" : "Minimize Panel"}
              >
                {isAiPanelCollapsed ? "＋" : "−"}
              </button>
            </div>
          </div>

          {/* Panel Body (Collapsible - Bigger Mode) */}
          {!isAiPanelCollapsed && (
            <div className="p-5 space-y-4 text-xs overflow-y-auto flex-1">

              {/* 1. Model Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs">1. Select AI Model:</label>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {currentSelectedOption.provider === "groq" ? "⚡ Groq LPU" : "✨ Gemini"}
                  </span>
                </div>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer shadow-2xs"
                >
                  <optgroup label="⚡ Groq Models (Ultra-Fast LPUs)">
                    {ALL_AI_MODELS.filter(m => m.provider === "groq").map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="✨ Google Gemini Models">
                    {ALL_AI_MODELS.filter(m => m.provider === "gemini").map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Manual Key override if .env keys missing */}
              {(!hasEnvGroq && currentSelectedOption.provider === "groq") || (!hasEnvGemini && currentSelectedOption.provider === "gemini") ? (
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Enter API Key:</label>
                  <input
                    type="password"
                    placeholder="Paste Key Here..."
                    value={currentSelectedOption.provider === "groq" ? userGroqKey : userGeminiKey}
                    onChange={(e) => currentSelectedOption.provider === "groq" ? handleSaveGroqKey(e.target.value) : handleSaveGeminiKey(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              ) : null}

              {/* 2. Job Description Textarea - Bigger Mode */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs">2. Paste Job Description (JD):</label>
                  <div className="flex items-center gap-2">
                    {jobDescription.length > 0 && (
                      <>
                        <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
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
                <textarea
                  rows={10}
                  placeholder="Paste job description text from LinkedIn, Internshala, TARS, or any hiring portal here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 leading-relaxed text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y min-h-[220px] max-h-[380px] shadow-inner font-sans"
                />
              </div>

              {/* 3. Action Buttons */}
              <div className="pt-1 space-y-2">
                <button
                  disabled={isLoading}
                  onClick={handleRunAiTailor}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-3.5 rounded-xl font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 text-xs tracking-wide"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Tailoring via AI...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀 Tailor Resume with AI</span>
                    </>
                  )}
                </button>

                {isTailored && (
                  <button
                    onClick={handleResetResume}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg font-bold transition-colors cursor-pointer text-xs"
                  >
                    🔄 Reset to Original Resume
                  </button>
                )}
              </div>

              {/* Error / Success Notifications */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-[11px]">
                  <span className="font-bold">⚠️ Error: </span>{errorMsg}
                </div>
              )}

              {isTailored && !errorMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg text-[11px]">
                  <div className="font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Tailored for: {tailoredRole}</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 mt-0.5">Resume updated live on the right 👉</p>
                </div>
              )}

            </div>
          )}
        </div>

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

          {/* Header - Single Column ATS Optimized */}
          <header className="flex flex-col items-center text-center mb-2 print:mb-1.5">
            <h1 className="text-[2.2em] font-black text-slate-900 leading-tight tracking-tight uppercase print:font-extrabold mb-0.5">
              {activeResume.name}
            </h1>
            <p className="text-[1.1em] font-bold tracking-widest text-slate-600 uppercase mb-1.5">
              {activeResume.title}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.95em] text-slate-700">
              {"location" in activeResume.contact && activeResume.contact.location && (
                <span className="flex items-center gap-1">
                  <span className="text-slate-500"><MapPinIcon size={13} /></span>
                  <span>{activeResume.contact.location}</span>
                </span>
              )}
              {"phone" in activeResume.contact && activeResume.contact.phone && (
                <>
                  <span className="text-slate-300">•</span>
                  <a href={`tel:${activeResume.contact.phone.replace(/\s+/g, "")}`} className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors decoration-transparent">
                    <span className="text-slate-500"><PhoneIcon size={13} /></span>
                    <span>{activeResume.contact.phone}</span>
                  </a>
                </>
              )}
              <span className="text-slate-300">•</span>
              <a href={`mailto:${activeResume.contact.email}`} className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors decoration-transparent">
                <span className="text-slate-500"><MailIcon size={13} /></span>
                <span>{activeResume.contact.email}</span>
              </a>
              <span className="text-slate-300">•</span>
              <a href={activeResume.contact.linkedin} className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors decoration-transparent" target="_blank" rel="noreferrer">
                <span className="text-slate-500"><LinkedInIcon /></span>
                <span>linkedin.com/in/sohail-islam</span>
              </a>
              <span className="text-slate-300">•</span>
              <a href={activeResume.contact.github} className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors decoration-transparent" target="_blank" rel="noreferrer">
                <span className="text-slate-500"><GitHubIcon /></span>
                <span>github.com/sohail22dec</span>
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
            <p className="text-[1em] text-slate-700 text-justify">{activeResume.summary}</p>
          </section>

          {/* Technical Skills */}
          <section style={{ marginBottom: `${sectionGap}px` }} className="break-inside-avoid">
            <h2 className="text-[1.05em] font-bold tracking-[0.1em] uppercase text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1 inline-block">
              Technical Skills
            </h2>
            <div className="flex flex-col gap-1">
              {activeResume.skills.map((skillGroup) => (
                <div key={skillGroup.category} className="flex items-start gap-1.5 text-[0.98em]">
                  <span className="text-slate-500 font-bold select-none text-[0.9em] mt-[2px]">•</span>
                  <span className="font-bold text-slate-800 shrink-0">{skillGroup.category}:</span>
                  <span className="text-slate-700">{skillGroup.items.join(", ")}</span>
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
                      <h3 className="text-[1.12em] font-bold text-slate-900">{project.name}</h3>
                      <span className="text-[1.02em] text-slate-600 font-medium">| {project.subtitle}</span>
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
                  <div className="mb-0.5">
                    <span className="text-[0.95em] font-semibold text-slate-700 mr-1.5">Technologies:</span>
                    <span className="text-[0.95em] text-slate-600 italic">{project.tech.join(", ")}</span>
                  </div>
                  <ul className="flex flex-col gap-0.5 list-none ml-0.5">
                    {project.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-[1em] text-slate-700">
                        <span className="text-slate-600 font-bold select-none text-[11px] mt-[1px]">•</span>
                        <span>{bullet}</span>
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
                <h3 className="text-[1.12em] font-bold text-slate-900 mb-0.5">{activeResume.education.degree}</h3>
                <p className="text-[1.02em] text-slate-700 font-medium">{activeResume.education.institution}</p>
                <p className="text-[0.95em] text-slate-600 mt-0.5">{activeResume.education.cgpa}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5 shrink-0">
                <span className="text-[1.02em] font-semibold text-slate-800">{activeResume.education.duration}</span>
                <span className="text-[0.95em] text-slate-500">{activeResume.education.location}</span>
              </div>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
