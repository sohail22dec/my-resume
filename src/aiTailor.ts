export interface TailorResponse {
  title: string;
  summary: string;
  skills: { category: string; items: string[] }[];
  projects: {
    name: string;
    subtitle: string;
    demoUrl?: string;
    tech: string[];
    bullets: string[];
  }[];
}

export interface AIModelOption {
  id: string;
  name: string;
  provider: "groq" | "gemini";
}

export const ALL_AI_MODELS: AIModelOption[] = [
  // Groq Models
  { id: "openai/gpt-oss-120b", name: "Groq: openai/gpt-oss-120b (120B Open-Source)", provider: "groq" },
  { id: "openai/gpt-oss-20b", name: "Groq: openai/gpt-oss-20b (20B Open-Source)", provider: "groq" },
  { id: "llama-3.3-70b-versatile", name: "Groq: llama-3.3-70b-versatile (Llama 70B)", provider: "groq" },
  { id: "qwen/qwen3.6-27b", name: "Groq: qwen/qwen3.6-27b (Qwen 27B)", provider: "groq" },

  // Google Gemini Models
  { id: "gemini-3.5-flash-lite", name: "Google: Gemini 3.5 Flash Lite (Ultra Fast)", provider: "gemini" },
  { id: "gemini-2.5-flash", name: "Google: Gemini 2.5 Flash (Fast)", provider: "gemini" }
];

const SYSTEM_PROMPT = `
You are an elite ATS Resume Optimization Specialist & Senior AI Engineering Recruiter.
Your objective is to tailor the candidate's resume data to achieve a 95%+ ATS Keyword Match Rate and recruiter relevance for the provided Job Description (JD).

CRITICAL CONSTRAINTS & RULES:
1. STRICT AUTHENTICITY: Candidate Name is Sohail Islam, Education is Bachelor's in Computer Application (CGPA 8.5), and Projects are "DocMatch AI", "Cortex", and "Kraya AI Agent". DO NOT invent fake employers or fake degrees.
2. PRESERVE QUANTIFIABLE METRICS: You MUST retain and incorporate all hard performance metrics (e.g., 99.4% intent accuracy, 95%+ response groundedness, 60% latency reduction, 75% token cost savings, <800ms API response time) across project bullet points.
3. TITLE ALIGNMENT: Adapt the "title" string to closely reflect the target job role (e.g., "Agentic AI Engineer", "Python & AI Engineer", "AI Agent Implementation Specialist").
4. SUMMARY REWRITING: Write a high-impact, 3-4 sentence professional summary that organically integrates primary keywords, frameworks, and methodologies required by the JD.
5. SKILLS CATEGORIZATION: Group skills into 4-5 clean technical categories (e.g., "AI & LLM Frameworks", "REST APIs & Backend", "RAG & Guardrails", "Databases & DevOps") containing exact JD keyword terms.
6. PROJECT BULLETS: Provide exactly 3 concise, action-driven bullet points for each of the 3 projects ("DocMatch AI", "Cortex", "Kraya AI Agent") highlighting tools, APIs, and metrics matching the JD requirements.
7. STRICT JSON SCHEMA: Return ONLY valid JSON matching this exact structure. Do NOT change key names:

{
  "title": "string",
  "summary": "string",
  "skills": [
    { "category": "string", "items": ["string"] }
  ],
  "projects": [
    {
      "name": "string",
      "subtitle": "string",
      "demoUrl": "string",
      "tech": ["string"],
      "bullets": ["string"]
    }
  ]
}
`;

/**
 * Universal Tailor Function supporting Groq & Gemini with auto env fallback.
 */
export async function tailorResumeWithAI(
  jobDescription: string,
  modelId: string = "openai/gpt-oss-120b",
  userGroqKey?: string,
  userGeminiKey?: string,
  baseResume?: any
): Promise<TailorResponse> {
  if (!jobDescription || !jobDescription.trim()) {
    throw new Error("Please paste a target Job Description (JD).");
  }

  const selectedOption = ALL_AI_MODELS.find((m) => m.id === modelId) || ALL_AI_MODELS[0];

  const envGroqKey = import.meta.env.VITE_GROQ_API_KEY || "";
  const envGeminiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

  if (selectedOption.provider === "gemini") {
    const finalGeminiKey = (userGeminiKey && userGeminiKey.trim()) || envGeminiKey;
    if (!finalGeminiKey) {
      throw new Error("Missing Gemini API Key. Please provide it in .env or UI.");
    }
    return callGeminiApi(jobDescription, finalGeminiKey, selectedOption.id, baseResume);
  } else {
    const finalGroqKey = (userGroqKey && userGroqKey.trim()) || envGroqKey;
    if (!finalGroqKey) {
      throw new Error("Missing Groq API Key. Please provide it in .env or UI.");
    }
    return callGroqApi(jobDescription, finalGroqKey, selectedOption.id, baseResume);
  }
}

async function callGroqApi(
  jobDescription: string,
  apiKey: string,
  modelId: string,
  baseResume: any
): Promise<TailorResponse> {
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";

  const userPrompt = `
TARGET JOB DESCRIPTION:
${jobDescription}

CANDIDATE BASE RESUME DATA:
${JSON.stringify(baseResume, null, 2)}
`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelId,
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg = errorData.error?.message || `Groq API Error (Status ${response.status})`;
    throw new Error(msg);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;

  if (!rawContent) throw new Error("Received empty response from Groq model.");
  return JSON.parse(rawContent);
}

async function callGeminiApi(
  jobDescription: string,
  apiKey: string,
  modelId: string,
  baseResume: any
): Promise<TailorResponse> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey.trim()}`;

  const fullPrompt = `${SYSTEM_PROMPT}

TARGET JOB DESCRIPTION:
${jobDescription}

CANDIDATE BASE RESUME DATA:
${JSON.stringify(baseResume, null, 2)}
`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg = errorData.error?.message || `Gemini API Error (Status ${response.status})`;
    throw new Error(msg);
  }

  const data = await response.json();
  const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawContent) throw new Error("Received empty response from Gemini model.");
  return JSON.parse(rawContent);
}
