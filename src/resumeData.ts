export const resumeData = {
  name: "Sohail Islam",
  title: "Generative AI Engineer | Agentic AI & LLM Applications",
  contact: {
    email: "sohelsilamblg01@gmail.com",
    phone: "+91 70733 67227",
    location: "West Bengal, India",
    linkedin: "https://www.linkedin.com/in/sohail-islam-64775335b/",
    github: "https://github.com/sohail22dec?tab=repositories",
  },
  summary:
    "Generative AI & Agentic AI Engineer specializing in building production-grade LLM applications, multi-agent workflows, and Agentic RAG systems using LangGraph, FastAPI, and Python. Experienced in agent orchestration, autonomous tool calling, vector retrieval architectures, and fine-tuning open-source LLMs (PEFT, QLoRA, SFT) with PyTorch and Hugging Face. Proven track record of architecting and deploying end-to-end AI platforms—including healthcare triage assistants, autonomous research agents, and hallucination-guarded RAG pipelines—with robust evaluation guardrails (LangSmith, Self-RAG), sub-second latency, and backend reliability.",
  skills: [
    {
      category: "Languages",
      items: ["Python"],
    },
    {
      category: "AI & LLM Frameworks",
      items: [
        "LangGraph",
        "LangChain",
        "Local Hugging Face LLMs",
        "OpenAI API",
        "Gemini API",
        "Prompt Engineering",
      ],
    },
    {
      category: "Agentic AI & RAG",
      items: [
        "Multi-Agent Systems",
        "Autonomous Tool Calling",
        "Agentic RAG (Self-RAG, CRAG)",
        "Vector Search (pgvector)",
        "LangSmith",
        "Ragas",
      ],
    },
    {
      category: "LLM Fine-Tuning & Optimization",
      items: [
        "QLoRA & LoRA",
        "SFT (Supervised Fine-Tuning)",
        "Hugging Face (PEFT, Accelerate)",
        "4-bit/8-bit Quantization",
        "PyTorch"
      ],
    },
    {
      category: "Backend & APIs",
      items: [
        "FastAPI",
        "REST APIs",
        "Asyncio",
        "Server-Sent Events (SSE)",
      ],
    },
    {
      category: "Databases & DevOps",
      items: [
        "PostgreSQL",
        "Supabase",
        "AWS",
        "Docker",
        "CI/CD",
        "Git",
      ],
    },
  ],
  projects: [
    {
      name: "DocMatch AI",
      subtitle: "Production Multi-Agent Healthcare Triage & Booking System",
      demoUrl: "https://docmatch-ai.vercel.app",
      tech: [
        "LangGraph",
        "Agent Orchestration",
        "Tool Calling",
        "FastAPI",
        "Groq LPUs",
        "Google Calendar & Gmail APIs",
        "LangSmith",
        "Docker",
      ],
      bullets: [
        "Architected a production multi-agent state machine in LangGraph & FastAPI with a deterministic router, achieving 99.4% intent routing accuracy across symptom triage, clinic discovery, and appointment booking.",
        "Built automated Tool Calling with Google Calendar & Gmail REST APIs for real-time conflict-free appointment scheduling and instant confirmation notifications.",
        "Integrated Geospatial REST APIs with Supabase OAuth2 & Groq LPUs (Llama-3.3-70B), tracking traces via LangSmith observability to achieve <800ms API response times.",
      ],
    },
    {
      name: "Cortex",
      subtitle: "Production Multi-Agent RAG System with Safeguards",
      demoUrl: "https://cortex-lime-zeta.vercel.app",
      tech: [
        "LangGraph",
        "Self-RAG",
        "Corrective RAG (CRAG)",
        "Hallucination Guardrails",
        "Groq LPUs",
        "Supabase pgvector",
        "Tavily API",
      ],
      bullets: [
        "Engineered a Multi-Agent RAG architecture in LangGraph StateGraph, dynamically classifying user queries across vector database retrieval (pgvector), Tavily web search, and direct LLM generation.",
        "Incorporated Hallucination Guardrails combining academic Self-RAG & CRAG evaluator nodes (IsRel, IsSup, IsUse), achieving 95%+ answer groundedness and eliminating hallucinations.",
        "Architected a dual-model LPU inference strategy using Groq LPUs (llama-3.1-8b for ~100ms evaluation and llama-3.3-70b for reasoning), cutting system latency by 60% and token costs by 75%.",
      ],
    },
    {
      name: "Kraya AI Agent",
      subtitle: "Autonomous Deep Research & Workflow Multi-Agent Platform",
      demoUrl: "https://kraya-agent.vercel.app",
      tech: [
        "LangGraph StateGraph",
        "Agent Orchestration",
        "Task Decomposition",
        "FastAPI",
        "Postgres Checkpointer",
        "Server-Sent Events (SSE)",
        "Docker",
      ],
      bullets: [
        "Built an autonomous research platform using LangGraph StateGraph & FastAPI, featuring an orchestration router dynamically branching execution across chat, deep research, and document export.",
        "Formulated a 5-step Task Decomposition engine (Planning, Retrieval, Ranking, Synthesis, Reporting) with source deduplication and SSE streaming for real-time report delivery.",
        "Deployed context window optimization with LangGraph Postgres Checkpointer for durable session persistence alongside Google Workspace APIs for document export.",
      ],
    },
  ],
  education: {
    degree: "Bachelor's in Computer Application",
    institution: "DR. C.V. Raman University",
    duration: "2022 - 2025",
    location: "Balurghat, West Bengal",
    cgpa: "CGPA: 8.5",
  },
};

export type ResumeDataType = typeof resumeData;
