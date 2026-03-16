import { profile } from "../data/profile";

// Generated once, outside component — stable across re-renders
const qrPattern = [...Array(9)].map(() => Math.random() > 0.4);

export default function AccessCard({ dark }) {
  const { accessCard } = profile;
  const bgColor = dark ? "bg-gradient-to-br from-[#111111] to-[#070707]" : "bg-gradient-to-br from-white to-zinc-50";
  const borderColor = dark ? "border-zinc-800" : "border-zinc-200";
  const textAccent = dark ? "text-zinc-200" : "text-zinc-800";
  const textMuted = dark ? "text-zinc-500" : "text-zinc-500";
  const textLight = dark ? "text-zinc-100" : "text-zinc-900";

  return (
    <div data-reveal className={`rounded-sm border ${borderColor} overflow-hidden p-5 font-sans relative transition-all ${bgColor}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/10 to-transparent" />

      <div className="relative z-10">
        <div className={`text-3xl mb-4 font-bold ${textAccent}`}>{">_"}</div>
        {/* <div className={`font-bold tracking-wider text-lg mb-1 ${textLight}`}>{accessCard.group}</div> */}
        {/* <div className={`text-xs tracking-wider mb-6 ${textMuted}`}>ACCESS CARD</div> */}

        <div className={`text-xs tracking-wider uppercase mb-2 ${textMuted}`}>{accessCard.role}</div>
        <div className={`text-2xl font-bold tracking-wider mb-6 ${textLight}`}>{accessCard.name}</div>

        <div className="flex items-end justify-between pt-4 border-t" style={{ borderColor: dark ? "#27272a" : "#d4d4d8" }}>
          <div className={`text-xs tracking-wider uppercase ${textMuted}`}>{accessCard.label}</div>
          <div className="w-10 h-10 grid grid-cols-3 gap-0.5">
            {qrPattern.map((filled, i) => (
              <div key={i} className={`rounded-sm transition-all ${filled ? (dark ? "bg-zinc-400/70" : "bg-zinc-700/70") : dark ? "bg-zinc-800" : "bg-zinc-200"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}