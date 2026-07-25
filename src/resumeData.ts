export const resumeData = {
  name: "sohal islam",
  title: "Agentic AI Engineer",
  contact: {
    email: "sohelsilamblg01@gmail.com",
    linkedin: "https://www.linkedin.com/in/sohail-islam-64775335b/",
    github: "https://github.com/sohail22dec?tab=repositories",
  },
  summary:
    "Passionate Agentic AI Engineer specializing in designing and building autonomous multi-agent systems, intelligent orchestration pipelines, and production-ready AI applications. Experienced in bridging cutting-edge AI research with real-world product engineering using modern LLM frameworks and full-stack technologies.",
  skills: [
    {
      category: "AI & Orchestration",
      items: ["LangChain", "LangGraph", "LangSmith", "n8n", "FastMCP", "Groq", "RAG"],
    },
    {
      category: "Languages",
      items: ["Python", "JavaScript", "TypeScript"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Express.js", "FastAPI"],
    },
    {
      category: "Frontend",
      items: ["React", "Next.js"],
    },
    {
      category: "Databases",
      items: ["MongoDB", "PostgreSQL", "Supabase"],
    },
    {
      category: "Tooling",
      items: ["Docker", "uv", "Ruff", "Git"],
    },
  ],
  projects: [
    {
      name: "DocMatch AI",
      subtitle: "Multi-Agent Healthcare Assistant",
      demoUrl: "https://docmatch-ai.vercel.app",
      tech: [
        "LangGraph",
        "FastAPI",
        "Model Context Protocol (FastMCP)",
        "Groq LLMs",
        "LangSmith",
        "Google Maps API",
        "Next.js",
        "Supabase",
      ],
      bullets: [
        "Architected a hub-and-spoke multi-agent system using LangGraph, featuring a central Orchestrator that dynamically routes natural language queries to specialized sub-agents (Symptom, Location, and Search).",
        "Implemented a custom Model Context Protocol (MCP) server to seamlessly integrate the Google Maps API for geospatial medical facility discovery alongside the Tavily API for real-time medical literature retrieval.",
        "Integrated LangSmith for comprehensive AI tracing and observability, paired with a responsive Next.js/React frontend backed by Supabase.",
      ],
    },
    {
      name: "Kraya AI Agent",
      subtitle: "Autonomous Research Assistant",
      demoUrl: "https://kraya-agent.vercel.app",
      tech: [
        "LangGraph",
        "FastAPI",
        "PostgreSQL",
        "Tavily API",
        "Next.js",
        "Google Workspace OAuth2",
        "Server-Sent Events (SSE)",
      ],
      bullets: [
        "Developed a stateful, multi-agent deep research pipeline featuring an intelligent router that dynamically switches between standard chat and an autonomous 5-step research graph (Planning, Searching, Extraction, Synthesis, and Reporting).",
        "Implemented advanced conversational memory management using the LangGraph Postgres Checkpointer to persist agent states, incorporating automatic message pruning and summarization to optimize context window efficiency.",
        "Created a custom tool integration using the Google Docs API and OAuth2 to autonomously format, create, and export generated markdown research reports directly to the user's Google Drive.",
      ],
    },
    {
      name: "Cortex",
      subtitle: "Multi-Agent RAG System",
      demoUrl: "https://cortex-lime-zeta.vercel.app",
      tech: [
        "LangGraph",
        "Groq LLMs",
        "Supabase",
        "Gemini Embeddings",
        "Self-RAG",
        "Tavily API",
      ],
      bullets: [
        "Engineered a production-grade Multi-Agent RAG architecture using LangGraph StateGraph, featuring an intelligent document-aware router that dynamically classifies queries across RAG, direct LLM, and live web search branches.",
        "Implemented academic Self-RAG and Corrective RAG (CRAG) patterns with dedicated LLM evaluator nodes for Document Relevance (IsRel), Groundedness (IsSup), and Utility (IsUse) to eliminate hallucinations.",
        "Designed a dual-model optimization strategy leveraging Groq LPUs—deploying llama-3.1-8b-instant for ~100ms evaluator nodes and llama-3.3-70b-versatile for complex reasoning, cutting system latency by 60%.",
        "Built a high-performance vector search engine integrating Supabase pgvector and Google Gemini embeddings with Matryoshka Representation Learning (MRL) for native 768-dimensional similarity matching.",
      ],
    },
  ],
  education: {
    degree: "Bachelor's in Computer Application",
    institution: "CV Raman University",
    duration: "2022 – 2025",
    location: "Balurghat, West Bengal",
    cgpa: "CGPA: 8.5",
  },
};

export type ResumeDataType = typeof resumeData;
