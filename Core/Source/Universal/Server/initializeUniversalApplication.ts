/* ━━━ < Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
import type Component from "../../Common/Component";

/* ┅┅┅ Native Modules ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import Path from "path";
import FileSystem from "fs";
import HTTP from "http";
import ChildProcess from "child_process";

/* ┅┅┅ Domestic Libraries ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import {
  Logger,
  stringifyAndFormatArbitraryValue
} from "@yamato-daiwa/es-extensions";
import {
  ConsoleApplicationLogger,
  ImprovedFileSystem,
  ImprovedPath
} from "@yamato-daiwa/es-extensions-nodejs";

/* ┅┅┅ Third-party Libraries ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import Handlebars from "handlebars";
import JSDOM from "jsdom";
import Chokidar from "chokidar";

/* ┅┅┅ Internal Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import getRootComponentPathRelativeToEntryPoint from "./getRootComponentPathRelativeToEntryPoint";
/* ━━━ Imports > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


type InitializationOptions =

    Readonly<{
      rootComponent: new () => Component;
      projectRootDirectoryAbsolutePath: string;
      isDevelopmentMode: boolean;
      portNumber: number;
      temporaryFilesDirectoryPathRelativeToProjectRoot?: string;
      sourceFilePathRelativeToCurrentWorkingDirectory: string;
      scriptBuildingCommand: string;
    }>;


class UniversalApplicationInitializerForServer {

  public static initialize(initializationOptions: InitializationOptions): void {

    Logger.setImplementation(ConsoleApplicationLogger);

    UniversalApplicationInitializerForServer.
        initializeAsynchronously(initializationOptions).
        catch(Logger.logPromiseError);

  }

  private static async initializeAsynchronously(
    {
      rootComponent: RootComponent,
      projectRootDirectoryAbsolutePath,
      isDevelopmentMode,
      sourceFilePathRelativeToCurrentWorkingDirectory,
      portNumber,
      temporaryFilesDirectoryPathRelativeToProjectRoot = ".ydur",
      scriptBuildingCommand
    }: InitializationOptions
  ): Promise<void> {

    const temporaryFilesDirectoryAbsolutePath: string =
        Path.join(projectRootDirectoryAbsolutePath, temporaryFilesDirectoryPathRelativeToProjectRoot);

    const entryPointSourceFileAbsolutePath: string =
        Path.join(projectRootDirectoryAbsolutePath, sourceFilePathRelativeToCurrentWorkingDirectory);

    const rootComponentFilePathRelativeToEntryPoint: string =
        getRootComponentPathRelativeToEntryPoint(entryPointSourceFileAbsolutePath);

    const rootComponentAbsolutePath: string =
        Path.join(
          ImprovedPath.extractDirectoryFromFilePath({
            targetPath: entryPointSourceFileAbsolutePath,
            alwaysForwardSlashSeparators: false,
            ambiguitiesResolution: {
              mustConsiderLastSegmentStartingWithDotAsDirectory: false,
              mustConsiderLastSegmentWithNonLeadingDotAsDirectory: false,
              mustConsiderLastSegmentWithoutDotsAsFileNameWithoutExtension: false
            }
          }),
          rootComponentFilePathRelativeToEntryPoint
        );

    const embeddedScriptSourceCode: string = Handlebars.
      compile(
        FileSystem.readFileSync(
          Path.join(
            projectRootDirectoryAbsolutePath,
            "node_modules",
            "@yamato-daiwa",
            "universal-reactive",
            "EmbeddedClientScript.hbs"
          ),
          "utf8"
        )
      )(
        {
          rootComponentFilePathRelativeToEntryPoint:
              ImprovedPath.computeRelativePath({
                basePath: temporaryFilesDirectoryAbsolutePath,
                comparedPath: rootComponentAbsolutePath,
                alwaysForwardSlashSeparators: true
              }).replace(/.ts$/u, "")
        }
      );

    const clientScriptSourceFileAbsolutePath: string =
        Path.join(temporaryFilesDirectoryAbsolutePath, "EmbeddedClientScript.ts");

    // FIXME This file itself rarely chaged. Only if path to root component will change.
    // What actually change is the root component and all tree of it.
    ImprovedFileSystem.writeFileToPossiblyNotExistingDirectory({
      content: embeddedScriptSourceCode,
      filePath: clientScriptSourceFileAbsolutePath,
      synchronously: true
    });

    const argumentsVector: Array<string> = scriptBuildingCommand.match(/"[^"]*"|'[^']*'|\S+/gu) ?? [];

    if (isDevelopmentMode) {
      await UniversalApplicationInitializerForServer.
          provideIncrementalBuildingOfClientScript(
            clientScriptSourceFileAbsolutePath,
            argumentsVector,
            projectRootDirectoryAbsolutePath
          );
    } else {
      await UniversalApplicationInitializerForServer.buildClientScript(
        argumentsVector,
        projectRootDirectoryAbsolutePath
      );
    }

    const generateHTML_Page: Handlebars.TemplateDelegate =
        Handlebars.compile(
          FileSystem.readFileSync(
            Path.join(
              projectRootDirectoryAbsolutePath,
              "node_modules",
              "@yamato-daiwa",
              "universal-reactive",
              "PageTemplate.hbs"
            ),
            "utf8"
          )
        );

    const clientScript: string =
        FileSystem.readFileSync(
          Path.join(temporaryFilesDirectoryAbsolutePath, "EmbeddedClientScript.js"),
          "utf-8"
        );

    global.document = new JSDOM.JSDOM("<!DOCTYPE html><div id=\"APPLICATION_ROOT\"></div>").window.document;

    HTTP.

        createServer(
          (rawRequest: HTTP.IncomingMessage, rawResponse: HTTP.ServerResponse): void => {

            Logger.logInfo({
              title: "New Request",
              description:
                  `${ rawRequest.method }::${ rawRequest.url }\n${ stringifyAndFormatArbitraryValue(rawRequest.headers) }`
            });


            if (rawRequest.url !== "/") {

              rawResponse.statusCode = 404;
              rawResponse.end();

              return;

            }


            rawResponse.statusCode = 200;
            rawResponse.setHeader("Content-Type", "text/html");

            const templateElement: HTMLTemplateElement = global.document.createElement("template");

            templateElement.content.append(...new RootComponent().$DOM);

            rawResponse.write(
              generateHTML_Page({
                title: "Sample",
                content: templateElement.innerHTML,
                script: clientScript
              })
            );

            rawResponse.end();

          }
        ).

        listen(
          portNumber,
          "127.0.0.1",
          (): void => {
            Logger.logSuccess({
              title: "YDUR Server Started",
              description: `Waiting for the requests on http://127.0.0.1:${ portNumber }`
            });
          }
        ).

        on(
          "error",
          (error: Error): void => {
            Logger.logError({
              errorType: "HTTP_RequestsServingBootstrapError",
              title: "",
              description: "",
              occurrenceLocation: "server.startHTTP_RequestServingIfCorrespondingConfigurationDefined()",
              caughtError: error
            });
          }
        );

  }

  private static async provideIncrementalBuildingOfClientScript(
    clientScriptSourceFileAbsolutePath: string,
    argumentsVector: ReadonlyArray<string>,
    projectRootDirectoryAbsolutePath: string
  ): Promise<void> {

    await UniversalApplicationInitializerForServer.buildClientScript(argumentsVector, projectRootDirectoryAbsolutePath);

    Chokidar.
        watch(clientScriptSourceFileAbsolutePath).
        on(
          "change",
          (): void => {

            Logger.logInfo({
              title: "YDUR, Rebuilding Client Script",
              description: "Changes detected in source code, rebuilding...",
              compactLayout: true
            });

            UniversalApplicationInitializerForServer.
                buildClientScript(argumentsVector, projectRootDirectoryAbsolutePath).
                catch(Logger.logPromiseError);

          }
        );

  }

  private static async buildClientScript(
    argumentsVector: ReadonlyArray<string>,
    projectRootDirectoryAbsolutePath: string
  ): Promise<void> {

    const buildProcess: ChildProcess.ChildProcess =
        ChildProcess.spawn(
          argumentsVector[0],
          argumentsVector.slice(1),
          {
            cwd: projectRootDirectoryAbsolutePath,
            stdio: "inherit",
            shell: true,
            env: {
              FORCE_COLOR: "1"
            }
          }
        );

    return new Promise<void>(
      (resolve: () => void, reject: (error: Error) => void): void => {

        buildProcess.on(
          "exit",
          (code: number | null): void => {

            if (code === 0) {

              Logger.logSuccess({
                title: "Build Complete",
                description: "Script building command executed successfully"
              });

              resolve();

            } else {

              Logger.logError({
                errorType: "BuildProcessError",
                title: "Build Failed",
                description: `Build process exited with code ${ code }`,
                occurrenceLocation: "initializeUniversalApplication()"
              });

              reject(new Error("Exit code is not 0"));

            }

          }
        );

      }
    );

  }

}


export default UniversalApplicationInitializerForServer.initialize;
