import { useState } from "react";
import { ChevronDown, ChevronRight, ArrowUp, ArrowDown, Copy, Trash2, Plus } from "lucide-react";
import { humanize } from "./humanize";

// Generic recursive editor: renders any JSON value as form controls and reports
// changes immutably through onChange(newValue).

const LONG_TEXT_KEYS = new Set(["description", "impact", "about"]);

const inputCls =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
const iconBtn =
  "inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent";

/** Build an empty value shaped like `sample` (used when adding array items). */
function blankLike(sample) {
  if (Array.isArray(sample)) return [];
  if (sample === null) return null;
  if (typeof sample === "object") {
    return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, blankLike(v)]));
  }
  if (typeof sample === "boolean") return false;
  if (typeof sample === "number") return 0;
  return "";
}

function newItemFor(arr) {
  if (arr.length === 0) return "";
  const item = blankLike(arr[0]);
  // Keep numeric ids unique (projects rely on them).
  if (item && typeof item === "object" && !Array.isArray(item) && "id" in item) {
    item.id = Math.max(0, ...arr.map((x) => Number(x?.id) || 0)) + 1;
  }
  return item;
}

function itemLabel(item, index) {
  if (item && typeof item === "object") {
    const label = item.title || item.role || item.name || item.label;
    const sub = item.company || item.organization;
    if (label) return sub ? `${label} — ${sub}` : label;
  }
  return `Item ${index + 1}`;
}

function move(arr, from, to) {
  const next = [...arr];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

function PrimitiveField({ fieldKey, value, onChange }) {
  if (typeof value === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 accent-indigo-600"
        />
        {value ? "Yes" : "No"}
      </label>
    );
  }
  if (typeof value === "number") {
    return (
      <input
        type="number"
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    );
  }
  // strings and nulls (null = "not set"; empty input writes null back)
  const text = value ?? "";
  const isLong = LONG_TEXT_KEYS.has(fieldKey) || text.length > 90;
  const handle = (e) => onChange(value === null && e.target.value === "" ? null : e.target.value);
  return isLong ? (
    <textarea className={`${inputCls} min-h-[96px] leading-relaxed`} value={text} onChange={handle} rows={4} />
  ) : (
    <input className={inputCls} value={text} onChange={handle} placeholder={value === null ? "(empty)" : ""} />
  );
}

function PrimitiveList({ fieldKey, value, onChange }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange([...value, ...parts]);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-start gap-1">
          <div className="flex-1">
            <PrimitiveField
              fieldKey={fieldKey}
              value={item}
              onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))}
            />
          </div>
          <button type="button" className={iconBtn} disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} title="Move up">
            <ArrowUp size={14} />
          </button>
          <button type="button" className={iconBtn} disabled={i === value.length - 1} onClick={() => onChange(move(value, i, i + 1))} title="Move down">
            <ArrowDown size={14} />
          </button>
          <button type="button" className={`${iconBtn} hover:!text-red-600`} onClick={() => onChange(value.filter((_, j) => j !== i))} title="Remove">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          className={inputCls}
          value={draft}
          placeholder="Add item (comma-separate to add several)"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" onClick={add} className="shrink-0 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
          Add
        </button>
      </div>
    </div>
  );
}

function ObjectList({ value, onChange }) {
  const [open, setOpen] = useState(() => new Set());
  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="rounded-lg border border-zinc-200 bg-white">
          <div className="flex items-center gap-1 px-2 py-1.5">
            <button type="button" onClick={() => toggle(i)} className="flex flex-1 items-center gap-2 py-1 text-left text-sm font-medium text-zinc-800">
              {open.has(i) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="truncate">{itemLabel(item, i)}</span>
            </button>
            <button type="button" className={iconBtn} disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} title="Move up">
              <ArrowUp size={14} />
            </button>
            <button type="button" className={iconBtn} disabled={i === value.length - 1} onClick={() => onChange(move(value, i, i + 1))} title="Move down">
              <ArrowDown size={14} />
            </button>
            <button
              type="button"
              className={iconBtn}
              title="Duplicate"
              onClick={() => {
                const copy = structuredClone(item);
                if (copy && "id" in copy) copy.id = newItemFor(value).id;
                onChange([...value.slice(0, i + 1), copy, ...value.slice(i + 1)]);
              }}
            >
              <Copy size={14} />
            </button>
            <button
              type="button"
              className={`${iconBtn} hover:!text-red-600`}
              title="Delete"
              onClick={() => {
                if (window.confirm(`Delete "${itemLabel(item, i)}"?`)) onChange(value.filter((_, j) => j !== i));
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
          {open.has(i) && (
            <div className="border-t border-zinc-100 p-4">
              <FieldEditor value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          onChange([...value, newItemFor(value)]);
          setOpen((prev) => new Set(prev).add(value.length));
        }}
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 hover:border-indigo-400 hover:text-indigo-600"
      >
        <Plus size={14} /> Add item
      </button>
    </div>
  );
}

/** Object whose keys are user-defined (e.g. techStack categories). */
function KeyedObject({ value, onChange }) {
  const entries = Object.entries(value);
  const rename = (oldKey, newKey) => {
    if (!newKey || newKey === oldKey || newKey in value) return;
    onChange(Object.fromEntries(entries.map(([k, v]) => (k === oldKey ? [newKey, v] : [k, v]))));
  };
  return (
    <div className="space-y-4">
      {entries.map(([k, v], i) => (
        <div key={k} className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3">
          <div className="mb-2 flex items-center gap-1">
            <input
              className={`${inputCls} font-medium`}
              defaultValue={k}
              onBlur={(e) => rename(k, e.target.value.trim())}
              title="Category name (click away to rename)"
            />
            <button type="button" className={iconBtn} disabled={i === 0} onClick={() => onChange(Object.fromEntries(move(entries, i, i - 1)))} title="Move up">
              <ArrowUp size={14} />
            </button>
            <button type="button" className={iconBtn} disabled={i === entries.length - 1} onClick={() => onChange(Object.fromEntries(move(entries, i, i + 1)))} title="Move down">
              <ArrowDown size={14} />
            </button>
            <button
              type="button"
              className={`${iconBtn} hover:!text-red-600`}
              title="Delete category"
              onClick={() => {
                if (window.confirm(`Delete category "${k}"?`)) onChange(Object.fromEntries(entries.filter(([key]) => key !== k)));
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
          <FieldEditor fieldKey={k} value={v} onChange={(nv) => onChange({ ...value, [k]: nv })} />
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          let name = "New category";
          for (let n = 2; name in value; n++) name = `New category ${n}`;
          onChange({ ...value, [name]: [] });
        }}
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 hover:border-indigo-400 hover:text-indigo-600"
      >
        <Plus size={14} /> Add category
      </button>
    </div>
  );
}

export default function FieldEditor({ fieldKey, value, onChange }) {
  if (Array.isArray(value)) {
    const isObjects = value.length > 0 && value.every((x) => x && typeof x === "object" && !Array.isArray(x));
    return isObjects ? (
      <ObjectList value={value} onChange={onChange} />
    ) : (
      <PrimitiveList fieldKey={fieldKey} value={value} onChange={onChange} />
    );
  }

  if (value && typeof value === "object") {
    const vals = Object.values(value);
    if (vals.length > 0 && vals.every(Array.isArray)) {
      return <KeyedObject value={value} onChange={onChange} />;
    }
    return (
      <div className="grid gap-4">
        {Object.entries(value).map(([k, v]) => (
          <div key={k}>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">{humanize(k)}</label>
            <FieldEditor fieldKey={k} value={v} onChange={(nv) => onChange({ ...value, [k]: nv })} />
          </div>
        ))}
      </div>
    );
  }

  return <PrimitiveField fieldKey={fieldKey} value={value} onChange={onChange} />;
}
