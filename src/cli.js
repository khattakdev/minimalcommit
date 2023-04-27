import inquirer from "inquirer";
import chalk from "chalk";

import { commitFiles, getStagedFiles, checkIfRepoisGit } from "./commands.js";

function logOption(title, description) {
  return chalk.bgWhite(title) + " - " + description;
}

async function cli() {
  const res = (await checkIfRepoisGit()) && (await getStagedFiles());
  if (res) {
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
  }
}

if (process.argv[2] === "--help" || process.argv[2] === "-h") {
  console.log("Command\t\t\tDescription\t\tType");
  console.log("-------\t\t\t-----------\t\t----");
  console.log("--help, -h\t\tShow help\t\tBoolean");
  console.log("--version, -v\t\tShow version number\tBoolean");
  console.log("--types, -t\t\tShow commit types\tBoolean");
  console.log("\n");
  process.exit(0);
}
export default cli;
