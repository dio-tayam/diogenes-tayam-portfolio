import { ChevronRight } from "lucide-react";
import { profile } from "../data/profile";

export default function TechStack({ dark, setCurrentPage }) {
  const muted = dark ? "text-zinc-400" : "text-zinc-600";
  const text = dark ? "text-zinc-100" : "text-zinc-900";
  const categories = Object.entries(profile.techStack);
  const visible = categories.slice(0, 3);
  const tagStyle = `inline-flex items-center px-2.5 py-1 text-xs border rounded-sm transition-all ${dark ? "bg-[#0f0f0f] border-zinc-700 text-zinc-300" : "bg-white border-zinc-300 text-zinc-700"}`;

  return (
    <section data-reveal>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${text}`}>Tech Stack</h2>
          <p className={`text-xs mt-1 ${muted}`}>Core technologies and tools</p>
        </div>
        <button 
          onClick={() => setCurrentPage("skills")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-sm transition-colors ${dark ? "border-zinc-700 text-zinc-200 hover:bg-zinc-900" : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"}`}
        >
          View All <ChevronRight size={16} />
        </button>
      </div>
      <div className="space-y-4">
        {visible.map(([cat, skills]) => (
          <div key={cat}>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${muted}`}>{cat}</p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => <span key={s} className={tagStyle}>{s}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}