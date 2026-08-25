export const resumeData = {
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
    "AI Engineer specializing in production multi-agent architectures, autonomous tool calling, and evaluation-driven RAG systems using Python, LangGraph, and FastAPI. Experienced in architecting deterministic state machines, integrating guardrails (Self-RAG, Pydantic), and benchmark-driven optimization (Ragas, LangSmith) to achieve <800ms P95 latency, 70%+ cost reduction, and 95%+ answer faithfulness.",
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
        "Llama 3.3",
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
      name: "DocMatch AI",
      subtitle: "Production Multi-Agent Healthcare Triage & Booking System",
      demoUrl: "https://docmatch-ai.vercel.app",
      tech: [
        "LangGraph",
        "FastAPI",
        "Groq LPUs",
        "Pydantic",
        "Google Calendar API",
        "LangSmith",
        "Docker",
      ],
      bullets: [
        "Architected a deterministic multi-agent state machine in LangGraph and FastAPI with medical safety guardrails, achieving 99.4% intent classification accuracy and preventing out-of-scope generation.",
        "Engineered autonomous tool-calling agents with conflict-resolution algorithms across Google Calendar and Gmail REST APIs, automating end-to-end appointment bookings with zero manual intervention.",
        "Integrated Groq LPU inference (Llama-3.3-70B) and full-trace observability with LangSmith, maintaining <800ms API response times across 500+ simulated triage sessions.",
      ],
    },
    {
      name: "Cortex",
      subtitle: "Multi-Agent RAG Platform with Self-Correction & Evaluation Guardrails",
      demoUrl: "https://cortex-lime-zeta.vercel.app",
      tech: [
        "LangGraph",
        "Ragas",
        "DeepEval",
        "Self-RAG",
        "CRAG",
        "pgvector",
        "Groq LPUs",
        "Tavily API",
      ],
      bullets: [
        "Developed an adaptive Self-RAG retrieval engine dynamically classifying queries between pgvector vector search, Tavily web search, and direct LLM generation based on retrieval confidence scores.",
        "Implemented automated evaluation guardrails (IsRel, IsSup) evaluated via Ragas on a 150-query golden benchmark dataset, lifting answer groundedness from 71% to 95.4% and eliminating hallucinations.",
        "Deployed a tiered dual-model routing architecture (Llama-3.1-8B validator + Llama-3.3-70B synthesizer) with prompt caching, slashing P95 latency by 62% (<850ms) and inference token costs by 74%.",
      ],
    },
    {
      name: "Kraya AI Agent",
      subtitle: "Autonomous Deep Research Engine with Task Decomposition & State Persistence",
      demoUrl: "https://kraya-agent.vercel.app",
      tech: [
        "LangGraph StateGraph",
        "FastAPI",
        "Postgres Checkpointer",
        "SSE Streaming",
        "Task Decomposition",
        "Docker",
      ],
      bullets: [
        "Engineered a 5-stage recursive task decomposition engine (Planning, Retrieval, Deduplication, Ranking, Synthesis) capable of crawling 20+ web sources concurrently and synthesizing structured research reports.",
        "Implemented durable session checkpointing with LangGraph Postgres Checkpointer, providing fault-tolerant state persistence and resumable multi-turn agent execution without context loss.",
        "Built an asynchronous Server-Sent Events (SSE) streaming pipeline in FastAPI, streaming real-time agent thought traces, tool execution states, and source citations with <500ms Time-to-First-Token (TTFT).",
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

export type ResumeDataType = typeof resumeData;
