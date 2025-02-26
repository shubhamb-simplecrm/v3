import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import process from "process";

// Parse command-line arguments
const [, , command, env = "dev"] = process.argv;

// Allowed commands
const VALID_COMMANDS = ["start", "build"];

// Validate the command
if (!VALID_COMMANDS.includes(command)) {
  console.error(
    `Invalid command: "${command}".\nAvailable commands:\n- "start": Run the application.\n- "build": Build the application.`,
  );
  process.exit(1);
}

// Load environment variables from .env-cmdrc
function loadEnvVars(targetEnv) {
  const configFilePath = path.join(process.cwd(), ".env-cmdrc");

  if (!fs.existsSync(configFilePath)) {
    console.error(`No .env-cmdrc file found at ${configFilePath}`);
    process.exit(1);
  }

  let config;
  try {
    config = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
  } catch (err) {
    console.error("Failed to parse .env-cmdrc as valid JSON.");
    console.error(err);
    process.exit(1);
  }

  const defaultVars = config.default || {};
  const envVars = config[targetEnv];

  if (!envVars) {
    console.warn(
      `No specific environment configuration found for "${targetEnv}". Using default variables only.`,
    );
  }

  // Apply default variables
  for (const key of Object.keys(defaultVars)) {
    process.env[key] = defaultVars[key];
  }

  // Apply environment-specific variables
  if (envVars) {
    for (const key of Object.keys(envVars)) {
      process.env[key] = envVars[key];
    }
  }

  console.log(`Environment variables loaded for environment: "${targetEnv}"`);
}

// Helper function to execute shell commands with inherited stdio
function executeCommand(cmd) {
  try {
    console.log(`Executing: ${cmd}`);
    execSync(cmd, { stdio: "inherit", env: process.env });
  } catch (error) {
    console.error(`Error executing: "${cmd}"`);
    console.error(`Details: ${error.message}`);
    process.exit(1);
  }
}

// Clear the build directory if it exists
function cleanDist() {
  const distPath = path.join(process.cwd(), "build");
  if (fs.existsSync(distPath)) {
    console.log(`Cleaning up build directory: ${distPath}`);
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log("Build directory cleaned.");
  } else {
    console.log("No build directory found. Skipping cleanup.");
  }
}

console.log(`Running command: "${command}" with environment: "${env}"`);

// Load environment variables before running any commands
loadEnvVars(env);

// Run the specified command
if (command === "start") {
  // Just run Vite now that env vars are loaded
  executeCommand("vite");
} else if (command === "build") {
  cleanDist();
  // Run generate-meta-tag script and then build
  executeCommand("npm run generate-meta-tag");
  executeCommand("vite build");
}

console.log(`Successfully completed "${command}" for environment: "${env}".`);
