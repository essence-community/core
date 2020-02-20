import * as fs from "fs"
import * as path from "path"
export function isEmpty(value: any, allowEmptyString: boolean = false) {
  return (
      value == null ||
      (allowEmptyString ? false : value === "") ||
      (Array.isArray(value) && value.length === 0)
  );
}
export const deleteFolderRecursive = (pathDir: string) => {
  if (fs.existsSync(pathDir)) {
      if (fs.lstatSync(pathDir).isDirectory()) {
          fs.readdirSync(pathDir).forEach((file) => {
              const curPath = path.join(pathDir, file);
              if (fs.lstatSync(curPath).isDirectory()) {
                  // recurse
                  deleteFolderRecursive(curPath);
              } else {
                  // delete file
                  fs.unlinkSync(curPath);
              }
          });
          fs.rmdirSync(pathDir);
          return;
      }
      fs.unlinkSync(pathDir);
  }
};