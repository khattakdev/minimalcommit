# Minimal Commit

> _A minimalist approach toward `git commit` to keep commits simple._

## What is Minimal Commit?

Minimal commit is a Node.js based CLI (command line interface) tool that helps you and your team mates to stay consistent with the `git commit` messages. To commit files using **Minimal Commit**, you have a list of options to choose from, this list consist type of work you did. This makes things simple and less confusing by choosing an option from a list.

The list of options is limited to only **nine types**. This is done on purpose to keep the list as short as possible to avoid confusion. The more options you have, the more confusing it will be.

## Types
Following are the nine types of commits.
- `✨ feat` to be used for a new feature
- `🐛 fix` to be used for bug fixes
- `💥 break` to be used for breaking changes
- `♻️ ref` to be used for making code/folder refactor
- `🔖 ver` to be used for version changes
- `📝 docs` to be used for documentation
- `🎨 style` to be used for CSS changes
- `🛠 config` for configuration, and dependencies changes
- `📦 misc` to be used for others

## Installation

To install **Minimal Commit**, you can use the following command.

```
npm install -g minimalcommit
```

## Why Minimal Commit?

- Straight Forward
- Easy to read
- Visually appealing

## Usage
```
msc
```
![Minimal commit demo](https://user-images.githubusercontent.com/37709578/229308874-07cf3642-a270-4ec4-a003-d3c1fcdffd5f.gif)


## How to write commits?

Here’s the general syntax of Minimal Commit.

```
<type>: <message>
```

> ⚠️ All of the commits must be written in the present tense.
> Following are some examples:

```
✨ feat: added sign-up feature ❌
✨ feat: add sign up feature ✅

🛠 config: removed extra extension files ❌
🛠 config: remove extra extension files ✅
```

The commit title should be precise, and to the point but at the same time, it shouldn't be vague. All of the extra details should go in the description (_⚠️ Descriptions are not supported yet_.)

```
✨ feat: add new feature ❌
✨ feat: add sign up feature with forgot password and auth with Google ❌
✨ feat: add sign up feature using OAuth ✅
✨ feat: add sign up feature ✅
```

Following are some more examples:

```
🛠 config: add .gitignore file
♻️ ref: move functions to helper.js
📦 misc: add initial test cases
📦 docs: update docs with v2.0 features
```

### Examples

- You added `.yaml` file for GitHub Actions

`✨ config: add .yaml file for github actions`

- You added some tests cases for the user interface

`📦 misc: add test cases for ui`

- You moved some part of the code to components folder

`♻️ ref: move pages code into components`

- You updated the code that caused some breaking changes

`💥break: update sign-up api endpoints`

- You made some changes to the user interface

`🎨 ui: update the auto pages`

## Support

If you like the work, please give this repo a ⭐️ and feel free to contribute to this project through issues, and pull requests.
