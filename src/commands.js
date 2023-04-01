import { exec } from "child_process";
import chalk from "chalk";
import { logExec } from "./helper.js";

export async function getStaggedFiles() {
  return exec("git diff --cached --name-only", (err, stdout, stderr) => {
    if (err) {
      logExec(err);
      return;
    }
    if (stderr) {
      logExec(stderr);
      return;
    }

    if (stdout.length <= 0) {
      console.log(chalk.bgRed("⛔️ Whops! No files available to commit."));
      console.log(
        "💡 Make sure to use " +
          chalk.bgWhite("git add") +
          " before trying to commit."
      );
      return;
    }
  });
}

export function commitFiles(message) {
  exec(`git commit -m "${message}"`, (err, stdout, stderr) => {
    if (err) {
      logExec(err);
      return;
    }
    if (stderr) {
      logExec(stderr);
      return;
    }
    console.log(stdout);
  });
}
