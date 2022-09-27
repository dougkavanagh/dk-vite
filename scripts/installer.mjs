// https://answers.netlify.com/t/how-to-include-dependencies-in-netlify-lambda-functions/2323/6
import { join } from "path";
import { globby } from "globby";
import { exec } from "child_process";

function installDeps(functionDir, cb) {
  exec("npm i", { cwd: functionDir }, cb);
}

(async () => {
  const findJSFiles = ["*/package.json", "!node_modules", "!**/node_modules"];
  const subDirName = "services";
  const __dirname = "src/" + subDirName;
  const directory = join(__dirname, "..", subDirName);
  const foldersWithDeps = await globby(findJSFiles, { cwd: directory });

  const folders = foldersWithDeps
    .map((fnFolder) => {
      return fnFolder.substring(0, fnFolder.indexOf("package.json"));
    })
    .map((folder) => {
      installDeps(join(__dirname, "..", subDirName, folder), () => {
        console.log(`${folder} dependencies installed`);
      });
    });
})();
