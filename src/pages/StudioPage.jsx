import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Code2, Github, Linkedin, Mail, Moon, Sun, Sparkles, ChevronDown, Search, Minus, Plus } from "lucide-react";
import { profile } from "../data/profile";
import heroLight from "../assets/hero.jpg";
import heroDark from "../assets/hero-dark.png";

export default function StudioPage({ dark, setDark, portfolioStyle, setPortfolioStyle }) {
  const [projectFilter, setProjectFilter] = useState("All projects");
  const [query, setQuery] = useState("");
  const [projectPage, setProjectPage] = useState(1);
  const [fontScale, setFontScale] = useState(() => Number(localStorage.getItem("studio-font-scale")) || 1);
  const projectsPerPage = 6;
  const categories = ["All projects", "Featured", "Other"];
  const projects = useMemo(() => profile.projects.filter((project) => {
    const categoryMatch = projectFilter === "All projects" || (projectFilter === "Featured" ? project.featured : !project.featured);
    const searchableText = [project.title, project.description, project.impact, ...(project.features || []), ...project.technologies].join(" ").toLocaleLowerCase();
    const queryMatch = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean).every((term) => searchableText.includes(term));
    return categoryMatch && queryMatch;
  }), [projectFilter, query]);
  const pageCount = Math.max(1, Math.ceil(projects.length / projectsPerPage));
  const visibleProjects = projects.slice((projectPage - 1) * projectsPerPage, projectPage * projectsPerPage);
  useEffect(() => { setProjectPage(1); }, [projectFilter, query]);
  useEffect(() => { localStorage.setItem("studio-font-scale", String(fontScale)); }, [fontScale]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("studio-revealed"); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    document.querySelectorAll(".studio-shell main > section:not(.studio-hero):not(.studio-marquee), .studio-project").forEach((node) => {
      node.classList.add("studio-reveal");
      observer.observe(node);
    });
    return () => observer.disconnect();
  }, [projectPage, projects]);
  const featuredSkills = ["AI products", "Full-stack systems", "Product engineering", "Quality & testing"];
  return (
    <div className={`studio-page ${dark ? "studio-dark" : ""}`} style={{ "--studio-font-scale": fontScale }}>
      <div className="studio-shell">
        <header className="studio-nav">
          <a className="studio-brand" href="#home" aria-label="Back to top">DT<span>®</span></a>
          <nav aria-label="Main navigation">
            <a href="#work">Work <span>{profile.projects.length.toString().padStart(2, "0")}</span></a><a href="#about">About</a><a href="#experience">Experience</a><a href="#stack">Stack</a><a href="#contact">Contact</a>
          </nav>
          <div className="studio-controls">
            <label className="studio-style-select"><span className="style-dot"/><select aria-label="Portfolio layout" value={portfolioStyle} onChange={(event) => setPortfolioStyle(event.target.value)}><option value="studio">Studio layout</option><option value="resume">Resume layout</option></select><ChevronDown size={13}/></label>
            <div className="studio-font-controls" aria-label="Font size"><button onClick={() => setFontScale((size) => Math.max(0.9, Number((size - 0.1).toFixed(1))))} aria-label="Decrease font size" disabled={fontScale <= 0.9}><Minus size={13}/></button><span>{Math.round(fontScale * 100)}%</span><button onClick={() => setFontScale((size) => Math.min(1.2, Number((size + 0.1).toFixed(1))))} aria-label="Increase font size" disabled={fontScale >= 1.2}><Plus size={13}/></button></div>
            <button className="studio-icon-button" onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
          </div>
        </header>

        <main id="home">
          <section className="studio-hero" onPointerMove={(event) => { const box = event.currentTarget.getBoundingClientRect(); const x = (event.clientX - box.left) / box.width; const y = (event.clientY - box.top) / box.height; event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - box.left}px`); event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - box.top}px`); event.currentTarget.style.setProperty("--tilt-x", `${(x - 0.5) * 8}deg`); event.currentTarget.style.setProperty("--tilt-y", `${(0.5 - y) * 6}deg`); }} onPointerLeave={(event) => { event.currentTarget.style.setProperty("--tilt-x", "0deg"); event.currentTarget.style.setProperty("--tilt-y", "0deg"); }}>
            <div className="studio-hero-copy">
              <div className="studio-eyebrow"><span className="availability-dot" /> AVAILABLE FOR SELECT PROJECTS <span className="eyebrow-year">2026</span></div>
              <h1>Building digital<br />things with <span>intention.</span></h1>
              <p className="studio-intro">I’m {profile.name}, a full-stack developer turning ambitious ideas into thoughtful, useful products — from the first interface to the systems behind it.</p>
              <p className="studio-credential">{profile.badge}</p>
              <div className="studio-hero-actions"><a className="studio-primary" href="#work">Explore selected work <ArrowDownRight size={16} /></a><a className="studio-text-link" href={`mailto:${profile.links.email}`}>Let’s talk <ArrowUpRight size={15} /></a></div>
              <div className="studio-meta"><span>{profile.location}</span><span>FULL-STACK · AI · PRODUCT</span></div>
            </div>
            <div className="studio-portrait-wrap"><div className="portrait-orbit orbit-one"/><div className="portrait-orbit orbit-two"/><div className="portrait-card"><img src={dark ? heroDark : heroLight} alt="Portrait of Diogenes Tayam"/><div className="portrait-label"><span>INDEPENDENT DEVELOPER</span><span>PH · 2026</span></div></div><div className="portrait-sticker"><Sparkles size={17}/><span>IDEAS →<br/>INTERFACES</span></div><div className="portrait-index">01 / 04</div></div>
          </section>

          <section className="studio-marquee" aria-label="Areas of focus"><div>{[...featuredSkills, ...featuredSkills].map((skill, i) => <span key={`${skill}-${i}`}><i>✳</i>{skill}</span>)}</div></section>

          <section id="work" className="studio-section">
            <div className="studio-section-heading"><div><p className="studio-kicker">01 — PROJECT ARCHIVE · {projects.length} PROJECTS</p><h2>Built to make<br/>a difference<span>.</span></h2></div><p className="section-aside">Products, platforms, and systems I’ve helped bring to life. Search or filter the full project archive.</p></div>
            <div className="studio-project-tools"><div className="studio-filters" role="group" aria-label="Filter projects">{categories.map((category) => <button key={category} className={projectFilter === category ? "active" : ""} aria-pressed={projectFilter === category} onClick={() => setProjectFilter(category)}>{category}{category === "All projects" ? ` (${profile.projects.length})` : ""}</button>)}</div><label className="studio-search"><Search size={17}/><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects or technology" aria-label="Search projects"/></label></div>
            <div className="studio-project-grid">{visibleProjects.map((project, index) => <article className={`studio-project studio-reveal project-${(index % 6) + 1}`} key={project.id}>
              <div className="project-visual"><div className="visual-topline"><span>CASE STUDY&nbsp; / &nbsp;{String(project.id).padStart(2, "0")}</span><span>{project.technologies[0]}</span></div><div className={`project-art art-${(index % 6) + 1}`}>
                {index === 0 ? <div className="stream-ui"><div className="stream-sidebar"/><div className="stream-content"><div className="stream-pill">LEARN SOMETHING NEW</div><div className="stream-title">Built for<br/><b>the real world.</b></div><div className="stream-play">▶</div><div className="stream-lines"/></div></div> : index === 1 ? <div className="travel-ui"><span className="travel-sun"/><div className="travel-word">travera<span>®</span></div><div className="travel-route route-a"/><div className="travel-route route-b"/><div className="travel-pin pin-a">✦</div><div className="travel-pin pin-b">●</div><div className="travel-note">YOUR NEXT<br/>CHAPTER</div></div> : index === 2 ? <div className="ai-ui"><div className="ai-orb"><Sparkles size={34}/></div><div className="ai-corners">✳ &nbsp; THINK LESS. DO MORE.</div><div className="ai-dashboard"><span>YOUR WORKSPACE</span><b>Good morning, builder.</b><i>✦ Generate an idea</i></div></div> : <div className="generic-art"><Code2 size={42}/><span>{project.title}</span><small>DESIGNED FOR WHAT’S NEXT</small></div>}
              </div><div className="project-index">{String(project.id).padStart(2, "0")}</div></div>
              <div className="studio-project-info"><div><h3>{project.title}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${project.title}`}><ArrowUpRight size={16}/></a>}</h3><p>{project.description}</p></div><div className="project-tags">{project.technologies.slice(0, 3).map((tech) => <span key={tech}>{tech}</span>)}</div></div>
              <details className="studio-project-details"><summary>Project details <ChevronDown size={13}/></summary><div>{project.impact && <p><b>Impact</b>{project.impact}</p>}{project.features?.length > 0 && <p><b>Highlights</b>{project.features.join(" · ")}</p>}<p><b>Technology</b>{project.technologies.join(" · ")}</p><div className="detail-links">{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live project <ArrowUpRight size={13}/></a>}{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">Source code <Github size={13}/></a>}</div></div></details>
            </article>)}</div>
            {projects.length === 0 && <p className="studio-empty">No projects match that search. Try another keyword.</p>}
            {pageCount > 1 && <nav className="studio-pagination" aria-label="Project pages"><button onClick={() => { setProjectPage((page) => Math.max(1, page - 1)); document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }); }} disabled={projectPage === 1}>← Previous</button><div>{Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <button key={page} className={projectPage === page ? "active" : ""} aria-current={projectPage === page ? "page" : undefined} onClick={() => { setProjectPage(page); document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }); }}>{String(page).padStart(2, "0")}</button>)}</div><span>PAGE {String(projectPage).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}</span><button onClick={() => { setProjectPage((page) => Math.min(pageCount, page + 1)); document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }); }} disabled={projectPage === pageCount}>Next →</button></nav>}
          </section>



          <section id="about" className="studio-about"><div className="studio-about-top"><p className="studio-kicker">02 — ABOUT</p><span className="about-coordinates">{profile.location}</span></div><div className="studio-about-grid"><h2>Curious by nature.<br/><span>Builder by choice.</span></h2><div><p>{profile.about[0]}</p><p>{profile.about[1]}</p><a href={profile.links.github} target="_blank" rel="noreferrer" className="studio-text-link">More about my work <ArrowUpRight size={15}/></a></div></div><div className="studio-interests"><span className="studio-kicker">AREAS I’M INTO</span><div>{profile.interests.map((interest) => <span key={interest}>{interest}</span>)}</div></div></section>

          <section id="experience" className="studio-experience"><p className="studio-kicker">03 — EXPERIENCE</p><h2>Where I’ve<br/><span>made an impact.</span></h2><div className="studio-timeline">{profile.experience.map((item, index) => <article className="studio-role" key={`${item.company}-${index}`}><div className="role-date">{item.year}<span>{item.active ? "CURRENT" : "PAST"}</span></div><div className="role-content"><h3>{item.role}</h3><p className="role-company">{item.company} · {item.employmentType}</p><p>{item.description}</p></div></article>)}</div></section>

          <section id="stack" className="studio-stack studio-reveal"><div className="studio-section-heading"><div><p className="studio-kicker">04 — TECHNOLOGY & TOOLS</p><h2>The full<br/><span>toolkit.</span></h2></div><p className="section-aside">Technologies and tools I use across frontend, backend, mobile, AI, infrastructure, and product work.</p></div><div className="studio-stack-grid">{Object.entries(profile.techStack).map(([category, items], index) => <article className="studio-stack-card" key={category}><div className="stack-card-heading"><span>{String(index + 1).padStart(2, "0")}</span><h3>{category}</h3><span>{String(items.length).padStart(2, "0")} TOOLS</span></div><div className="stack-chips">{items.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div></section>

          <section className="studio-education"><p className="studio-kicker">05 — LEARNING & CERTIFICATES</p><h2>Always learning.</h2><div className="studio-certs">{profile.seminars.map((item, index) => <a key={`${item.title}-${index}`} href={item.pdf || undefined} target={item.pdf ? "_blank" : undefined} rel="noreferrer" className="studio-cert"><span>{item.date}</span><h3>{item.title}</h3><p>{item.organization}</p><ArrowUpRight size={15}/></a>)}</div></section>

          <section className="studio-note"><Sparkles size={18}/><p>Good software should feel obvious to use<br/><span>and impossible to imagine without.</span></p><span className="note-signature">— D.T.</span></section>

          <section id="contact" className="studio-contact"><div><p className="studio-kicker">06 — HAVE SOMETHING IN MIND?</p><h2>Let’s make it<br/><span>real.</span></h2></div><div className="contact-panel"><p>I’m always interested in thoughtful products, ambitious teams, and ideas that make life a little better.</p><a className="contact-email" href={`mailto:${profile.links.email}`}>{profile.links.email}<ArrowUpRight size={17}/></a><a className="contact-email" href={`tel:${profile.links.phone.replace(/\s/g, "")}`}>{profile.links.phone}<ArrowUpRight size={17}/></a><p className="studio-handle">{profile.accessCard.role}: <a href={profile.links.github} target="_blank" rel="noreferrer">{profile.accessCard.name}</a> · {profile.accessCard.label}</p><div className="contact-socials"><a href={profile.links.github} target="_blank" rel="noreferrer"><Github size={15}/> GitHub</a><a href={profile.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15}/> LinkedIn</a><a href={`mailto:${profile.links.email}`}><Mail size={15}/> Email</a></div><a className="studio-blog" href={profile.links.blog}>Blog <ArrowUpRight size={13}/></a></div></section>
        </main>
        <footer className="studio-footer"><a className="studio-brand" href="#home">DT<span>®</span></a><span>DESIGNED & BUILT WITH CURIOSITY</span><a href="#home">BACK TO TOP ↑</a><span>© {new Date().getFullYear()} DIOGENES TAYAM</span></footer>
      </div>
    </div>
  );
}
