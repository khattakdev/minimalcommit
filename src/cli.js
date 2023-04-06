import inquirer from "inquirer";
import chalk from "chalk";

import {
  commitFiles,
  getStagedFiles,
  checkIfRepoisGit,
  getUnstagedFiles,
  stageFiles,
} from "./commands.js";

function logOption(title, description) {
  return chalk.bgWhite(title) + " - " + description;
}

async function cli() {
  const [isGit, stagedFiles] = await Promise.all([
    checkIfRepoisGit(),
    getStagedFiles(),
  ]);
  if (isGit && !stagedFiles) {
    await promptToCommit();
  } else if (isGit && stagedFiles) {
    await addCommit();
  }
}

const promptToCommit = async () => {
  const files = await getUnstagedFiles();
  const styledList = files
    .trim()
    .split("\n")
    .map((file) => {
      /*
      Possible States

      ??: Untracked
      A: Added
      M: Modified
      D: Deleted
      R: Renamed
      C: Copied
      U: Updated but unmerged
      !: Git doesn't know about the file or folder (it's not in the repository)
      */
      const fileName = file.trim();
      if (fileName.startsWith("??")) return fileName.replace("??", "🆕");
      if (fileName.startsWith("A")) return fileName.replace("A", "📝");
      if (fileName.startsWith("M")) return fileName.replace("M", "🔄️");
      if (fileName.startsWith("D")) return fileName.replace("D", "🗑️");
      if (fileName.startsWith("R")) return fileName.replace("R", "🔄️");
      if (fileName.startsWith("C")) return fileName.replace("C", "📝");
      if (fileName.startsWith("U")) return fileName.replace("U", "⚠️");
      if (fileName.startsWith("!")) return fileName.replace("!", "❓");
      return fileName;
    });
  return await inquirer
    .prompt([
      {
        name: "list",
        message:
          "Select the files you want to add with, and use (CTRL + D to exit)",
        type: "checkbox",
        choices: styledList,
      },
    ])
    .then((answer) => {
      if (answer.list.length < 1) {
        console.log(chalk.bgRed("⛔️ Oops, You forgot to select files"));
        process.exit(0);
      }
      const filesToStage = answer.list.map((f) => {
        if (f.startsWith("🆕")) return f.replace("🆕", "").trim();
        if (f.startsWith("📝")) return f.replace("📝", "").trim();
        if (f.startsWith("🔄️")) return f.replace("🔄️", "").trim();
        if (f.startsWith("🗑️")) return f.replace("🗑️", "").trim();
        if (f.startsWith("🔄️")) return f.replace("🔄️", "").trim();
        if (f.startsWith("📝")) return f.replace("📝", "").trim();
        if (f.startsWith("⚠️")) return f.replace("⚠️", "").trim();
        if (f.startsWith("❓")) return f.replace("❓", "").trim();
      });
      stageFiles(filesToStage.join(" "));
    })
    .then(() => {
      console.log(chalk.bgGreenBright("✅ Files Added"));
      addCommit();
    })
    .catch((err) => {
      console.log(
        chalk.bgRed("⛔️ Oops, that was not supposed to happen") +
          chalk.bgGrey("If that happens again, please raise an issue")
      );
      process.exit(0);
    });
};

const addCommit = async () => {
  return await inquirer
    .prompt([
      {
        name: "type",
        message: "Howdy 👋, What type of changes have you made?",
        type: "list",
        choices: [
          "✨ feat",
          "🐛 fix",
          "💥 break",
          "♻️ ref",
          "🔖 ver",
          "📝 docs",
          "🎨 style",
          "🛠 config",
          "📦 misc",
        ],
      },
      {
        name: "message",
        message: "Write a commit message ✍️  : ",
        type: "input",
      },
    ])
    .then((answer) => {
      const message = `${answer.type}: ${answer.message}`;
      console.log("\n");

      if (answer.message == "") {
        console.log(chalk.bgRed("⛔️ Message can't be empty"));
        process.exit(0);
      } else if (!answer.message.includes(" ")) {
        console.log(chalk.bgRed("⛔️ Message is too short"));
        process.exit(0);
      }

      commitFiles(message);
    });
};

export default cli;
