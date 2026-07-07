import type { Team } from "./types";

const FILE_PATH = "data/teams.json";

function repoConfig() {
  const repo = process.env.GITHUB_REPO ?? "gioelestrazzarino/fantacalcio-webapp";
  const branch = process.env.GITHUB_BRANCH ?? "main";
  const token = process.env.GITHUB_TOKEN;
  return { repo, branch, token };
}

export function hasGithubToken(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

async function githubRequest(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const { token } = repoConfig();
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init.headers,
    },
    cache: "no-store",
  });
}

interface RemoteFile {
  teams: Team[];
  sha: string;
}

// Legge la versione più recente del file dal repo (non dal deploy corrente),
// così un salvataggio non sovrascrive le modifiche committate dopo il deploy.
export async function readTeamsFromGithub(): Promise<RemoteFile> {
  const { repo, branch } = repoConfig();
  const res = await githubRequest(
    `/repos/${repo}/contents/${FILE_PATH}?ref=${branch}`
  );
  if (!res.ok) {
    throw new Error(`Lettura da GitHub fallita (${res.status})`);
  }
  const body = (await res.json()) as { content: string; sha: string };
  const teams = JSON.parse(
    Buffer.from(body.content, "base64").toString("utf-8")
  ) as Team[];
  return { teams, sha: body.sha };
}

export async function commitTeamsToGithub(
  teams: Team[],
  sha: string,
  message: string
): Promise<void> {
  const { repo, branch } = repoConfig();
  const content = Buffer.from(
    JSON.stringify(teams, null, 2) + "\n",
    "utf-8"
  ).toString("base64");
  const res = await githubRequest(`/repos/${repo}/contents/${FILE_PATH}`, {
    method: "PUT",
    body: JSON.stringify({ message, content, sha, branch }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Commit su GitHub fallito (${res.status}): ${detail}`);
  }
}
