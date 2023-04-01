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

      if (answer.message == "") {
        console.log(chalk.bgRed("⛔️ Message can't be empty"));
        return;
      } else if (!answer.message.includes(" ")) {
        console.log(chalk.bgRed("⛔️ Message is too short"));
        return;
      }

      exec("git diff --cached --name-only", (err, stdout, stderr) => {
        if (err) {
          console.log("\n\n");
          console.log(
            chalk.bgRed("⛔️ Whops! Something went wrong. Try again!")
          );
          console.log(err);
          return;
        }
        if (stderr) {
          console.log(stderr);
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
