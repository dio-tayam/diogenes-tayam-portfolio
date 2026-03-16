import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { profile } from "../data/profile";

export default function Contact({ dark }) {
  const muted = dark ? "text-zinc-400" : "text-zinc-600";
  const text = dark ? "text-zinc-100" : "text-zinc-900";
  const iconBg = dark ? "bg-zinc-800" : "bg-zinc-100";
  const cardBg = dark ? "bg-[#0f0f0f] border-zinc-800" : "bg-white border-zinc-200";
  const hoverBg = dark ? "hover:bg-[#141414]" : "hover:bg-zinc-50";

  return (
    <section data-reveal>
      <h2 className={`text-xl font-bold tracking-tight mb-5 ${text}`}>Contact</h2>
      <div className="space-y-3">
        {[
          { icon: Mail, label: "Email", value: profile.links.email, href: `mailto:${profile.links.email}` },
          { icon: Phone, label: "Phone", value: profile.links.phone, href: `tel:${profile.links.phone.replace(/\s/g, "")}` },
          { icon: MapPin, label: "Location", value: profile.location, href: "#" },
          { icon: Github, label: "GitHub", value: "github.com/thirdxx", href: profile.links.github },
          { icon: Linkedin, label: "LinkedIn", value: "Connect on LinkedIn", href: profile.links.linkedin },
        ].map(({ icon, label, value, href }) => {
          const IconComponent = icon;
          return (
          <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
            className={`flex items-center gap-3 p-3 rounded-sm border transition-all ${cardBg} ${hoverBg}`}>
            <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <IconComponent size={14} className={dark ? "text-zinc-300" : "text-zinc-700"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium uppercase tracking-wider ${muted}`}>{label}</p>
              <p className={`text-xs transition-colors ${text}`}>{value}</p>
            </div>
          </a>
        );
        })}
      </div>
    </section>
  );
}