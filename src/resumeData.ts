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
      demoUrl: "http://3.25.64.38:3000`",
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
      demoUrl: "http://3.25.64.38:3001",
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
        "Architected an adaptive Corrective RAG (CRAG) state machine dynamically routing queries across pgvector vector search, Tavily web search, and direct LLM generation with 85.7% routing accuracy.",
        "Built automated guardrails and evaluation suite achieving 100% safety & prompt injection blocking (0.00s overhead), automated PII redaction, and 85.7% answer faithfulness (groundedness) and relevance.",
        "Integrated dual-model routing (Qwen-3.6-27B routing validator + GPT-OSS-120B synthesizer) on Groq LPUs with prompt caching, slashing inference token costs by 74% and eliminating hallucinations.",
      ],
    },
    {
      name: "Docmatch AI",
      subtitle: "Multi-Agent Document Intelligence, Semantic Matching & Compliance Engine",
      demoUrl: "https://docmatch-ai.vercel.app",
      tech: [
        "LangGraph StateGraph",
        "FastAPI",
        "pgvector",
        "Hybrid Search (BM25 + Dense)",
        "DeepEval",
        "Groq LPUs",
        "Pydantic Guardrails",
        "Docker",
      ],
      bullets: [
        "Architected an enterprise document intelligence pipeline utilizing multi-agent orchestration to parse, chunk, and cross-match complex contracts and unstructured PDFs against regulatory schemas in <1.8s.",
        "Engineered a production-ready hybrid retrieval system (BM25 lexical + dense vector embeddings) with cross-encoder re-ranking, boosting retrieval precision by 42% and eliminating false-positive clause matches.",
        "Built automated evaluation and guardrail suites across 150+ synthetic compliance test cases, achieving 99.2% extraction accuracy with zero PII leakage and sub-cent per-document inference cost via Groq LPUs.",
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
