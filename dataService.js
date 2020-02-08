const fs = require("fs");
const users = require('./users.json');

exports.getEmail = (name) => users[name] || null;

exports.setEmail = (name, email) => {
  users[name] = email;

  writeFile();
}

let fileLocked = false;

function writeFile() {
  if (fileLocked) return;
  fileLocked = true;

  const json = JSON.stringify(users);
  fs.writeFile(usrFileName, json, "utf8", function(err) {
    if (err) throw err;
    fileLocked = false;
  });
}
