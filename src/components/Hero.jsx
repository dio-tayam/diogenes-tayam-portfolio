import { useState, useEffect } from "react";
import { MapPin, Mail, Github, Linkedin, Download, Moon, Sun } from "lucide-react";
import { profile } from "../data/profile";
import heroLight from "../assets/hero.jpg";
import heroDark from "../assets/hero-dark.png";

const titles = profile.title;

export default function Hero({ dark, setDark }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const muted = dark ? "text-zinc-400" : "text-zinc-600";
  const text = dark ? "text-zinc-100" : "text-zinc-900";

  useEffect(() => {
    const current = titles[index];
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % titles.length);
      }, 200);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index]);

  const handleDownloadCv = () => {
    const link = document.createElement("a");
    link.href = "/diogenes-tayam-portfolio/resume.pdf";
    link.download = "Diogenes-Tayam-Resume.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section data-reveal className="mx-auto w-full max-w-[980px] px-4 sm:px-6 pt-6 pb-7">
      <div className="flex items-start gap-5 flex-wrap">
        <img
          src={dark ? heroDark : heroLight}
          alt="Diogenes Tayam"
          className={`w-28 h-28 object-cover flex-shrink-0 transition-all duration-300 ${dark ? "brightness-90 contrast-125 saturate-75" : "brightness-100 contrast-100 saturate-100"}`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
            <h1 className={`text-4xl font-bold leading-tight ${text}`}>{profile.name}</h1>
            <button
              onClick={() => setDark(!dark)}
              className={`w-11 h-11 rounded-sm border flex items-center justify-center transition-all ${dark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-900" : "border-zinc-300 text-zinc-600 hover:bg-zinc-100"}`}
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <div className={`flex items-center gap-1.5 text-sm mb-2 ${muted}`}>
            <MapPin size={14} />
            <span>{profile.location}</span>
          </div>
          <div className="h-7 mb-4">
            <span className={`text-[1rem] font-normal ${dark ? "text-zinc-100" : "text-zinc-900"}`}>
              Fullstack Developer | QA Tester
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-2">
        <button
          onClick={handleDownloadCv}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-sm transition-all font-medium bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none`}
        >
          <Download size={16} /> Download CV
        </button>
        <a href={`mailto:${profile.links.email}`} className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-sm transition-all ${dark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-900" : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"}`}>
          <Mail size={16} /> Email
        </a>
        <a href={profile.links.github} target="_blank" rel="noreferrer" className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-sm transition-all ${dark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-900" : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"}`}>
          <Github size={16} /> GitHub
        </a>
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-sm transition-all ${dark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-900" : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"}`}>
          <Linkedin size={16} /> LinkedIn
        </a>
      </div>
    </section>
  );
}