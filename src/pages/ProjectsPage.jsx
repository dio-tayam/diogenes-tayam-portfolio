import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Github, Code, Moon, Sun, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { profile } from "../data/profile";

export default function ProjectsPage({ dark, setDark, setCurrentPage, selectedProjectId }) {
  const muted = dark ? "text-zinc-400" : "text-zinc-600";
  const text = dark ? "text-zinc-100" : "text-zinc-900";
  const cardBg = dark ? "bg-[#0f0f0f] border-zinc-800" : "bg-white border-zinc-200";
  const hoverBg = dark ? "hover:bg-[#141414]" : "hover:bg-zinc-50";
  const bgColor = dark ? "#000000" : "#ffffff";
  const [gallery, setGallery] = useState({ open: false, projectTitle: "", images: [], index: 0 });

  const categories = {
    featured: profile.projects.filter(p => p.featured),
    other: profile.projects.filter(p => !p.featured)
  };

  const sampleScreenshots = [
    "/projects/sample-1.svg",
    "/projects/sample-2.svg",
    "/projects/sample-3.svg",
  ];

  const currentImage = useMemo(() => {
    if (!gallery.images.length) return "";
    return gallery.images[gallery.index];
  }, [gallery.images, gallery.index]);

  const openGallery = (project) => {
    const images = project.screenshots && project.screenshots.length
      ? project.screenshots
      : project.image
        ? [project.image]
        : sampleScreenshots;

    setGallery({
      open: true,
      projectTitle: project.title,
      images,
      index: 0,
    });
  };

  const closeGallery = () => {
    setGallery({ open: false, projectTitle: "", images: [], index: 0 });
  };

  const prevImage = () => {
    setGallery((prev) => ({
      ...prev,
      index: prev.index === 0 ? prev.images.length - 1 : prev.index - 1,
    }));
  };

  const nextImage = () => {
    setGallery((prev) => ({
      ...prev,
      index: prev.index === prev.images.length - 1 ? 0 : prev.index + 1,
    }));
  };

  useEffect(() => {
    if (!selectedProjectId) return;
    const node = document.getElementById(`project-card-${selectedProjectId}`);
    if (!node) return;

    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedProjectId]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: bgColor, color: text }} className="transition-colors duration-300 px-4 sm:px-8 py-5">
      <div className={`mx-auto w-full max-w-[980px] min-h-screen ${dark ? "bg-black" : "bg-white"}`}>
        {/* Header */}
        <div className="border-b" style={{ borderColor: dark ? "#27272a" : "#e5e7eb" }}>
          <div className="mx-auto w-full max-w-[980px] px-4 sm:px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentPage("home")}
                className={`p-2 rounded-sm border transition-all ${dark ? "border-zinc-700 hover:bg-zinc-900" : "border-zinc-300 hover:bg-zinc-100"}`}
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Projects</h1>
                <p className={`text-xs mt-1 ${muted}`}>Project highlights and details</p>
              </div>
            </div>
            <button
              onClick={() => setDark(!dark)}
              className={`w-10 h-10 rounded-sm border flex items-center justify-center transition-all ${dark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-900" : "border-zinc-300 text-zinc-600 hover:bg-zinc-100"}`}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Content */}
        <main className="mx-auto w-full max-w-[980px] px-4 sm:px-6 py-7">
          {/* Featured Projects */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Featured Projects</h2>
            <div className="grid grid-cols-1 gap-4">
              {categories.featured.map((project) => (
                <div
                  key={project.id} 
                  id={`project-card-${project.id}`}
                  className={`rounded-sm border p-4 transition-all ${cardBg} ${hoverBg}`}
                  style={{ scrollMarginTop: "80px" }}
                >
                  <div className={project.image ? "grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5" : "grid grid-cols-1 gap-4"}>
                    {project.image && (
                      <div className={`${dark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                        <img src={project.image} alt={project.title} className="w-full h-[180px] lg:h-[210px] object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="mb-2">
                        <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                        {project.impact && (
                          <p className={`text-xs ${muted}`}>{project.impact}</p>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed mb-3 ${muted}`}>{project.description}</p>
                      
                      {project.features && (
                        <div className="mb-3">
                          <h4 className={`font-semibold text-xs mb-2 ${muted}`}>Key Features</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {project.features.slice(0, 4).map((feature) => (
                              <span key={feature} className={`text-xs px-2 py-0.5 border rounded-sm ${dark ? "border-zinc-700 text-zinc-300" : "border-zinc-300 text-zinc-700"}`}>
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <h4 className={`font-semibold text-xs mb-2 ${muted}`}>Technologies</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.map((tech) => (
                            <span key={tech} className={`text-xs px-2 py-0.5 border rounded-sm ${dark ? "border-zinc-700 text-zinc-300" : "border-zinc-300 text-zinc-700"}`}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-3 border-t" style={{ borderColor: dark ? "#27272a" : "#e5e7eb" }}>
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className={`flex items-center gap-1.5 text-xs ${dark ? "text-zinc-300 hover:text-zinc-100" : "text-zinc-700 hover:text-zinc-900"} transition-colors`}
                          >
                            <Github size={16} /> View Code
                          </a>
                        )}
                        <button
                          onClick={() => openGallery(project)}
                          className={`flex items-center gap-1.5 text-xs transition-colors ${dark ? "text-zinc-300 hover:text-zinc-100" : "text-zinc-700 hover:text-zinc-900"}`}
                        >
                          <ImageIcon size={16} /> Screenshot
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {categories.other.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Other Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.other.map((project) => (
                  <div 
                    key={project.id} 
                    id={`project-card-${project.id}`}
                    className={`rounded-sm border p-4 transition-all ${cardBg} ${hoverBg}`}
                    style={{ scrollMarginTop: "80px" }}
                  >
                    {project.image && (
                      <div className={`overflow-hidden mb-3 ${dark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                        <img src={project.image} alt={project.title} className="w-full h-32 object-cover" />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm mb-2">{project.title}</h3>
                    <p className={`text-sm leading-relaxed mb-4 ${muted}`}>{project.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className={`text-xs px-2 py-0.5 border rounded-sm ${dark ? "border-zinc-700 text-zinc-300" : "border-zinc-300 text-zinc-700"}`}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-3 border-t" style={{ borderColor: dark ? "#27272a" : "#e5e7eb" }}>
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className={`flex items-center gap-1.5 text-xs ${dark ? "text-zinc-300 hover:text-zinc-100" : "text-zinc-700 hover:text-zinc-900"} transition-colors`}
                        >
                          <Code size={14} /> Code
                        </a>
                      )}
                      <button
                        onClick={() => openGallery(project)}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${dark ? "text-zinc-300 hover:text-zinc-100" : "text-zinc-700 hover:text-zinc-900"}`}
                      >
                        <ImageIcon size={14} /> Screenshot
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {gallery.open && (
          <div className="fixed inset-0 z-50 bg-black/90 px-4 py-6 sm:px-8" role="dialog" aria-modal="true">
            <div className="mx-auto w-full max-w-5xl h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-zinc-100">{gallery.projectTitle} Screenshots</h3>
                <button
                  onClick={closeGallery}
                  className="w-9 h-9 border border-zinc-700 text-zinc-100 rounded-sm flex items-center justify-center hover:bg-zinc-900"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="relative flex-1 border border-zinc-800 bg-black flex items-center justify-center overflow-hidden">
                {currentImage ? (
                  <img src={currentImage} alt="Project screenshot" className="max-w-full max-h-full object-contain" />
                ) : (
                  <p className="text-zinc-400 text-sm">No screenshots available</p>
                )}

                {gallery.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 border border-zinc-700 text-zinc-100 rounded-sm flex items-center justify-center hover:bg-zinc-900"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 border border-zinc-700 text-zinc-100 rounded-sm flex items-center justify-center hover:bg-zinc-900"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {gallery.images.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {gallery.images.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      onClick={() => setGallery((prev) => ({ ...prev, index: idx }))}
                      className={`w-14 h-10 border ${idx === gallery.index ? "border-zinc-100" : "border-zinc-700"} overflow-hidden`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className={`border-t text-center py-6 text-xs transition-colors ${dark ? "border-zinc-800 text-zinc-400" : "border-zinc-200 text-zinc-500"}`}>
          <p>© {new Date().getFullYear()} Diogenes A. Tayam III. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
