#!/usr/bin/env node
const cli = require("commander");
const checkgit = new cli.Command();
function helper() {
  checkgit
    .version("1.0.0")
    .option("-g, --git", "check for git directories")
    .parse(process.argv);
  checkgit.on("--help", function() {
    console.log("How to use checkgit:");
    console.log("  $ checkgit --help");
    console.log("  $ checkgit -h");
    console.log("  $ checkgit -g");
  });
}
module.exports = helper;
