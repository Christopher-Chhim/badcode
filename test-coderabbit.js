/**
 * test-coderabbit.js
 * Usage: node test-coderabbit.js
 *
 * Modes:
 * - direct: posts { repo_url, pr_number } to CodeRabbit endpoint
 * - proxy: fetches PR details from GitHub and sends a body { repo, pr, diff, files } to CodeRabbit
 *
 * Configure via .env
 */

import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const CODE_RABBIT_API_KEY = process.env.CODERABBIT_API_KEY;
const CODE_RABBIT_API_URL = process.env.CODERABBIT_API_URL || "https://api.coderabbit.ai/v1/review";
const REPO_URL = process.env.REPO_URL;          // e.g. https://github.com/your-org/repo.git
const PR_NUMBER = process.env.PR_NUMBER;        // optional
const MODE = (process.env.MODE || "direct");    // "direct" or "proxy"
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;  // required for proxy mode to fetch diff

if (!CODE_RABBIT_API_KEY) {
  console.error("Missing CODERABBIT_API_KEY in .env");
  process.exit(1);
}

async function callCodeRabbit(payload) {
  try {
    const resp = await axios.post(CODE_RABBIT_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${CODE_RABBIT_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 2 * 60 * 1000,
    });
    return resp.data;
  } catch (err) {
    console.error("Error calling CodeRabbit API:", err.response?.status, err.response?.data || err.message);
    throw err;
  }
}

async function fetchPrFromGitHub(repoFullName, prNumber) {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN required for proxy mode");

  const [owner, repo] = repoFullName.split("/");
  const headers = { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" };

  // fetch PR metadata
  const prResp = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, { headers });
  const pr = prResp.data;

  // fetch files (list of changed files)
  const filesResp = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`, { headers });
  const files = filesResp.data; // array with filename, patch, etc.

  // optionally fetch unified diff
  const diffResp = await axios.get(`https://patch-diff.githubusercontent.com/raw/${owner}/${repo}/pull/${prNumber}.diff`, { headers });
  const diff = diffResp.data;

  return { pr, files, diff };
}

function prettyPrintResponse(rr) {
  console.log("=== CodeRabbit Response (top-level) ===");
  console.log(Object.keys(rr).join(", "));
  console.log();

  // Try to print common expected fields gracefully:
  if (rr.summary) {
    console.log("Summary:\n", rr.summary, "\n");
  }
  if (rr.overall_risk) {
    console.log("Overall risk:", rr.overall_risk, "\n");
  }
  if (rr.concerns && rr.concerns.length) {
    console.log("Concerns:");
    rr.concerns.forEach((c, i) => {
      console.log(`${i + 1}. ${c.title || c.summary || "Concern"}`);
      if (c.severity) console.log("   Severity:", c.severity);
      if (c.explanation) console.log("   Explanation:", c.explanation);
      if (c.evidence) {
        console.log("   Evidence:", c.evidence.file || c.evidence);
      }
      if (c.remediation) console.log("   Remediation:", Array.isArray(c.remediation) ? c.remediation.join(" | ") : c.remediation);
      console.log();
    });
  } else if (rr.suggestions && rr.suggestions.length) {
    console.log("Suggestions:");
    rr.suggestions.forEach((s, i) => console.log(`${i + 1}. ${s}`));
    console.log();
  } else {
    // fallback: print full JSON (trimmed)
    console.log("Full response (truncated):\n", JSON.stringify(rr, null, 2).slice(0, 4000));
  }
}

async function main() {
  if (!REPO_URL) {
    console.error("Set REPO_URL in .env to your test repo HTTPS clone URL (e.g. https://github.com/you/repo.git)");
    process.exit(1);
  }

  if (MODE === "direct") {
    const payload = { repo_url: REPO_URL };
    if (PR_NUMBER) payload.pr_number = Number(PR_NUMBER);

    console.log("Calling CodeRabbit (direct) with payload:", payload);
    const rr = await callCodeRabbit(payload);
    prettyPrintResponse(rr);
    return;
  }

  if (MODE === "proxy") {
    if (!PR_NUMBER) {
      console.error("Proxy mode requires PR_NUMBER in .env");
      process.exit(1);
    }

    // Convert repo_url to owner/repo
    const m = REPO_URL.match(/github\.com[:/](.+?)\/(.+?)(?:\.git)?$/);
    if (!m) {
      console.error("Cannot parse REPO_URL; expected a GitHub URL like https://github.com/owner/repo.git");
      process.exit(1);
    }
    const owner = m[1], repo = m[2];
    const repoFull = `${owner}/${repo}`;

    console.log(`Fetching PR #${PR_NUMBER} from ${repoFull}...`);
    const { pr, files, diff } = await fetchPrFromGitHub(repoFull, PR_NUMBER);
    // Build a payload with PR metadata + diff + file patches
    const payload = {
      repo: repoFull,
      pr_number: Number(PR_NUMBER),
      pr_title: pr.title,
      pr_body: pr.body,
      diff,
      files: files.map(f => ({ filename: f.filename, patch: f.patch, status: f.status })),
    };

    console.log("Calling CodeRabbit (proxy) with PR diff payload (size:", (payload.diff || "").length, "chars)");
    const rr = await callCodeRabbit(payload);
    prettyPrintResponse(rr);
    return;
  }

  console.error("Unknown MODE. Set MODE=direct or MODE=proxy in .env");
  process.exit(1);
}

main().catch(err => {
  console.error("Fatal error:", err.message || err);
  process.exit(1);
});
