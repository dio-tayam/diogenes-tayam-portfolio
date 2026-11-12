import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, LogOut, RotateCcw, Save, Upload, Check, Copy, Loader2 } from "lucide-react";
import FieldEditor from "./FieldEditor";
import { humanize } from "./humanize";
import { REPO, actionsUrl, getFile, getFileSha, putFile, utf8ToBase64, verifyToken } from "./github";

const TOKEN_KEY = "portfolio-admin-token";
const SITE_BASE = import.meta.env.BASE_URL; // "/diogenes-tayam-portfolio/"

// Top-level keys that get their own tab; everything else goes under "Profile".
const OWN_TABS = ["techStack", "projects", "experience", "seminars"];

function readStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function storeToken(token, remember) {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    if (token) (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable — token lives in memory only */
  }
}

const btn = "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-50";
const btnPrimary = `${btn} bg-indigo-600 text-white hover:bg-indigo-700`;
const btnGhost = `${btn} border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50`;

function Login({ onLogin }) {
  const [token, setToken] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await verifyToken(token.trim());
      storeToken(token.trim(), remember);
      onLogin(token.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Portfolio Admin</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Sign in with a GitHub fine-grained token for <code className="text-zinc-700">{REPO.owner}/{REPO.name}</code>.
          </p>
        </div>
        <input
          type="password"
          autoComplete="off"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="github_pat_…"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-zinc-600">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-indigo-600" />
          Remember on this device
        </label>
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={!token.trim() || busy} className={`${btnPrimary} w-full justify-center`}>
          {busy && <Loader2 size={14} className="animate-spin" />} Sign in
        </button>
        <details className="text-xs text-zinc-500">
          <summary className="cursor-pointer font-medium text-zinc-600">How do I get a token?</summary>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>
              Open{" "}
              <a className="text-indigo-600 underline" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">
                GitHub → New fine-grained token
              </a>
              .
            </li>
            <li>Repository access: <b>Only select repositories</b> → {REPO.name}.</li>
            <li>Permissions → Repository → <b>Contents: Read and write</b>. Nothing else.</li>
            <li>Generate, then paste it here.</li>
          </ol>
        </details>
      </form>
    </div>
  );
}

function FilesTab({ token }) {
  const [folder, setFolder] = useState("certificates");
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const repoPath = `public/${folder ? `${folder}/` : ""}${name}`;
  const sitePath = `${SITE_BASE}${folder ? `${folder}/` : ""}${name}`;

  const upload = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      const b64 = String(dataUrl).split(",")[1];
      const existing = await getFileSha(token, repoPath);
      if (existing && !window.confirm(`${repoPath} already exists. Replace it?`)) return;
      const res = await putFile(token, repoPath, b64, `${existing ? "Update" : "Add"} ${repoPath} via admin`, existing);
      setStatus({ ok: true, commitUrl: res.commitUrl, sitePath });
    } catch (err) {
      setStatus({ ok: false, message: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600">
        Upload certificates, images or your résumé into <code>public/</code>. Then paste the site path into a field
        (e.g. a seminar's <b>Pdf</b>). Uploading to the root as <code>resume.pdf</code> replaces your résumé.
      </p>
      <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
        <select className="rounded-md border border-zinc-300 px-3 py-2 text-sm" value={folder} onChange={(e) => setFolder(e.target.value)}>
          <option value="certificates">certificates/</option>
          <option value="projects">projects/</option>
          <option value="">(public root)</option>
        </select>
        <input
          type="file"
          className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            setFile(f);
            setName(f ? f.name.replace(/\s+/g, "-").toLowerCase() : "");
            setStatus(null);
          }}
        />
      </div>
      {file && (
        <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">File name</label>
          <input className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value.trim())} />
          <p className="text-xs text-zinc-500">
            Repo: <code>{repoPath}</code> · Site path: <code>{sitePath}</code> · {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          {file.size > 25 * 1024 * 1024 && <p className="text-sm text-amber-700">Files over 25 MB may be rejected by GitHub.</p>}
          <button className={btnPrimary} disabled={!name || busy} onClick={upload}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload &amp; commit
          </button>
        </div>
      )}
      {status?.ok && (
        <div className="space-y-2 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <p>
            Uploaded. <a className="underline" href={status.commitUrl} target="_blank" rel="noreferrer">View commit</a>. Live after the deploy finishes.
          </p>
          <div className="flex items-center gap-2">
            <code className="rounded bg-white px-2 py-1">{status.sitePath}</code>
            <button
              className={btnGhost}
              onClick={() => {
                navigator.clipboard?.writeText(status.sitePath);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} Copy path
            </button>
          </div>
        </div>
      )}
      {status && !status.ok && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{status.message}</p>}
    </div>
  );
}

function RawJsonTab({ data, onApply }) {
  const [text, setText] = useState(() => JSON.stringify(data, null, 2));
  const [error, setError] = useState("");
  useEffect(() => setText(JSON.stringify(data, null, 2)), [data]);
  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-600">Edit the whole data file directly. Click Apply, then Save to commit.</p>
      <textarea
        className="h-[60vh] w-full rounded-md border border-zinc-300 p-3 font-mono text-xs leading-relaxed outline-none focus:border-indigo-500"
        spellCheck={false}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button
        className={btnGhost}
        onClick={() => {
          try {
            const parsed = JSON.parse(text);
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Top level must be an object.");
            setError("");
            onApply(parsed);
          } catch (err) {
            setError(`Invalid JSON: ${err.message}`);
          }
        }}
      >
        Apply
      </button>
    </div>
  );
}

function Editor({ token, onLogout }) {
  const [original, setOriginal] = useState(null); // { sha, data }
  const [draft, setDraft] = useState(null);
  const [tab, setTab] = useState("profile");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const load = useCallback(async () => {
    setLoadError("");
    setResult(null);
    try {
      const file = await getFile(token, REPO.dataPath);
      if (!file) throw new Error(`${REPO.dataPath} not found on ${REPO.branch}. Push the admin setup commit first.`);
      const data = JSON.parse(file.text);
      setOriginal({ sha: file.sha, data });
      setDraft(data);
    } catch (err) {
      setLoadError(err.message);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(
    () => (original && draft ? JSON.stringify(original.data) !== JSON.stringify(draft) : false),
    [original, draft]
  );

  const dirtyKeys = useMemo(() => {
    if (!dirty) return new Set();
    const keys = new Set([...Object.keys(original.data), ...Object.keys(draft)]);
    return new Set([...keys].filter((k) => JSON.stringify(original.data[k]) !== JSON.stringify(draft[k])));
  }, [dirty, original, draft]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const edit = (next) => {
    setDraft(next);
    setResult(null);
  };

  const save = async () => {
    setSaving(true);
    setResult(null);
    try {
      const text = JSON.stringify(draft, null, 2) + "\n";
      const changed = [...dirtyKeys].map(humanize).join(", ");
      const res = await putFile(
        token,
        REPO.dataPath,
        utf8ToBase64(text),
        message.trim() || `Update ${changed || "portfolio content"} via admin`,
        original.sha
      );
      setOriginal({ sha: res.sha, data: draft });
      setMessage("");
      setResult({ ok: true, commitUrl: res.commitUrl });
    } catch (err) {
      setResult({ ok: false, message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg space-y-3 px-4 py-16 text-center">
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p>
        <div className="flex justify-center gap-2">
          <button className={btnGhost} onClick={load}>Retry</button>
          <button className={btnGhost} onClick={onLogout}>Sign out</button>
        </div>
      </div>
    );
  }
  if (!draft) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        <Loader2 size={16} className="mr-2 animate-spin" /> Loading data from GitHub…
      </div>
    );
  }

  const profileKeys = Object.keys(draft).filter((k) => !OWN_TABS.includes(k));
  const tabs = [
    { id: "profile", label: "Profile", dirty: profileKeys.some((k) => dirtyKeys.has(k)) },
    ...OWN_TABS.filter((k) => k in draft).map((k) => ({ id: k, label: humanize(k), dirty: dirtyKeys.has(k) })),
    { id: "files", label: "Files" },
    { id: "raw", label: "Raw JSON" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <h1 className="text-base font-semibold text-zinc-900">
            Portfolio Admin
            {REPO.branch !== "main" && (
              <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">branch: {REPO.branch}</span>
            )}
          </h1>
          <div className="flex items-center gap-2">
            <a className={btnGhost} href={SITE_BASE} target="_blank" rel="noreferrer">
              <ExternalLink size={14} /> View site
            </a>
            <button
              className={btnGhost}
              onClick={() => {
                if (!dirty || window.confirm("Discard unsaved changes and sign out?")) onLogout();
              }}
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${
                tab === t.id ? "border-indigo-600 text-indigo-700" : "border-transparent text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {t.label}
              {t.dirty && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500 align-middle" />}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {tab === "profile" && (
          <FieldEditor
            value={Object.fromEntries(profileKeys.map((k) => [k, draft[k]]))}
            onChange={(v) => edit({ ...draft, ...v })}
          />
        )}
        {OWN_TABS.includes(tab) && (
          <FieldEditor fieldKey={tab} value={draft[tab]} onChange={(v) => edit({ ...draft, [tab]: v })} />
        )}
        {tab === "files" && <FilesTab token={token} />}
        {tab === "raw" && <RawJsonTab data={draft} onApply={edit} />}
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 px-4 py-3">
          {result?.ok && !dirty ? (
            <p className="flex-1 text-sm text-emerald-700">
              Saved. <a className="underline" href={result.commitUrl} target="_blank" rel="noreferrer">Commit</a> ·{" "}
              <a className="underline" href={actionsUrl} target="_blank" rel="noreferrer">Watch deploy</a> (live in ~1–2 min)
            </p>
          ) : result && !result.ok ? (
            <p className="flex-1 text-sm text-red-700">{result.message}</p>
          ) : (
            <input
              className="min-w-0 flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder={dirty ? `Commit message (default: Update ${[...dirtyKeys].map(humanize).join(", ")} via admin)` : "No changes"}
              value={message}
              disabled={!dirty}
              onChange={(e) => setMessage(e.target.value)}
            />
          )}
          <button
            className={btnGhost}
            disabled={saving || (!dirty && !(result && !result.ok))}
            onClick={() => {
              if (result && !result.ok && result.message.includes("Reload")) load();
              else if (window.confirm("Discard all unsaved changes?")) {
                setDraft(original.data);
                setResult(null);
              }
            }}
          >
            <RotateCcw size={14} /> {result && !result.ok && result.message.includes("Reload") ? "Reload" : "Discard"}
          </button>
          <button className={btnPrimary} disabled={!dirty || saving} onClick={save}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save &amp; publish
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function AdminApp() {
  const [token, setToken] = useState(readStoredToken);
  const logout = () => {
    storeToken("", false);
    setToken("");
  };
  return token ? <Editor token={token} onLogout={logout} /> : <Login onLogin={setToken} />;
}
