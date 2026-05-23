import { useRef } from "react";
import { resumeData } from "./resumeData";
import { LinkedInIcon, GitHubIcon, MailIcon, PrinterIcon, ExternalLinkIcon } from "./icons";

const getCleanDomain = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/https?:\/\/(www\.)?/, "");
  }
};

export default function App() {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-[60px] bg-slate-50 text-slate-900 font-sans print:bg-white print:pb-0">
      {/* Print Button - hidden in print */}
      <div className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 print:hidden">
        <div className="max-w-[900px] mx-auto px-8 py-3.5 flex items-center justify-between gap-4">
          <span className="text-sm text-slate-500 font-medium">✨ Your resume is ready!</span>
          <button
            className="flex items-center gap-2 bg-slate-900 text-white border-none px-[22px] py-2.5 rounded text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-800 tracking-wide"
            onClick={handlePrint}
          >
            <PrinterIcon size={16} />
            Download / Print PDF
          </button>
        </div>
      </div>

      {/* Resume Page */}
      <div
        ref={resumeRef}
        className="w-full max-w-[794px] min-h-[1123px] bg-white mt-10 p-[52px_56px] shadow-xl rounded border border-slate-200 relative overflow-hidden print:m-0 print:py-[12px] print:px-[48px] print:shadow-none print:border-none print:w-full print:min-h-0 print:rounded-none max-md:p-[36px_24px] max-md:mt-0 max-md:rounded-none"
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[6px] bg-slate-900 print:bg-slate-900 print:h-[6px]"></div>

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start gap-4 mb-1 print:flex-row print:gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-1 uppercase">{resumeData.name}</h1>
            <p className="text-[15px] font-semibold tracking-wide text-slate-600 uppercase">{resumeData.title}</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0 print:items-end mt-1">
            <a href={`mailto:${resumeData.contact.email}`} className="flex items-center gap-2 text-[13px] text-slate-700 hover:text-slate-900 transition-colors decoration-transparent">
              <span className="text-slate-500 flex items-center"><MailIcon size={14} /></span>
              <span>{resumeData.contact.email}</span>
            </a>
            <a href={resumeData.contact.linkedin} className="flex items-center gap-2 text-[13px] text-slate-700 hover:text-slate-900 transition-colors decoration-transparent" target="_blank" rel="noreferrer">
              <span className="text-slate-500 flex items-center"><LinkedInIcon /></span>
              <span>linkedin.com/in/sohail-islam</span>
            </a>
            <a href={resumeData.contact.github} className="flex items-center gap-2 text-[13px] text-slate-700 hover:text-slate-900 transition-colors decoration-transparent" target="_blank" rel="noreferrer">
              <span className="text-slate-500 flex items-center"><GitHubIcon /></span>
              <span>github.com/sohail22dec</span>
            </a>
          </div>
        </header>

        {/* Divider */}
        <div className="h-px bg-slate-300 my-3"></div>

        {/* Summary */}
        <section className="mb-4 break-inside-avoid">
          <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase text-slate-900 border-b-2 border-slate-900 pb-1 mb-2 inline-block">
            Professional Summary
          </h2>
          <p className="text-[13.5px] leading-relaxed text-slate-700 text-justify">{resumeData.summary}</p>
        </section>

        {/* Technical Skills */}
        <section className="mb-4 break-inside-avoid">
          <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase text-slate-900 border-b-2 border-slate-900 pb-1 mb-2 inline-block">
            Technical Skills
          </h2>
          <div className="flex flex-col gap-1.5">
            {resumeData.skills.map((skillGroup) => (
              <div key={skillGroup.category} className="flex items-start gap-3">
                <span className="text-[13px] font-bold text-slate-800 whitespace-nowrap min-w-[140px] shrink-0 pt-[2px]">{skillGroup.category}:</span>
                <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                  {skillGroup.items.map((item, i) => (
                    <span key={item} className="text-[13.5px] text-slate-700">
                      {item}{i < skillGroup.items.length - 1 ? <span className="text-slate-400 mx-1.5">•</span> : ""}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-4">
          <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase text-slate-900 border-b-2 border-slate-900 pb-1 mb-3 inline-block">
            Projects
          </h2>
          <div className="flex flex-col gap-3.5">
            {resumeData.projects.map((project, idx) => (
              <div key={idx} className="break-inside-avoid print:break-inside-avoid">
                <div className="flex items-start justify-between gap-3 mb-1.5 flex-wrap">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="text-[15px] font-bold text-slate-900">{project.name}</h3>
                    <span className="text-[14px] text-slate-600 font-medium">| {project.subtitle}</span>
                  </div>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1 transition-colors decoration-transparent"
                    >
                      <span>Live Demo</span>
                      <span className="hidden print:inline text-slate-400 font-normal ml-1">
                        ({getCleanDomain(project.demoUrl)})
                      </span>
                      <ExternalLinkIcon size={14} />
                    </a>
                  )}
                </div>
                <div className="mb-1.5">
                  <span className="text-[13px] font-semibold text-slate-700 mr-2">Technologies:</span>
                  <span className="text-[13px] text-slate-600 italic">{project.tech.join(", ")}</span>
                </div>
                <ul className="flex flex-col gap-1 list-none ml-1">
                  {project.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-slate-700">
                      <svg className="w-1.5 h-1.5 text-slate-500 mt-[7px] shrink-0" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="2.5" />
                      </svg>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-0 break-inside-avoid">
          <h2 className="text-[13px] font-bold tracking-[0.1em] uppercase text-slate-900 border-b-2 border-slate-900 pb-1 mb-3 inline-block">
            Education
          </h2>
          <div className="flex items-start justify-between gap-4 print:break-inside-avoid">
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-slate-900 mb-1">{resumeData.education.degree}</h3>
              <p className="text-[14px] text-slate-700 font-medium">{resumeData.education.institution}</p>
              <p className="text-[13px] text-slate-600 mt-0.5">{resumeData.education.cgpa}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[14px] font-semibold text-slate-800">{resumeData.education.duration}</span>
              <span className="text-[13px] text-slate-500">{resumeData.education.location}</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
