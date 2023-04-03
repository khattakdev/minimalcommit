import inquirer from "inquirer";
import chalk from "chalk";

import { commitFiles, getStagedFiles } from "./commands.js";

function logOption(title, description) {
  return chalk.bgWhite(title) + " - " + description;
}

async function cli() {
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

      getStagedFiles();
      commitFiles(message);
    });
}

export default cli;
