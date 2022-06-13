#!/usr/bin/env node

/// ******************************************
/// Copyright (c) 2022-present, Webic, @KareemAbo3id
/// ******************************************
///
/// This source code is licensed under the MIT license found in the
/// LICENSE file in the root directory.
/// ******************************************

'use strict';

import * as fs from 'fs';
import os from 'os';
import cp from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const CURR_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));
const currentNodeVer = cp.execSync('node -v').toString();
const major = currentNodeVer.split('.')[0];
const _ = os.platform() === 'win32' || os.platform() === 'win64' ? '\\' : '/';
const printErr = err => console.log(chalk.red('\n! ' + chalk.bold(err)));

// command runner:
const run = command => {
  try {
    cp.execSync(command, { stdio: ['ignore', 'inherit', 'inherit'] });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e.message);
    return false;
  }
  return true;
};

// check the current node version:
if (major < 18) {
  printErr(`You are running Node ${currentNodeVer}`);
  printErr(`Webic App requires Node 18 or higher`);
  printErr(`Please update your version of Node`);
  process.exit(1);
}

// get the template name and description:
const QUESTIONS = [
  {
    name: 'app-name',
    type: 'input',
    message: 'App name:',
    validate: function (input) {
      // check if input includes space, uppercase letter, or special character:
      if (
        /\s/g.test(input) ||
        /[A-Z]/g.test(input) ||
        /[!$%^&*()+|~=`{}\\[\]:";'<>?,\\/]/g.test(input)
      ) {
        return console.log(
          chalk.red(
            '\n! ' +
              chalk.bold(
                'App name cannot include space, uppercase, or special chars, please try again.'
              )
          )
        );
      } else if (input.length < 1) {
        return console.log(
          chalk.red('\n! ' + chalk.bold('App name cannot be empty, please try again.'))
        );
      } else return true;
    },
  },
  {
    name: 'app-description',
    type: 'input',
    message: 'App description:',
    default: 'my awesome app',
  },
];

// Create a new project:
inquirer.prompt(QUESTIONS).then(answers => {
  const appName = answers['app-name'];
  const appDescription = answers['app-description'];
  const webicApp = `${__dirname}${_}packages${_}webic-app`;
  const webicPackage = `${CURR_DIR}${_}${appName}${_}package.json`;
  const webicManifest = `${CURR_DIR}${_}${appName}${_}app${_}manifest.json`;
  const webicReadme = `${CURR_DIR}${_}${appName}${_}README.md`;
  const COMMANDS = {
    installDeps: `cd ${CURR_DIR}${_}${appName} && npm install`,
    initGit: `cd ${CURR_DIR}${_}${appName} && git init -b master && git add .`,
    disableCRLF: `cd ${CURR_DIR}${_}${appName} && git config --global core.safecrlf false`,
  };

  // 1. log inital message:
  console.log();
  console.log('Creating a new Webic app in ' + chalk.yellow(`${CURR_DIR}${_}${appName}`));

  // 2. create new app directory:
  if (fs.existsSync(`${CURR_DIR}${_}${appName}`)) {
    console.log(
      chalk.red(
        '\n! ' +
          chalk.bold(`The directory ${CURR_DIR}${_}${appName} already exists, please try again.\n`)
      )
    );
    process.exit(1);
  } else {
    fs.mkdirSync(`${CURR_DIR}${_}${appName}`);
  }

  // 3. initialize new app:
  initApp(webicApp, appName);

  // 4. update name & description of new app based on the answers:
  console.log('Setting your app files and configrations...');
  const packageJSON = JSON.parse(fs.readFileSync(webicPackage, 'utf8'));
  const manifestJSON = JSON.parse(fs.readFileSync(webicManifest, 'utf8'));
  const readmeMD = fs.readFileSync(webicReadme, 'utf8');
  const readme = readmeMD
    .replace(/# webic-app/g, `# ${appName}`)
    .replace(/webic-description/g, appDescription);
  packageJSON.name = appName;
  manifestJSON.name = appName;
  packageJSON.description = appDescription;
  manifestJSON.description = appDescription;
  fs.writeFileSync(webicPackage, JSON.stringify(packageJSON, null, 2), 'utf8');
  fs.writeFileSync(webicManifest, JSON.stringify(manifestJSON, null, 2), 'utf8');
  fs.writeFileSync(webicReadme, readme, 'utf8');

  // 5. install dependencies:
  console.log();
  console.log('Installing packages. This might take a couple of minutes...');
  const installedDeps = run(COMMANDS.installDeps);
  if (!installedDeps) {
    console.error(chalk.red('\n! ' + chalk.bold('Failed to install the dependencies.')));
    process.exit(-1);
  }
  console.log();
  console.log(chalk.green('Success!') + ' All packages installed.');

  // 6. initalize git repo:
  console.log();
  const initializedGit = run(COMMANDS.initGit);
  const gitConfig = run(COMMANDS.disableCRLF);
  if ((!initializedGit, !gitConfig)) {
    console.error(chalk.red('\n! ' + chalk.bold('Failed to initialize git repo.')));
    process.exit(-1);
  }
  console.log(chalk.green('Success!') + ' Git Initialized, branch name: ' + chalk.cyan('(master)'));

  // 7. log instructions message:
  console.log();
  console.log(
    chalk.green('Success!') +
      ' Created ' +
      chalk.yellow.bold(appName) +
      ' in: ' +
      chalk.yellow(`${CURR_DIR}${_}${appName}`)
  );
  console.log();
  console.log('Inside your app directory, you can run the following commands:');
  console.log();
  console.log(chalk.cyan('npm start'));
  console.log('   Starts the development server.');
  console.log();
  console.log(chalk.cyan('npm run build'));
  console.log('   Optmizes and bundles the app for production.');
  console.log();
  console.log(chalk.cyan('npm run clean:dev'));
  console.log('   Removes the development environment.');
  console.log();
  console.log(chalk.cyan('npm run clean:build'));
  console.log('   Removes the production build.');
  console.log();
  console.log(`Get started by editing ${chalk.yellow(appName + '/app')} by running:`);
  console.log(chalk.cyan('   cd ') + `${appName}`);
  console.log(chalk.cyan('   npm start'));
  console.log();
  console.log(`Lo-Fi Radio: ${chalk.yellow('https://www.lofi.cafe/')}`);
  console.log();
  console.log("Let's build stuff!");
});

// init the app:
function initApp(webicApp, newApp) {
  const filesToCreate = fs.readdirSync(webicApp);

  filesToCreate.forEach(file => {
    const orginalFilePath = `${webicApp}${_}${file}`;
    const orginalFileStats = fs.statSync(orginalFilePath);
    // if gitignore file, rename it:
    if (file === 'gitignore') file = '.gitignore';
    // if it's a file, read it, and write it back to the new dir:
    if (orginalFileStats.isFile()) {
      const orginalFileContents = fs.readFileSync(orginalFilePath, 'utf8');
      // write the new file in the new dir:
      const newFilePath = `${CURR_DIR}${_}${newApp}${_}${file}`;
      // get the new file contents:
      if (
        file.endsWith('.png' || '.jpg' || '.jpeg' || '.gif' || '.svg' || '.webp' || '.bmp') ||
        file === 'favicon.ico'
      ) {
        fs.copyFileSync(orginalFilePath, newFilePath);
      } else fs.writeFileSync(newFilePath, orginalFileContents, 'utf8');
      // if it's a directory, create it in the new dir:
    } else if (orginalFileStats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}${_}${newApp}${_}${file}`);
      // call recursively:
      initApp(`${webicApp}${_}${file}`, `${newApp}${_}${file}`);
    }
    // else, log an error:
    else console.log(`Error: ${orginalFilePath} is not a file or directory.`);
  });
}
