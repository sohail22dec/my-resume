import React, { useState } from "react";
import type { ResumeDataType } from "./resumeData";

interface ResumeEditorPanelProps {
  resume: ResumeDataType;
  onChange: (updatedResume: ResumeDataType) => void;
  onReset: () => void;
}

export const ResumeEditorPanel: React.FC<ResumeEditorPanelProps> = ({
  resume,
  onChange,
  onReset,
}) => {
  const [activeAccordion, setActiveAccordion] = useState<string>("contact");

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? "" : section);
  };

  // Contact Field Handlers
  const handleContactChange = (field: string, value: string) => {
    onChange({
      ...resume,
      contact: {
        ...resume.contact,
        [field]: value,
      },
    });
  };

  // Header Field Handlers
  const handleHeaderChange = (field: "name" | "title" | "summary", value: string) => {
    onChange({
      ...resume,
      [field]: value,
    });
  };

  // Education Field Handlers
  const handleEducationChange = (field: string, value: string) => {
    onChange({
      ...resume,
      education: {
        ...resume.education,
        [field]: value,
      },
    });
  };

  // Skill Handlers
  const handleSkillCategoryNameChange = (catIdx: number, newCategory: string) => {
    const updatedSkills = resume.skills.map((s, idx) =>
      idx === catIdx ? { ...s, category: newCategory } : s
    );
    onChange({ ...resume, skills: updatedSkills });
  };

  const handleSkillItemsChange = (catIdx: number, itemsString: string) => {
    const items = itemsString.split(",").map((i) => i.trim());
    const updatedSkills = resume.skills.map((s, idx) =>
      idx === catIdx ? { ...s, items } : s
    );
    onChange({ ...resume, skills: updatedSkills });
  };

  const handleAddSkillCategory = () => {
    const updatedSkills = [
      ...resume.skills,
      { category: "New Category", items: ["Skill 1", "Skill 2"] },
    ];
    onChange({ ...resume, skills: updatedSkills });
  };

  const handleRemoveSkillCategory = (catIdx: number) => {
    const updatedSkills = resume.skills.filter((_, idx) => idx !== catIdx);
    onChange({ ...resume, skills: updatedSkills });
  };

  // Project Handlers
  const handleProjectFieldChange = (
    pIdx: number,
    field: "name" | "subtitle" | "demoUrl",
    value: string
  ) => {
    const updatedProjects = resume.projects.map((p, idx) =>
      idx === pIdx ? { ...p, [field]: value } : p
    );
    onChange({ ...resume, projects: updatedProjects });
  };

  const handleProjectTechChange = (pIdx: number, techString: string) => {
    const tech = techString.split(",").map((t) => t.trim());
    const updatedProjects = resume.projects.map((p, idx) =>
      idx === pIdx ? { ...p, tech } : p
    );
    onChange({ ...resume, projects: updatedProjects });
  };

  const handleBulletChange = (pIdx: number, bIdx: number, value: string) => {
    const updatedProjects = resume.projects.map((p, idx) => {
      if (idx !== pIdx) return p;
      const updatedBullets = p.bullets.map((b, bulletIdx) =>
        bulletIdx === bIdx ? value : b
      );
      return { ...p, bullets: updatedBullets };
    });
    onChange({ ...resume, projects: updatedProjects });
  };

  const handleAddBullet = (pIdx: number) => {
    const updatedProjects = resume.projects.map((p, idx) => {
      if (idx !== pIdx) return p;
      return { ...p, bullets: [...p.bullets, "New accomplishment or key result..."] };
    });
    onChange({ ...resume, projects: updatedProjects });
  };

  const handleRemoveBullet = (pIdx: number, bIdx: number) => {
    const updatedProjects = resume.projects.map((p, idx) => {
      if (idx !== pIdx) return p;
      return { ...p, bullets: p.bullets.filter((_, bulletIdx) => bulletIdx !== bIdx) };
    });
    onChange({ ...resume, projects: updatedProjects });
  };

  const handleAddProject = () => {
    const newProj = {
      name: "New AI Project",
      subtitle: "Full Stack AI Application",
      demoUrl: "https://example.com",
      tech: ["Python", "FastAPI", "React"],
      bullets: ["Architected scalable microservices delivering <500ms latency."],
    };
    onChange({ ...resume, projects: [...resume.projects, newProj] });
  };

  const handleRemoveProject = (pIdx: number) => {
    const updatedProjects = resume.projects.filter((_, idx) => idx !== pIdx);
    onChange({ ...resume, projects: updatedProjects });
  };

  // JSON Import & Export
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${resume.name.toLowerCase().replace(/\s+/g, "_")}_resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          if (event.target?.result) {
            const parsed = JSON.parse(event.target.result as string);
            if (parsed && parsed.name && parsed.contact && parsed.skills && parsed.projects) {
              onChange(parsed as ResumeDataType);
            } else {
              alert("Invalid resume JSON format.");
            }
          }
        } catch {
          alert("Error parsing JSON file.");
        }
      };
    }
  };

  return (
    <div className="p-4 space-y-3 text-xs overflow-y-auto flex-1">
      
      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
        <button
          onClick={handleExportJSON}
          className="flex-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer text-[11px]"
          title="Export resume as JSON file"
        >
          <span>📤 Export JSON</span>
        </button>
        <label className="flex-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer text-[11px]">
          <span>📥 Import JSON</span>
          <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
        </label>
        <button
          onClick={onReset}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer text-[11px]"
          title="Reset to default resume data"
        >
          🔄 Reset
        </button>
      </div>

      {/* 1. Header & Contact Details */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <button
          onClick={() => toggleAccordion("contact")}
          className="w-full p-3 bg-slate-50 hover:bg-slate-100 font-extrabold text-slate-800 flex items-center justify-between transition-colors text-left cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>👤</span>
            <span>Personal & Contact Info</span>
          </span>
          <span className="text-slate-400 text-sm">{activeAccordion === "contact" ? "▲" : "▼"}</span>
        </button>
        {activeAccordion === "contact" && (
          <div className="p-3.5 space-y-3 border-t border-slate-200">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name:</label>
              <input
                type="text"
                value={resume.name}
                onChange={(e) => handleHeaderChange("name", e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Job Title / Headline:</label>
              <input
                type="text"
                value={resume.title}
                onChange={(e) => handleHeaderChange("title", e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email:</label>
                <input
                  type="email"
                  value={resume.contact.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone:</label>
                <input
                  type="text"
                  value={resume.contact.phone}
                  onChange={(e) => handleContactChange("phone", e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Location:</label>
              <input
                type="text"
                value={resume.contact.location}
                onChange={(e) => handleContactChange("location", e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">LinkedIn URL:</label>
                <input
                  type="text"
                  value={resume.contact.linkedin}
                  onChange={(e) => handleContactChange("linkedin", e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">GitHub URL:</label>
                <input
                  type="text"
                  value={resume.contact.github}
                  onChange={(e) => handleContactChange("github", e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Professional Summary */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <button
          onClick={() => toggleAccordion("summary")}
          className="w-full p-3 bg-slate-50 hover:bg-slate-100 font-extrabold text-slate-800 flex items-center justify-between transition-colors text-left cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>📝</span>
            <span>Professional Summary</span>
          </span>
          <span className="text-slate-400 text-sm">{activeAccordion === "summary" ? "▲" : "▼"}</span>
        </button>
        {activeAccordion === "summary" && (
          <div className="p-3.5 space-y-2 border-t border-slate-200">
            <textarea
              rows={6}
              value={resume.summary}
              onChange={(e) => handleHeaderChange("summary", e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 leading-relaxed text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none resize-y"
            />
          </div>
        )}
      </div>

      {/* 3. Technical Skills */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <button
          onClick={() => toggleAccordion("skills")}
          className="w-full p-3 bg-slate-50 hover:bg-slate-100 font-extrabold text-slate-800 flex items-center justify-between transition-colors text-left cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>🛠️</span>
            <span>Technical Skills ({resume.skills.length} Categories)</span>
          </span>
          <span className="text-slate-400 text-sm">{activeAccordion === "skills" ? "▲" : "▼"}</span>
        </button>
        {activeAccordion === "skills" && (
          <div className="p-3.5 space-y-3.5 border-t border-slate-200">
            {resume.skills.map((skillGroup, catIdx) => (
              <div key={catIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={skillGroup.category}
                    onChange={(e) => handleSkillCategoryNameChange(catIdx, e.target.value)}
                    className="p-1.5 bg-white border border-slate-300 rounded font-bold text-slate-900 text-xs flex-1 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    placeholder="Category Name"
                  />
                  <button
                    onClick={() => handleRemoveSkillCategory(catIdx)}
                    className="text-red-500 hover:text-red-700 font-bold text-xs p-1 rounded hover:bg-red-50 cursor-pointer"
                    title="Remove Skill Category"
                  >
                    🗑️
                  </button>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">
                    Skills (comma separated):
                  </label>
                  <input
                    type="text"
                    value={skillGroup.items.join(", ")}
                    onChange={(e) => handleSkillItemsChange(catIdx, e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    placeholder="Python, FastAPI, Docker..."
                  />
                </div>
              </div>
            ))}
            <button
              onClick={handleAddSkillCategory}
              className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center gap-1"
            >
              <span>＋ Add Skill Category</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Technical Experience & Projects */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <button
          onClick={() => toggleAccordion("projects")}
          className="w-full p-3 bg-slate-50 hover:bg-slate-100 font-extrabold text-slate-800 flex items-center justify-between transition-colors text-left cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>🚀</span>
            <span>Projects & Experience ({resume.projects.length})</span>
          </span>
          <span className="text-slate-400 text-sm">{activeAccordion === "projects" ? "▲" : "▼"}</span>
        </button>
        {activeAccordion === "projects" && (
          <div className="p-3.5 space-y-4 border-t border-slate-200">
            {resume.projects.map((project, pIdx) => (
              <div key={pIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-slate-800 text-xs">Project #{pIdx + 1}</span>
                  <button
                    onClick={() => handleRemoveProject(pIdx)}
                    className="text-red-600 hover:text-red-800 font-bold text-xs p-1 rounded hover:bg-red-100 cursor-pointer flex items-center gap-1"
                    title="Remove Project"
                  >
                    <span>🗑️ Delete</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Project Name:</label>
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => handleProjectFieldChange(pIdx, "name", e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded font-bold text-slate-900 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Demo URL:</label>
                    <input
                      type="text"
                      value={project.demoUrl || ""}
                      onChange={(e) => handleProjectFieldChange(pIdx, "demoUrl", e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subtitle / Headline:</label>
                  <input
                    type="text"
                    value={project.subtitle}
                    onChange={(e) => handleProjectFieldChange(pIdx, "subtitle", e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Technologies (comma separated):</label>
                  <input
                    type="text"
                    value={project.tech.join(", ")}
                    onChange={(e) => handleProjectTechChange(pIdx, e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                {/* Bullet Points */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Bullet Points:</label>
                    <button
                      onClick={() => handleAddBullet(pIdx)}
                      className="text-purple-700 hover:text-purple-900 font-bold text-[11px] hover:underline cursor-pointer"
                    >
                      ＋ Add Bullet
                    </button>
                  </div>
                  {project.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-1.5">
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleBulletChange(pIdx, bIdx, e.target.value)}
                        className="flex-1 p-1.5 bg-white border border-slate-300 rounded text-slate-800 text-[11px] leading-snug focus:ring-1 focus:ring-purple-500 focus:outline-none resize-y"
                      />
                      <button
                        onClick={() => handleRemoveBullet(pIdx, bIdx)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs p-1 hover:bg-red-50 rounded cursor-pointer mt-1"
                        title="Delete Bullet"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleAddProject}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center gap-1 shadow-sm"
            >
              <span>🚀 Add New Project</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Education */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <button
          onClick={() => toggleAccordion("education")}
          className="w-full p-3 bg-slate-50 hover:bg-slate-100 font-extrabold text-slate-800 flex items-center justify-between transition-colors text-left cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>🎓</span>
            <span>Education</span>
          </span>
          <span className="text-slate-400 text-sm">{activeAccordion === "education" ? "▲" : "▼"}</span>
        </button>
        {activeAccordion === "education" && (
          <div className="p-3.5 space-y-3 border-t border-slate-200">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Degree Name:</label>
              <input
                type="text"
                value={resume.education.degree}
                onChange={(e) => handleEducationChange("degree", e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Institution / University:</label>
              <input
                type="text"
                value={resume.education.institution}
                onChange={(e) => handleEducationChange("institution", e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Duration:</label>
                <input
                  type="text"
                  value={resume.education.duration}
                  onChange={(e) => handleEducationChange("duration", e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Location:</label>
                <input
                  type="text"
                  value={resume.education.location}
                  onChange={(e) => handleEducationChange("location", e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">CGPA / Grade:</label>
                <input
                  type="text"
                  value={resume.education.cgpa}
                  onChange={(e) => handleEducationChange("cgpa", e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
