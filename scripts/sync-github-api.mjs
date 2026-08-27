import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const project = "/home/ubuntu/recanto-das-plantas-site";
const owner = "julliosan765";
const repo = "recanto-das-plantas-demo";
const branch = "main";
const token = process.env.GH_TOKEN;

if (!token) throw new Error("A autenticação GitHub não está disponível.");

async function api(path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers ?? {}),
    },
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`${options.method ?? "GET"} ${path}: ${response.status} ${body}`);
  return body ? JSON.parse(body) : undefined;
}

async function gitText(args) {
  const { stdout } = await execFileAsync("git", ["-C", project, ...args], { maxBuffer: 20 * 1024 * 1024 });
  return stdout.trim();
}

async function gitBuffer(args) {
  return new Promise((resolve, reject) => {
    execFile("git", ["-C", project, ...args], { encoding: "buffer", maxBuffer: 20 * 1024 * 1024 }, (error, stdout) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });
}

async function main() {
  const head = await gitText(["rev-parse", "HEAD"]);
  const branchRef = await api(`/repos/${owner}/${repo}/git/ref/heads/${branch}`).catch((error) => {
    if (error.message.includes("404") || error.message.includes("409")) return null;
    throw error;
  });
  const filePaths = (await gitText(["ls-tree", "-r", "--name-only", head])).split("\n").filter(Boolean);
  const tree = [];

  for (const path of filePaths) {
    const content = await gitBuffer(["show", `${head}:${path}`]);
    const blob = await api(`/repos/${owner}/${repo}/git/blobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.toString("base64"), encoding: "base64" }),
    });
    tree.push({ path, mode: "100644", type: "blob", sha: blob.sha });
  }

  const baseTree = branchRef ? await api(`/repos/${owner}/${repo}/git/commits/${branchRef.object.sha}`) : null;
  const newTree = await api(`/repos/${owner}/${repo}/git/trees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base_tree: baseTree?.tree?.sha, tree }),
  });
  const commit = await api(`/repos/${owner}/${repo}/git/commits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Publica versão validada da Recanto das Plantas", tree: newTree.sha, parents: branchRef ? [branchRef.object.sha] : [] }),
  });

  if (branchRef) {
    await api(`/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sha: commit.sha, force: false }),
    });
  } else {
    await api(`/repos/${owner}/${repo}/git/refs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.sha }),
    });
  }

  console.log(JSON.stringify({ repository: `${owner}/${repo}`, branch, commit: commit.sha, files: filePaths.length }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
