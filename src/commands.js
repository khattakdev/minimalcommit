import { exec } from "child_process";
import chalk from "chalk";
import { logExec } from "./helper.js";

export function checkIfRepoisGit() {
  return new Promise((resolve, reject) => {
    exec("git rev-parse --is-inside-work-tree", (err, stdout, stderr) => {
      if (stdout == "true\n")
        resolve(stdout);
      if (stderr.includes("not a git repository")) {
        console.log("\n\n");
        console.log(chalk.bgRed("⛔️ Whops! The directory is not a git repository."));
        console.log(
          "💡 Git repo not initialized. Run " +
          chalk.bgWhite("git init")
        );
        reject(stderr);
        process.exit(0);
      }
      if (err) {
        logExec(err);
        reject(err);
        process.exit(0);
      }
      if (stderr) {
        logExec(stderr);
        reject(stderr);
        process.exit(0);
      }
    });
  });
}

export async function getStagedFiles() {
  return new Promise((resolve, reject) => {
    exec("git diff --cached --name-only", (err, stdout, stderr) => {
      if (err) {
        logExec(err);
        reject(err);
      }
      if (stderr) {
        logExec(stderr);
        reject(stderr);
      }

      if (stdout.length <= 0) {
        console.log(chalk.bgRed("⛔️ Whops! No files available to commit."));
        console.log(
          "💡 Make sure to use " +
            chalk.bgWhite("git add") +
            " before trying to commit."
        );
        resolve(null);
      } else {
        resolve(stdout);
      }
    });
  });
}

export function commitFiles(message) {
  exec(`git commit -m "${message}"`, (err, stdout, stderr) => {
    if (err) {
      logExec(err);
      process.exit(0);
    }
    if (stderr) {
      logExec(stderr);
      process.exit(0);
    }
    console.log(stdout);
  });
}
