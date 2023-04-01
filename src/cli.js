import { exec } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";

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
          "🔥 remove",
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

      exec(`git commit -m "${message}"`, (err, stdout, stderr) => {
        if (err) {
          console.log("Something went wrong. Try again!");
          console.log(err);
          return;
        }
        if (stderr) {
          console.log(stderr);
          return;
        }
        console.log(stdout);
      });
    });
}

export default cli;
