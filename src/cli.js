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
  //if there's help argument passed, show the info info and exit
  if (process.argv[2] === "--help" || process.argv[2] === "-h") {
    const options = [
      { name: "--help , -h", desc: "Show help", type: "boolean" },
      { name: "--version, -v", desc: "Show version number", type: "boolean" },
      { name: "--types, -t", desc: "Show commit types", type: "boolean" },
    ];
    console.log("Command\t\tDescription\t\tType");
    console.log("-------\t\t-----------\t\t----");
    options.forEach((option) => {
      const { name, desc, type } = option;
      console.log(`${name.padEnd(16)}${desc.padEnd(24)}${type}`);
    });
    console.log("\n");
    process.exit(0);
  }

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
  if (files.trim().length === 0) {
    console.log(chalk.bgRed("⛔️ Whops! You haven't made any changes."));
    process.exit(0);
  }
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
  if (styledList.length < 1) {
    console.log(chalk.bgRed("No changes made since last commit!"));
  }
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
          "🧪 test",
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
      // it includes the prefix as well
      console.log(message, message.length);
      if (message.length > 72) {
        console.log(
          chalk.bgRed("⛔️ Message is too long") +
            "\n" +
            chalk.bgYellow("⚠️ Please keep the message below 72 characters")
        );
        process.exit(0);
      }

      commitFiles(message);
    });
  if (message.argv[2] === "--help" || message.argv[2] === "-h") {
    console.log("Command\t\t\tDescription\t\tType");
    console.log("-------\t\t\t-----------\t\t----");
    console.log("--help, -h\t\tShow help\t\tBoolean");
    console.log("--version, -v\t\tShow version number\tBoolean");
    console.log("--types, -t\t\tShow commit types\tBoolean");
    console.log("\n");
    process.exit(0);
  }
};

export default cli;
