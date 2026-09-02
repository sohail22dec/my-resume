export interface ProjectItem {
  name: string;
  subtitle: string;
  demoUrl?: string;
  videoUrl?: string;
  docUrl?: string;
  tech: string[];
  bullets: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface EducationInfo {
  degree: string;
  institution: string;
  duration: string;
  location: string;
  cgpa: string;
}

export interface ResumeDataType {
  name: string;
  title: string;
  contact: ContactInfo;
  summary: string;
  skills: SkillCategory[];
  projects: ProjectItem[];
  education: EducationInfo;
}

export const resumeData: ResumeDataType = {
  name: "Sohal Islam",
  title: "AI Engineer | Agentic Systems & LLMs",
  contact: {
    email: "sohelsilamblg01@gmail.com",
    phone: "+91 70733 67227",
    location: "West Bengal, India",
    linkedin: "https://www.linkedin.com/in/sohail-islam-64775335b/",
    github: "https://github.com/sohail22dec",
  },
  summary:
    "AI Engineer focused on solving business problems through production-grade agentic architectures and reliable RAG pipelines. Skilled at turning complex workflows into deterministic, guardrailed systems that cut operational costs and deliver fast, trustworthy AI solutions.",
  skills: [
    {
      category: "Languages & Core",
      items: [
        "Python (Asyncio)",
        "SQL (PostgreSQL)",
        "JavaScript",
        "TypeScript",
      ],
    },
    {
      category: "Agentic AI & Orchestration",
      items: [
        "LangGraph (StateGraph)",
        "LangChain",
        "Multi-Agent Workflows",
        "Autonomous Tool Calling",
        "Postgres Checkpointing",
        "Context Engineering",
      ],
    },
    {
      category: "RAG, Evals & Guardrails",
      items: [
        "Corrective RAG (CRAG)",
        "pgvector (Supabase)",
        "Ragas",
        "DeepEval",
        "LangSmith (Tracing & Evals)",
        "Pydantic Guardrails",
        "gpt-oss-safeguard"
      ],
    },
    {
      category: "Model Optimization & Fine-Tuning",
      items: [
        "Hugging Face (PEFT, SFT)",
        "QLoRA & LoRA",
        "4-bit/8-bit Quantization",
        "PyTorch",
        "Groq LPUs",
        "Prompt Caching",
        "GPT-OSS & Qwen 3.6",
      ],
    },
    {
      category: "Backend, Cloud & Web",
      items: [
        "FastAPI (REST APIs, SSE)",
        "Next.js",
        "React",
        "AWS (EC2, S3, ECR, ECS, RDS, CloudWatch)",
        "Docker",
        "CI/CD Pipelines (GitHub Actions)",
        "Git",
      ],
    },
  ],
  projects: [
    {
      name: "DataPilot",
      subtitle: "Autonomous Text-to-SQL & Business Data Intelligence Platform",
      demoUrl: "https://datapilot.duckdns.org",
      videoUrl: "https://lnkd.in/p/dgYMyS9t",
      tech: [
        "LangGraph StateGraph",
        "FastAPI",
        "PostgreSQL",
        "Self-Healing SQL",
        "DeepEval",
        "LangSmith",
        "Groq LPUs",
        "Next.js",
      ],
      bullets: [
        "Engineered an autonomous agent empowering small businesses to extract revenue trends, inventory anomalies, and customer insights via plain English to SQL with self-healing query correction in 1.3s.",
        "Cut query token consumption by 85% (down to $0.00044 / ₹0.037 per query) using relational schema compression, dynamic context row truncation, and sub-0.05ms security checks.",
        "Benchmarked across 210 test scenarios using automated LLM-as-a-Judge, achieving 99.6% data faithfulness and integrating Human-in-the-Loop (HITL) approval gates for critical actions.",
      ],
    },
    {
      name: "Cortex",
      subtitle: "Multi-Agent Corrective RAG (CRAG) & Evaluation Guardrails Platform",
      demoUrl: "https://cortex-ai.duckdns.org",
      tech: [
        "LangGraph",
        "Corrective RAG (CRAG)",
        "pgvector",
        "Groq LPUs",
        "Ragas & DeepEval",
        "Tavily Search",
        "PII Redaction",
        "Security Guardrails",
      ],
      bullets: [
        "Architected an adaptive Corrective RAG (CRAG) state machine dynamically routing queries across pgvector vector search, Tavily web search, and direct LLM generation with 100% route accuracy across 27 evaluation benchmarks.",
        "Engineered automated guardrails and evaluation suite achieving 100% safety & prompt injection blocking (0ms overhead), automated PII redaction, 87.0% faithfulness (groundedness), and 88.9% answer relevance.",
        "Integrated dual-model routing (gemini 3.5 flash lite routing validator + GPT-OSS-120B synthesizer) on Groq LPUs with prompt caching, slashing inference token costs by 74% and eliminating hallucinations.",
      ],
    },
    {
      name: "VaaniBook",
      subtitle: "Real-Time Multilingual Voice AI Agent for Autonomous Restaurant Reservations",
      demoUrl: "https://vaanibook.duckdns.org",
      tech: [
        "Sarvam AI (STT/TTS)",
        "LangGraph",
        "FastAPI",
        "WebSockets",
        "PostgreSQL",
        "Pydantic Guardrails",
        "Groq LPUs",
        "Docker",
      ],
      bullets: [
        "Architected a real-time duplex voice agent using Sarvam AI (Saaras STT & Bulbul TTS) over WebSockets, achieving <800ms end-to-end voice-to-voice latency with native support for code-mixed Hinglish conversations.",
        "Implemented a deterministic LangGraph state machine for multi-turn slot extraction (party size, seating, schedule), driving autonomous tool calls to query PostgreSQL tables and eliminate double-booking conflicts.",
        "Engineered acoustic barge-in handling for natural user interruptions, paired with Pydantic guardrails and automated WhatsApp/SMS booking confirmations, maintaining 98.4% reservation completion rate across benchmark simulations.",
      ],
    },
  ],
  education: {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "DR. C.V. Raman University",
    duration: "2022 - 2025",
    location: "Balurghat, West Bengal",
    cgpa: "CGPA: 8.5",
  },
};
