import React from "react";
import { ALL_AI_MODELS } from "../aiTailor";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { SparklesIcon, RefreshCwIcon } from "../icons";

interface AiTailorPanelProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  userGroqKey: string;
  onSaveGroqKey: (key: string) => void;
  userGeminiKey: string;
  onSaveGeminiKey: (key: string) => void;
  hasEnvGroq: boolean;
  hasEnvGemini: boolean;
  jobDescription: string;
  onChangeJobDescription: (jd: string) => void;
  isLoading: boolean;
  isTailored: boolean;
  tailoredRole: string;
  errorMsg: string | null;
  onRunAiTailor: () => void;
  onResetResume: () => void;
}

export const AiTailorPanel: React.FC<AiTailorPanelProps> = ({
  selectedModel,
  onSelectModel,
  userGroqKey,
  onSaveGroqKey,
  userGeminiKey,
  onSaveGeminiKey,
  hasEnvGroq,
  hasEnvGemini,
  jobDescription,
  onChangeJobDescription,
  isLoading,
  isTailored,
  tailoredRole,
  errorMsg,
  onRunAiTailor,
  onResetResume,
}) => {
  const currentSelectedOption =
    ALL_AI_MODELS.find((m) => m.id === selectedModel) || ALL_AI_MODELS[0];

  return (
    <div className="p-4 space-y-3.5 text-xs overflow-y-auto flex-1">
      {/* 1. Model Selector */}
      <div className="space-y-1.5">
        <label className="font-bold text-zinc-800 text-xs block">
          1. Select Tailoring Model:
        </label>
        <select
          value={selectedModel}
          onChange={(e) => onSelectModel(e.target.value)}
          className="w-full p-2 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900 font-medium text-xs focus:ring-2 focus:ring-zinc-900 focus:outline-none"
        >
          <optgroup label="⚡ Groq LPUs (Ultra Fast)">
            {ALL_AI_MODELS.filter((m) => m.provider === "groq").map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.provider.toUpperCase()})
              </option>
            ))}
          </optgroup>
          <optgroup label="✨ Google Gemini (High Intelligence)">
            {ALL_AI_MODELS.filter((m) => m.provider === "gemini").map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.provider.toUpperCase()})
              </option>
            ))}
          </optgroup>
        </select>
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>Provider: {currentSelectedOption.provider.toUpperCase()}</span>
          {((currentSelectedOption.provider === "groq" && hasEnvGroq) ||
            (currentSelectedOption.provider === "gemini" && hasEnvGemini)) && (
            <Badge variant="success" className="text-[10px] py-0">
              API Key Configured
            </Badge>
          )}
        </div>
      </div>

      {/* Manual Key override if .env keys missing */}
      {(!hasEnvGroq && currentSelectedOption.provider === "groq") ||
      (!hasEnvGemini && currentSelectedOption.provider === "gemini") ? (
        <div className="space-y-1">
          <label className="font-bold text-zinc-700">Enter API Key:</label>
          <Input
            type="password"
            placeholder="Paste Key Here..."
            value={
              currentSelectedOption.provider === "groq"
                ? userGroqKey
                : userGeminiKey
            }
            onChange={(e) =>
              currentSelectedOption.provider === "groq"
                ? onSaveGroqKey(e.target.value)
                : onSaveGeminiKey(e.target.value)
            }
            className="font-mono"
          />
        </div>
      ) : null}

      {/* 2. Job Description Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="font-bold text-zinc-800 text-xs">
            2. Paste Target Job Description (JD):
          </label>
          <div className="flex items-center gap-2">
            {jobDescription.length > 0 && (
              <>
                <span className="text-[10px] text-zinc-500 font-semibold bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                  {jobDescription.length} chars
                </span>
                <button
                  onClick={() => onChangeJobDescription("")}
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
          onChange={(e) => onChangeJobDescription(e.target.value)}
          className="min-h-[180px] max-h-[360px] bg-zinc-50 border-zinc-300"
        />
      </div>

      {/* 3. Action Button */}
      <div className="pt-1 space-y-2">
        <Button
          disabled={isLoading}
          onClick={onRunAiTailor}
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
            onClick={onResetResume}
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
  );
};
