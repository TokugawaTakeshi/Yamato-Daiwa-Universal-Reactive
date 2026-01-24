import FileSystem from "fs";
import { getMatchingWithFirstRegularExpressionCapturingGroup } from "@yamato-daiwa/es-extensions";


export default function getRootComponentPathRelativeToEntryPoint(path: string): string {

  const entryPointSourceFileContent: string = FileSystem.readFileSync(path, "utf-8");

  /* [ Fiddle ] https://regex101.com/r/Ean5YT/2 */
  const rootComponentName: string =
      getMatchingWithFirstRegularExpressionCapturingGroup(
        entryPointSourceFileContent,
        /rootComponent:\s*(?<componentName>[a-zA-Z$_][\w$_]*)/u,
        { mustExpectExactlyOneMatching: true }
      );

  /* [ Fiddle ] https://regex101.com/r/GtzdPx/1 */
  const rootComponentRawPath: string =
      getMatchingWithFirstRegularExpressionCapturingGroup(
        entryPointSourceFileContent,
        new RegExp(`import\\s+\\{?${ rootComponentName }\\}?\\s+from\\s+["'](?<path>[A-Za-z0-9./_$]+)["']`, "u"),
        { mustExpectExactlyOneMatching: true }
      );

  return rootComponentRawPath.endsWith(".ts") ? rootComponentRawPath : `${ rootComponentRawPath }.ts`;

}
