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
      items: ["LangChain", "LangGraph", "LangSmith", "n8n"],
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
      items: ["MongoDB", "PostgreSQL"],
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
      tech: ["LangChain, LangGraph", "FastAPI", "Google Maps API", "Tavily", "Python"],
      bullets: [
        "Architected a multi-agent diagnostic and scheduling system where users can describe medical symptoms in natural language for intelligent analysis.",
        "Engineered an agentic workflow that analyzes symptoms and autonomously determines the appropriate medical specialist using LLM-powered reasoning.",
        "Integrated the Google Maps API to enable location-based doctor discovery and implemented a simulated appointment booking system.",
        "Built an automated notification pipeline to trigger confirmation emails to users upon successful booking.",
      ],
    },
    {
      name: "Kraya AI Agent",
      subtitle: "Autonomous Research Assistant",
      demoUrl: "https://kraya-agent.vercel.app",
      tech: ["LangChain", "LangGraph", "React", "TanStack Query", "SSE", "Google Docs API"],
      bullets: [
        "Developed an autonomous research agent that gathers information, synthesizes data, and generates comprehensive, structured reports.",
        "Integrated with Google Workspace APIs to automatically export and format generated reports directly into Google Docs.",
        "Built the backend and a responsive chat interface featuring state management with TanStack Query and Server-Sent Events (SSE) for real-time AI message streaming.",
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
