const fs = require("fs");
const exec = require("child_process").exec;

// check if data dir exists
const dataDir = "../data";
try {
  fs.accessSync(dataDir, fs.constants.F_OK);
  console.log(`${dataDir} exists`);
} catch (err) {
  console.log(`ERROR ${dataDir} does not exist`);
}

fs.readdir(`${dataDir}`, {}, (err, files) => {
  files.forEach(file => {
    // run pdf to text on that file
    const escapedFilename = file.replace(/(\s+)/g, "\\$1");
    const fileStem = escapedFilename.replace(".pdf", "");
    const outFile = `${fileStem}_300dpi.jpg`;
    const command = `sh pdf-to-jpg-first-page.sh ${dataDir}/${escapedFilename} ${dataDir}/${outFile}`;
    const child = exec(command, (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });
  });
});
