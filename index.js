const { readdirSync } = require("fs");
const term = require("terminal-kit").terminal;
const fs = require("fs");
const path = require("path");

const cli = require("commander");
const checkgit = new cli.Command();
let choice = process.argv[3];

if (!choice) {
  console.log("");
  console.log("How to use checkgit:");
  console.log("");
  console.log("  $ checkgit --help");
  console.log("  $ checkgit -h");
  console.log("  $ checkgit -g E:");
  console.log("  $ checkgit -nogit E:");
  process.exit();
} else {
  !choice.includes(":\\") ? (choice = choice.split(":")[0] + ":\\") : choice;
}

function helper() {
  checkgit
    .version("1.0.0")
    .option("-g, --git", "check for git directories")
    .option("-ng, --nogit", "check for non git directories")
    .parse(process.argv);
  checkgit.on("--help", function() {
    console.log("How to use checkgit:");
    console.log("  $ checkgit --help");
    console.log("  $ checkgit -h");
    console.log("  $ checkgit -g");
  });
}
/**
 * @param {String} dir
 * @param {Function} done
 */
function checkGit(dir, done) {
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

process.argv.slice(2).forEach(function(cmd) {
  if (cmd === "-g" || cmd === "--git") {
    checkGit(choice, async function(err, data) {
      if (data.length > 0) {
        term.magenta("Checking for git directories...");
        if (err) {
          throw err;
        }
        term.gridMenu(data, function(error, response) {
          term("\n").eraseLineAfter.green(response.selectedText);
          process.exit();
        });
      } else {
        term.red(`no git dirs found under ${choice}`);
      }
    });
  }
});
