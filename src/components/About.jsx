import { profile } from "../data/profile";

export default function About({ dark }) {
  const muted = dark ? "text-zinc-400" : "text-zinc-600";
  const text = dark ? "text-zinc-100" : "text-zinc-900";
  const tagStyle = `inline-block px-2.5 py-1 text-xs rounded-sm border cursor-default transition-all ${dark ? "bg-[#0f0f0f] border-zinc-700 text-zinc-300" : "bg-zinc-50 border-zinc-300 text-zinc-700"}`;

  return (
    <section data-reveal className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold tracking-tight mb-4 ${text}`}>About</h2>
        <div className="space-y-4">
          {profile.about.map((para, i) => (
            <p key={i} className={`text-[15px] leading-relaxed ${muted}`}>{para}</p>
          ))}
        </div>
      </div>

      <div>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${muted}`}>Education</p>
        <div className={`border rounded-sm p-3 ${dark ? "border-zinc-700 bg-[#0f0f0f]" : "border-zinc-300 bg-zinc-50"}`}>
          <p className={`text-sm font-semibold ${text}`}>Bachelor of Science in Information Technology</p>
          <p className={`text-xs mt-1 ${muted}`}>Magna Cum Laude</p>
          <p className={`text-xs mt-1 ${muted}`}>2021 - 2025</p>
        </div>
      </div>

      <div>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${muted}`}>Interests</p>
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((item) => (
            <span key={item} className={tagStyle}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}