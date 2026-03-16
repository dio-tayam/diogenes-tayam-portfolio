import { ChevronRight, Github, ExternalLink, FolderCode } from "lucide-react";
import { profile } from "../data/profile";

export default function Projects({ dark, setCurrentPage, setSelectedProjectId }) {
  const muted = dark ? "text-zinc-400" : "text-zinc-600";
  const text = dark ? "text-zinc-100" : "text-zinc-900";
  const cardBg = dark ? "bg-[#0f0f0f] border-zinc-800" : "bg-white border-zinc-200";
  const hoverBg = dark ? "hover:bg-[#141414]" : "hover:bg-zinc-50";
  const featuredProjects = profile.projects.filter(p => p.featured).slice(0, 3);

  return (
    <section data-reveal className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${text}`}>Recent Projects</h2>
          <p className={`text-xs mt-1 ${muted}`}>Selected work and impact</p>
        </div>
        <button
          onClick={() => setCurrentPage("projects")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-sm transition-colors ${dark ? "border-zinc-700 text-zinc-200 hover:bg-zinc-900" : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"}`}
        >
          View All <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {featuredProjects.map((project) => (
          <div key={project.id} className={`rounded-sm border p-4 transition-all ${cardBg} ${hoverBg}`}>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <div className={`w-full sm:w-36 h-36 overflow-hidden flex-shrink-0 flex items-center justify-center ${dark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <FolderCode size={40} className={dark ? "text-zinc-600" : "text-zinc-400"} />
                )}
              </div>
              <div className="flex-1">
                <div className="mb-1.5">
                  <h3 className={`text-base font-semibold ${text}`}>{project.title}</h3>
                  {project.impact && <p className={`text-xs ${muted}`}>{project.impact}</p>}
                </div>
                <p className={`text-sm leading-relaxed mb-3 ${muted}`}>{project.description}</p>
                {project.features && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {project.features.slice(0, 3).map((feature) => (
                      <span key={feature} className={`text-xs px-2 py-0.5 border rounded-sm ${dark ? "border-zinc-700 text-zinc-400" : "border-zinc-300 text-zinc-600"}`}>
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.technologies.map((tech) => (
                    <span key={tech} className={`text-xs px-2 py-0.5 border rounded-sm ${dark ? "border-zinc-700 text-zinc-300" : "border-zinc-300 text-zinc-700"}`}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 text-xs transition-colors ${dark ? "text-zinc-300 hover:text-zinc-100" : "text-zinc-700 hover:text-zinc-900"}`}>
                      <Github size={16} /> Code
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setCurrentPage("projects");
                    }}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${dark ? "text-zinc-300 hover:text-zinc-100" : "text-zinc-700 hover:text-zinc-900"}`}
                  >
                    <ExternalLink size={16} /> Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
