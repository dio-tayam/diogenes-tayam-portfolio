import { profile } from "../data/profile";

export default function Experience({ dark }) {
  const muted = dark ? "text-zinc-400" : "text-zinc-600";
  const text = dark ? "text-zinc-100" : "text-zinc-900";
  const lineBg = dark ? "bg-zinc-700" : "bg-zinc-200";
  const cardBg = dark ? "bg-[#0f0f0f] border-zinc-800" : "bg-white border-zinc-200";

  return (
    <section data-reveal>
      <h2 className={`text-xl font-bold tracking-tight mb-6 ${text}`}>Experience</h2>
      <div className="relative">
        <div className={`absolute left-[5px] top-2 bottom-2 w-px ${lineBg}`} />

        <div className="space-y-6">
          {profile.experience.map((exp, i) => (
            <div key={i} className="relative flex gap-4 pl-6">
              {/* Dot */}
              <div className={`absolute left-0 top-2 w-[10px] h-[10px] rounded-full border-2 flex-shrink-0 z-10 ${
                exp.active
                  ? "bg-blue-500 border-blue-500"
                  : dark
                  ? "bg-[#0f0f0f] border-zinc-600"
                  : "bg-white border-zinc-400"
              }`} />

              {/* Card */}
              <div className={`flex-1 rounded-sm border p-3 ${cardBg}`}>
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className={`text-sm font-semibold leading-snug ${text}`}>{exp.role}</p>
                    <p className={`text-xs font-medium mt-0.5 ${muted}`}>{exp.company}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`text-xs ${muted}`}>{exp.year}</span>
                    {/* {exp.active && (
                      <span className="text-[10px] text-green-500">● Active</span>
                    )} */}
                  </div>
                </div>
                {exp.employmentType && (
                  <p className={`text-xs mt-1.5 ${muted}`}>{exp.employmentType}</p>
                )}
                {exp.description && (
                  <p className={`text-xs mt-2 leading-relaxed ${muted}`}>{exp.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}