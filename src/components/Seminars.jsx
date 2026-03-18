import { profile } from "../data/profile";
import { Award, BookOpenText, Brain, GraduationCap } from "lucide-react";

export default function Seminars({ dark }) {
  const muted = dark ? "text-zinc-400" : "text-zinc-600";
  const text = dark ? "text-zinc-100" : "text-zinc-900";
  const cardBg = dark ? "bg-[#0f0f0f] border-zinc-800" : "bg-white border-zinc-200";
  const hoverBg = dark ? "hover:bg-[#141414]" : "hover:bg-zinc-50";
  const seminarIcons = [Brain, BookOpenText, GraduationCap, Award];

  return (
    <section data-reveal>
      <h2 className={`text-2xl font-bold tracking-tight mb-6 ${text}`}>Seminars & Training</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {profile.seminars.map((seminar, i) => {
          const Icon = seminarIcons[i % seminarIcons.length];
          return (
            <a
              key={i}
              href={seminar.pdf || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={`block rounded-sm border p-3 transition-all cursor-pointer ${cardBg} ${hoverBg} ${seminar.pdf ? "hover:shadow-lg" : "opacity-60 pointer-events-none"}`}
              title={seminar.pdf ? `View certificate for ${seminar.title}` : "No certificate available"}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 flex items-center justify-center border rounded-sm ${dark ? "border-zinc-700" : "border-zinc-300"}`}>
                  <Icon size={16} className={dark ? "text-zinc-300" : "text-zinc-700"} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm ${text}`}>{seminar.title}</h3>
                  <p className={`text-xs mt-1 ${muted}`}>{seminar.organization}</p>
                  <p className={`text-xs mt-0.5 ${muted}`}>{seminar.date}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}