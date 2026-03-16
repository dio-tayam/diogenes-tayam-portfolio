import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import About from "./components/About";
import AccessCard from "./components/AccessCard";
import TechStack from "./components/TechStack";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Seminars from "./components/Seminars";
import Contact from "./components/Contact";
import SkillsPage from "./pages/SkillsPage";
import ProjectsPage from "./pages/ProjectsPage";

export default function App() {
  const [dark, setDark] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const bgColor = dark ? "#000000" : "#ffffff";
  const textColor = dark ? "#ededed" : "#111827";

  useEffect(() => {
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }, [bgColor, dark]);

  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "-8% 0px -8% 0px",
      }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [currentPage]);

  if (currentPage === "skills") {
    return <SkillsPage dark={dark} setDark={setDark} setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === "projects") {
    return (
      <ProjectsPage
        dark={dark}
        setDark={setDark}
        setCurrentPage={setCurrentPage}
        selectedProjectId={selectedProjectId}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: bgColor, color: textColor }} className="transition-colors duration-300">
      <div className="min-h-screen transition-colors duration-300 px-4 sm:px-8 py-5">
        <div className={`mx-auto w-full max-w-[980px] ${dark ? "bg-black" : "bg-white"}`}>
          <Hero dark={dark} setDark={setDark} />

          <main className="mx-auto w-full max-w-[980px] px-4 sm:px-6 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-6 items-start">
            <div className="space-y-10">
              <About dark={dark} />
              <Projects
                dark={dark}
                setCurrentPage={setCurrentPage}
                setSelectedProjectId={setSelectedProjectId}
              />
              <TechStack dark={dark} setCurrentPage={setCurrentPage} />
              <Seminars dark={dark} />
            </div>
            <div className="space-y-4 lg:sticky lg:top-8">
              <AccessCard dark={dark} />
              <Experience dark={dark} />
              <Contact dark={dark} />
            </div>
            </div>
          </main>

          <footer className={`border-t text-center py-6 text-xs transition-colors ${dark ? "border-zinc-800 text-zinc-400" : "border-zinc-200 text-zinc-500"}`}>
            <p>© {new Date().getFullYear()} Diogenes A. Tayam III. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}