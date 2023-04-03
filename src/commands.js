import { exec } from "child_process";
import chalk from "chalk";
import { logExec } from "./helper.js";

export function checkIfRepoisGit() {
  return new Promise((resolve) => {
    exec("git rev-parse --is-inside-work-tree", (err, stdout, stderr) => {
      if (err || stderr || stdout != 'true\n') {
        console.log("\n\n");
        console.log(chalk.bgRed("⛔️ Whops! The directory is not a git repository."));
        console.log(
          "💡 Git repo not initialized. Run " +
          chalk.bgWhite("git init")
        );
        process.exit(0);
      }
      resolve();
    });
  });
}

export async function getStaggedFiles() {
  return exec("git diff --cached --name-only", (err, stdout, stderr) => {
    if (err) {
      logExec(err);
      process.exit(0);
    }
    if (stderr) {
      logExec(stderr);
      process.exit(0);
    }

    if (stdout.length <= 0) {
      console.log(chalk.bgRed("⛔️ Whops! No files available to commit."));
      console.log(
        "💡 Make sure to use " +
        chalk.bgWhite("git add") +
        " before trying to commit."
      );
      process.exit(0);
    }
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
