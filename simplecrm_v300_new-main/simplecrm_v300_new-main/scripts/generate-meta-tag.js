import util from "node:util";
import dotenv from "dotenv";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import path from "path";
import os from "os";
import packageJson from "../package.json" assert { type: "json" };
import childProcessExec from "node:child_process";
import { networkInterfaces } from "os";

dotenv?.config();

async function getNetworkDetails() {
  const interfaces = networkInterfaces();
  const details = {
    mac_address: "Not Available",
    ip_address: "Not Available",
  };

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        details.mac_address = iface.mac;
        details.ip_address = iface.address;
        break;
      }
    }
    if (details.mac_address && details.ip_address) break;
  }

  return details;
}

async function getGitDetails(exec) {
  const gitDetails = {
    branch: "Not Available",
    shortHash: "Not Available",
    lastCommitMessage: "Not Available",
    author: "Not Available",
    email: "Not Available",
    timestamp: "Not Available",
    orgName: "Not Available",
    repoName: "Not Available",
    repoUrl: "Not Available",
    totalCommits: "Not Available",
    defaultBranch: "Not Available",
    hasUncommittedChanges: false,
    hasUnpushedCommits: false,
  };

  try {
    await exec("git rev-parse --is-inside-work-tree");
    gitDetails.branch = (
      await exec("git rev-parse --abbrev-ref HEAD")
    ).stdout.trim();
    gitDetails.shortHash = (
      await exec("git rev-parse --short HEAD")
    ).stdout.trim();
    gitDetails.lastCommitMessage = (
      await exec("git log -1 --pretty=%B")
    ).stdout.trim();
    gitDetails.author = (await exec("git log -1 --pretty=%an")).stdout.trim();
    gitDetails.email = (await exec("git log -1 --pretty=%ae")).stdout.trim();
    gitDetails.timestamp = (
      await exec("git log -1 --pretty=%ci")
    ).stdout.trim();

    // Get the remote URL
    const remoteUrl = (
      await exec("git config --get remote.origin.url")
    ).stdout.trim();

    gitDetails.repoUrl = remoteUrl;

    // Parse the remote URL to get org and repo names
    let match;
    if (remoteUrl.startsWith("git@")) {
      // SSH URL format: git@github.com:orgname/reponame.git
      match = remoteUrl.match(/^git@[^:]+:([^\/]+)\/(.+?)(\.git)?$/);
    } else if (
      remoteUrl.startsWith("https://") ||
      remoteUrl.startsWith("http://")
    ) {
      // HTTPS URL format: https://github.com/orgname/reponame.git
      match = remoteUrl.match(/^https?:\/\/[^\/]+\/([^\/]+)\/(.+?)(\.git)?$/);
    }

    if (match) {
      gitDetails.orgName = match[1];
      gitDetails.repoName = match[2];
    }

    // Get the total number of commits
    gitDetails.totalCommits = (
      await exec("git rev-list --count HEAD")
    ).stdout.trim();

    // Get the default branch
    gitDetails.defaultBranch = (
      await exec(
        "git remote show origin | grep 'HEAD branch' | awk '{print $NF}'",
      )
    ).stdout.trim();

    // Check for uncommitted changes
    const { stdout: statusStdout } = await exec("git status --porcelain");
    gitDetails.hasUncommittedChanges = statusStdout.trim().length > 0;

    // Check for unpushed commits
    try {
      // Fetch updates from remote to ensure accurate status
      await exec("git fetch");

      // Compare local and remote branches
      const { stdout: pushStatus } = await exec(
        `git rev-list --left-right --count ${gitDetails.defaultBranch}...origin/${gitDetails.defaultBranch}`,
      );
      const [ahead, behind] = pushStatus.trim().split("\t").map(Number);

      gitDetails.hasUnpushedCommits = ahead > 0;
    } catch (pushErr) {
      console.warn("Could not determine push status:", pushErr.message);
    }
  } catch (err) {
    console.warn("Git details could not be retrieved:", err.message);
  }

  return gitDetails;
}
async function writeMetaFile(metaJson, data) {
  try {
    await mkdir(path.dirname(metaJson), { recursive: true });
    const jsonContent = JSON.stringify(data, null, 2);
    await writeFile(metaJson, jsonContent, "utf8");
    console.log("meta.json written successfully.");
  } catch (err) {
    console.error("Error writing meta.json:", err.message);
  }
}

async function main() {
  const exec = util.promisify(childProcessExec.exec);
  const metaJson = path.resolve(process.cwd(), "public", "meta.json");

  const appVersion = packageJson.version;
  const currentDateTine = new Date().toISOString();

  const jsonData = {
    version: appVersion,
    buildDateTime: currentDateTine,
    app_name: packageJson.name,
    description: packageJson.description,
    author: packageJson.author,
    node_env: process?.env?.NODE_ENV || "Not Defined",
    activeV267URL: process?.env?.REACT_APP_BASE_URL || "Not Defined",
  };

  try {
    const gitDetails = await getGitDetails(exec);
    Object.assign(jsonData, gitDetails);

    jsonData["build_machine"] = {
      os: os.platform(),
      os_version: os.release(),
      cpu_arch: os.arch(),
      user: os.userInfo().username,
    };

    const networkDetails = await getNetworkDetails();
    jsonData["network"] = networkDetails;

    // jsonData["localization"] = {
    //   default_language: "en-US",
    //   supported_languages: ["en-US", "es-ES", "fr-FR"],
    // };

    await writeMetaFile(metaJson, jsonData);
  } catch (err) {
    console.error("Error generating metadata:", err.message);
  }
}

main();
