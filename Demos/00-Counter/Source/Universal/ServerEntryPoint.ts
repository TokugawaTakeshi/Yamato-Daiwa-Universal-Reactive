import * as YDUR from "@yamato-daiwa/universal-reactive/server";
import Counter from "../GUI_Components/Counter";


YDUR.initializeUniversalApplication({
  rootComponent: Counter,
  projectRootDirectoryAbsolutePath: __PROJECT_ROOT_DIRECTORY__ALWAYS_FORWARD_SLASHES_PATH_SEPARATORS__YDA__,
  isDevelopmentMode: __IS_LOCAL_DEVELOPMENT_BUILDING_MODE__YDA__,
  sourceFilePathRelativeToCurrentWorkingDirectory: "Source/Universal/ServerEntryPoint.ts",
  portNumber: 8080,
  scriptBuildingCommand: "npm run \"Build Client for Universal Mode\""
});
