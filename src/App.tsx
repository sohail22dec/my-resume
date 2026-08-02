import { useRef, useState } from "react";
import { resumeData } from "./resumeData";
import { LinkedInIcon, GitHubIcon, MailIcon, PhoneIcon, MapPinIcon, PrinterIcon, ExternalLinkIcon } from "./icons";

const getCleanDomain = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/https?:\/\/(www\.)?/, "");
  }
};

export default function App() {
  const resumeRef = useRef<HTMLDivElement>(null);

  // Dynamic Spacing State (px / ratio)
  const [fontSize, setFontSize] = useState<number>(11.5);
  const [lineHeight, setLineHeight] = useState<number>(1.4);
  const [sectionGap, setSectionGap] = useState<number>(16); // Gap between main sections in px
  const [projectGap, setProjectGap] = useState<number>(12); // Gap between projects in px
  const [paddingY, setPaddingY] = useState<number>(32); // Vertical padding in px
  const [paddingX, setPaddingX] = useState<number>(40); // Horizontal padding in px

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-[80px] bg-slate-100 text-slate-900 font-sans print:bg-white print:pb-0">

      {/* Top Header Bar with Live Spacing Controls & Download PDF */}
      <div className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 print:hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">

          {/* Brand Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-extrabold text-slate-900 tracking-tight">✨ Agentic AI Resume</span>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold border border-slate-200 uppercase tracking-wider">
              Live Spacing Controls
            </span>
          </div>

          {/* Premium Fine Spacing Controls Card */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-inner text-xs w-full lg:w-auto">

            {/* Font Size Slider */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 shrink-0">🔤 Font Size:</span>
              <input
                type="range"
                min="9.5"
                max="14.5"
                step="0.5"
                value={fontSize}
                onChange={(e) => setFontSize(parseFloat(e.target.value))}
                className="w-24 accent-slate-900 cursor-pointer"
              />
              <span className="font-bold text-slate-900 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[11px] min-w-[38px] text-center shadow-2xs">
                {fontSize}px
              </span>
            </div>

            {/* Line Height Slider */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 shrink-0">↕️ Line Height:</span>
              <input
                type="range"
                min="1.1"
                max="1.6"
                step="0.05"
                value={lineHeight}
                onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                className="w-24 accent-slate-900 cursor-pointer"
              />
              <span className="font-bold text-slate-900 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[11px] min-w-[34px] text-center shadow-2xs">
                {lineHeight}
              </span>
            </div>

            {/* Section Gap Slider */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 shrink-0">📏 Section Gap:</span>
              <input
                type="range"
                min="4"
                max="28"
                step="1"
                value={sectionGap}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setSectionGap(val);
                  setProjectGap(Math.round(val * 0.75));
                }}
                className="w-24 accent-slate-900 cursor-pointer"
              />
              <span className="font-bold text-slate-900 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[11px] min-w-[38px] text-center shadow-2xs">
                {sectionGap}px
              </span>
            </div>

            {/* Page Padding Slider */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 shrink-0">🖼️ Padding:</span>
              <input
                type="range"
                min="12"
                max="48"
                step="2"
                value={paddingY}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setPaddingY(val);
                  setPaddingX(Math.round(val * 1.25));
                }}
                className="w-24 accent-slate-900 cursor-pointer"
              />
              <span className="font-bold text-slate-900 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[11px] min-w-[54px] text-center shadow-2xs">
                {paddingY}px / {paddingX}px
              </span>
            </div>

          </div>

          {/* Download / Print PDF Button */}
          <button
            className="flex items-center justify-center gap-2 bg-slate-900 text-white border-none px-5 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all hover:bg-slate-800 tracking-wide shadow-sm shrink-0 w-full lg:w-auto"
            onClick={handlePrint}
          >
            <PrinterIcon size={16} />
            Download / Print PDF
          </button>

        </div>
      </div>

      {/* Resume Page Container */}
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
        className="w-full max-w-[794px] bg-white mt-8 shadow-xl rounded border border-slate-200 relative overflow-hidden transition-all duration-150 ease-out print:overflow-visible print:m-0 print:shadow-none print:border-none print:w-full print:rounded-none max-md:p-[24px_16px] max-md:mt-0 max-md:rounded-none"
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[5px] bg-slate-900 print:bg-slate-900 print:h-[5px]"></div>

        {/* Header - Single Column ATS Optimized */}
        <header className="flex flex-col items-center text-center mb-2 print:mb-1.5">
          <h1 className="text-[2.2em] font-black text-slate-900 leading-tight tracking-tight uppercase print:font-extrabold mb-0.5">
            {resumeData.name}
          </h1>
          <p className="text-[1.1em] font-bold tracking-widest text-slate-600 uppercase mb-1.5">
            {resumeData.title}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.95em] text-slate-700">
            {"location" in resumeData.contact && resumeData.contact.location && (
              <span className="flex items-center gap-1">
                <span className="text-slate-500"><MapPinIcon size={13} /></span>
                <span>{resumeData.contact.location}</span>
              </span>
            )}
            {"phone" in resumeData.contact && resumeData.contact.phone && (
              <>
                <span className="text-slate-300">•</span>
                <a href={`tel:${resumeData.contact.phone.replace(/\s+/g, "")}`} className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors decoration-transparent">
                  <span className="text-slate-500"><PhoneIcon size={13} /></span>
                  <span>{resumeData.contact.phone}</span>
                </a>
              </>
            )}
            <span className="text-slate-300">•</span>
            <a href={`mailto:${resumeData.contact.email}`} className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors decoration-transparent">
              <span className="text-slate-500"><MailIcon size={13} /></span>
              <span>{resumeData.contact.email}</span>
            </a>
            <span className="text-slate-300">•</span>
            <a href={resumeData.contact.linkedin} className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors decoration-transparent" target="_blank" rel="noreferrer">
              <span className="text-slate-500"><LinkedInIcon /></span>
              <span>linkedin.com/in/sohail-islam</span>
            </a>
            <span className="text-slate-300">•</span>
            <a href={resumeData.contact.github} className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors decoration-transparent" target="_blank" rel="noreferrer">
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
          <p className="text-[1em] text-slate-700 text-justify">{resumeData.summary}</p>
        </section>

        {/* Technical Skills */}
        <section style={{ marginBottom: `${sectionGap}px` }} className="break-inside-avoid">
          <h2 className="text-[1.05em] font-bold tracking-[0.1em] uppercase text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-1 inline-block">
            Technical Skills
          </h2>
          <div className="flex flex-col gap-1">
            {resumeData.skills.map((skillGroup) => (
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
            {resumeData.projects.map((project, idx) => (
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
              <h3 className="text-[1.12em] font-bold text-slate-900 mb-0.5">{resumeData.education.degree}</h3>
              <p className="text-[1.02em] text-slate-700 font-medium">{resumeData.education.institution}</p>
              <p className="text-[0.95em] text-slate-600 mt-0.5">{resumeData.education.cgpa}</p>
            </div>
            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <span className="text-[1.02em] font-semibold text-slate-800">{resumeData.education.duration}</span>
              <span className="text-[0.95em] text-slate-500">{resumeData.education.location}</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
