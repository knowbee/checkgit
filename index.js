#!/usr/bin/env node

const { readdirSync } = require("fs");
const term = require("terminal-kit").terminal;
const fs = require("fs");
const path = require("path");
const helper = require("./lib/helper");
const ora = require("ora");
const color = require("chalk");
const spinner = ora("Looking for git repositories");
const os = require("check-os");

let choice = process.argv[3];
let command = process.argv[2];

if (!command) {
  console.log("");
  console.log("How to use checkgit:");
  console.log("");
  console.log("  $ checkgit --help");
  console.log("  $ checkgit -h");
  console.log("  $ checkgit -g E:");
  console.log("  $ checkgit -g ../");
  process.exit();
} else {
  helper();
}

/**
 * @param {String} dir
 * @param {Function} done
 */
function checkGit(dir, done) {
  spinner.start();
  let results = [];

  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory() && !file.includes("node_modules")) {
          readdirSync(file).find(f => {
            if (f === ".git" && !results.includes(file)) {
              results.push(file);
            }
          });
          checkGit(file, function(err, res) {
            if (res === ".git" && !results.includes(file)) {
              results = results.concat(res);
            }
            if (!--pending) done(null, results);
          });
        } else {
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

if (choice) {
  helper();
  if (os.isWindows) {
    (!choice.startsWith(".") && !choice.includes(":\\")) || choice.endsWith(":")
      ? (choice = choice.replace(/:/gi, "\\").replace("\\", ":\\"))
      : choice;
  } else {
    choice = choice;
  }
  process.argv.slice(2).forEach(function(cmd) {
    if (cmd === "-g" || cmd === "--git") {
      checkGit(choice, async function(err, data) {
        try {
          if (data.length > 0) {
            spinner.succeed("done");
            console.log("\n");
            console.log(
              `Found ${color.green(data.length)} git repos under ${color.yellow(
                choice
              )}`
            );
            spinner.stop();

            term.gridMenu(data, function(error, response) {
              term("\n").eraseLineAfter.green(response.selectedText);
              process.exit();
            });
          } else {
            term.red(`No git repositories found under ${choice}`);
          }
        } catch (error) {
          spinner.stop();
          term.red(`Invalid path`);
        }
      });
    }
  });
}
