import { MapPin, Mail, Calendar, BookOpen, ChevronRight, BadgeCheck } from "lucide-react";
import { profile } from "../data/profile";

export default function Header() {
  return (
    <header className="border-b border-border bg-surface/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center font-display font-bold text-white text-sm">
            DT
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-light text-base">Diogenes Tayam</span>
              <BadgeCheck size={15} className="text-accent" />
            </div>
            <div className="flex items-center gap-1 text-muted text-xs">
              <MapPin size={10} />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <a href={`mailto:${profile.links.email}`} className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg text-muted hover:text-light hover:border-accent/50 transition-all">
            <Mail size={12} /> Send Email
          </a>
          <a href={profile.links.schedule} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-accent rounded-lg text-white hover:bg-accent/80 transition-all font-medium">
            <Calendar size={12} /> Schedule a Call
          </a>
          <a href={profile.links.blog} className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg text-muted hover:text-light hover:border-accent/50 transition-all">
            <BookOpen size={12} /> Blog <ChevronRight size={10} />
          </a>
        </div>
      </div>
    </header>
  );
}