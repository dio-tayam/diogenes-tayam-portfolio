import { ArrowLeft, Moon, Sun } from "lucide-react";
import { profile } from "../data/profile";

export default function SkillsPage({ dark, setDark, setCurrentPage }) {
  const muted = dark ? "text-zinc-400" : "text-zinc-600";
  const text = dark ? "text-zinc-100" : "text-zinc-900";
  const cardBg = dark ? "bg-[#0f0f0f] border-zinc-800" : "bg-white border-zinc-200";
  const hoverBg = dark ? "hover:bg-[#141414]" : "hover:bg-zinc-50";
  const bgColor = dark ? "#000000" : "#ffffff";

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
                <h1 className="text-2xl font-bold">Tech Stack</h1>
                <p className={`text-xs mt-1 ${muted}`}>Detailed skills overview</p>
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
          {/* Tech Stack Overview */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Core Stack</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(profile.techStack).map(([category, items]) => (
                <div key={category} className={`rounded-sm border p-4 transition-all ${cardBg} ${hoverBg}`}>
                  <h3 className={`text-sm font-semibold mb-3 ${text}`}>{category}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <span 
                        key={item} 
                        className={`px-2.5 py-1 text-xs border rounded-sm ${dark ? "bg-[#070707] border-zinc-700 text-zinc-300" : "bg-zinc-50 border-zinc-300 text-zinc-700"}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className={`border-t text-center py-6 text-xs transition-colors ${dark ? "border-zinc-800 text-zinc-400" : "border-zinc-200 text-zinc-500"}`}>
          <p>© {new Date().getFullYear()} Diogenes A. Tayam III. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
