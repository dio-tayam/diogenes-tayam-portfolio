// Minimal GitHub REST client for reading/writing files in the portfolio repo.
// Every write is a commit on BRANCH, which triggers the Pages deploy workflow.

export const REPO = {
  owner: "dio-tayam",
  name: "diogenes-tayam-portfolio",
  // Override for local testing: VITE_ADMIN_BRANCH=admin-test npm run dev
  branch: import.meta.env.VITE_ADMIN_BRANCH || "main",
  dataPath: "src/data/profile.json",
};

const API = "https://api.github.com";

export class GitHubError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(token, path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (res.status === 404 && options.allow404) return null;
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json()).message;
    } catch {
      /* no body */
    }
    const hints = {
      401: "Token is invalid or expired.",
      403: "Token lacks permission (needs Contents: Read and write on this repo).",
      409: "Someone else changed the file since you loaded it. Reload and re-apply your edits.",
      422: "GitHub rejected the update (file may have changed). Reload and try again.",
    };
    throw new GitHubError(hints[res.status] || detail || `GitHub API error ${res.status}`, res.status);
  }
  return res.status === 204 ? null : res.json();
}

const contentsPath = (path) =>
  `/repos/${REPO.owner}/${REPO.name}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;

// UTF-8 safe base64 helpers (profile data contains emoji / non-ASCII).
export function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

function base64ToUtf8(b64) {
  const binary = atob(b64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export async function verifyToken(token) {
  const repo = await request(token, `/repos/${REPO.owner}/${REPO.name}`);
  if (!repo.permissions?.push) {
    throw new GitHubError("This token can read the repo but cannot write to it.", 403);
  }
  return repo;
}

/** Returns { sha, text } or null if the file does not exist. */
export async function getFile(token, path) {
  const file = await request(token, `${contentsPath(path)}?ref=${REPO.branch}`, { allow404: true });
  if (!file) return null;
  return { sha: file.sha, text: base64ToUtf8(file.content) };
}

export async function getFileSha(token, path) {
  const file = await request(token, `${contentsPath(path)}?ref=${REPO.branch}`, { allow404: true });
  return file?.sha ?? null;
}

/** Create or update a file. `base64Content` must already be base64. Returns the commit info. */
export async function putFile(token, path, base64Content, message, sha) {
  const body = { message, content: base64Content, branch: REPO.branch };
  if (sha) body.sha = sha;
  const result = await request(token, contentsPath(path), {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return { sha: result.content.sha, commitUrl: result.commit.html_url };
}

export const actionsUrl = `https://github.com/${REPO.owner}/${REPO.name}/actions`;
