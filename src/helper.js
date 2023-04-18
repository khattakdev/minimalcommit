import chalk from "chalk";

export function logExec (message) {
  console.log("\n\n");
  console.log(chalk.bgRed("⛔️ Whops! Something went wrong. Try again!"));
  console.log(message);
}
