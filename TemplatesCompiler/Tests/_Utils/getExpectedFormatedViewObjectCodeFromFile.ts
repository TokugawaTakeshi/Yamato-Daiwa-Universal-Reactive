import Path from "path";
import FileSystem from "fs";


export default function getExpectedFormatedViewObjectCodeFromFile(targetFilePath: string): string {

  return FileSystem.

      readFileSync(
        Path.join(process.cwd(), "Tests", targetFilePath),
        "utf-8"
      ).

      replaceAll("\r", "");

}
