const { readdirSync } = require("fs");
const term = require("terminal-kit").terminal;
const fs = require("fs");
const path = require("path");

term.magenta("Checking for git directories: ");
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

checkGit("../", async function(err, data) {
  if (err) {
    throw err;
  }
  term.gridMenu(data, function(error, response) {
    term("\n").eraseLineAfter.green(response.selectedText);
    process.exit();
  });
});
