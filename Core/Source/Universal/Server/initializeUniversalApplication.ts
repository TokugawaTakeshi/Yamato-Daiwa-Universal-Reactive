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


export class UniversalApplicationInitializerForServer {

  static {
    Logger.setImplementation(ConsoleApplicationLogger);
  }


  public static initialize(
    initializationOptions: UniversalApplicationInitializerForServer.InitializationOptions
  ): void {
    UniversalApplicationInitializerForServer.
        initializeAsynchronously(initializationOptions).
        catch(Logger.logPromiseError);
  }

  public static generateClientScriptSourceCode(
    {
      projectRootDirectoryAbsolutePath,
      sourceFilePathRelativeToCurrentWorkingDirectory,
      temporaryFilesDirectoryPathRelativeToProjectRoot = ".ydur",
      entryPointSourceFileAbsolutePath =
          Path.join(projectRootDirectoryAbsolutePath, sourceFilePathRelativeToCurrentWorkingDirectory),
      temporaryFilesDirectoryAbsolutePath =
          Path.join(projectRootDirectoryAbsolutePath, temporaryFilesDirectoryPathRelativeToProjectRoot)
    }:
      Pick<
        UniversalApplicationInitializerForServer.InitializationOptions,
          "projectRootDirectoryAbsolutePath" |
          "sourceFilePathRelativeToCurrentWorkingDirectory" |
          "temporaryFilesDirectoryPathRelativeToProjectRoot"
      > &
      Readonly<{
        entryPointSourceFileAbsolutePath?: string;
        temporaryFilesDirectoryAbsolutePath?: string;
      }>
  ): void {

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

    const embeddedScriptSourceCode: string =
        Handlebars.
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
            )({
              rootComponentFilePathRelativeToEntryPoint:
                  ImprovedPath.
                      computeRelativePath({
                        basePath: temporaryFilesDirectoryAbsolutePath,
                        comparedPath: rootComponentAbsolutePath,
                        alwaysForwardSlashSeparators: true
                      }).
                      replace(/.ts$/u, "")
            });

    const clientScriptSourceFileAbsolutePath: string =
        Path.join(temporaryFilesDirectoryAbsolutePath, "EmbeddedClientScript.ts");

    ImprovedFileSystem.writeFileToPossiblyNotExistingDirectory({
      content: embeddedScriptSourceCode,
      filePath: clientScriptSourceFileAbsolutePath,
      synchronously: true
    });

    Logger.logSuccess({
      title: "YDUR, Client Script Source Code has been Generated",
      description: clientScriptSourceFileAbsolutePath,
      compactLayout: true
    });

  }


  private static async initializeAsynchronously(
    {
      rootComponent: RootComponent,
      projectRootDirectoryAbsolutePath,
      isDevelopmentMode,
      sourceFilePathRelativeToCurrentWorkingDirectory,
      portNumber,
      temporaryFilesDirectoryPathRelativeToProjectRoot = ".ydur",
      incrementalDevelopmentBuildingOfClientScriptCommand,
      productionBuildingOfClientScriptCommand
    }: UniversalApplicationInitializerForServer.InitializationOptions
  ): Promise<void> {

    const entryPointSourceFileAbsolutePath: string =
        Path.join(projectRootDirectoryAbsolutePath, sourceFilePathRelativeToCurrentWorkingDirectory);

    const temporaryFilesDirectoryAbsolutePath: string =
        Path.join(projectRootDirectoryAbsolutePath, temporaryFilesDirectoryPathRelativeToProjectRoot);

    UniversalApplicationInitializerForServer.generateClientScriptSourceCode({
      projectRootDirectoryAbsolutePath,
      sourceFilePathRelativeToCurrentWorkingDirectory,
      temporaryFilesDirectoryPathRelativeToProjectRoot,
      entryPointSourceFileAbsolutePath,
      temporaryFilesDirectoryAbsolutePath
    });

    if (isDevelopmentMode) {
      Chokidar.
          watch(entryPointSourceFileAbsolutePath).
          on(
            "change",
            (): void => {

              Logger.logInfo({
                title: "YDUR, Entry Point has Updated",
                description: "Re-generating the client script...",
                compactLayout: true
              });

              UniversalApplicationInitializerForServer.generateClientScriptSourceCode({
                projectRootDirectoryAbsolutePath,
                sourceFilePathRelativeToCurrentWorkingDirectory,
                temporaryFilesDirectoryPathRelativeToProjectRoot,
                entryPointSourceFileAbsolutePath,
                temporaryFilesDirectoryAbsolutePath
              });

            }
          );
    }


    const clientScriptOutputFileAbsolutePath: string =
        Path.join(temporaryFilesDirectoryAbsolutePath, "EmbeddedClientScript.js");

    const argumentsVector: Array<string> =
        (isDevelopmentMode ? incrementalDevelopmentBuildingOfClientScriptCommand : productionBuildingOfClientScriptCommand).
            match(/"[^"]*"|'[^']*'|\S+/gu) ?? [];

    await UniversalApplicationInitializerForServer.
        buildClientScript({
          argumentsVector,
          projectRootDirectoryAbsolutePath,
          mustWaitForExistingOfProcess: !isDevelopmentMode
        });

    let clientScript: string = "console.log(\"Building the client script\")";

    if (isDevelopmentMode) {

      Chokidar.
          watch(clientScriptOutputFileAbsolutePath).
          on(
            "change",
            (): void => {

              Logger.logInfo({
                title: "YDUR, Client Script Updating Detected",
                description: "New client script will be returned on reloading of browser",
                compactLayout: true
              });

              clientScript = FileSystem.readFileSync(clientScriptOutputFileAbsolutePath, "utf-8");

            }
          );

    } else {

      clientScript = FileSystem.readFileSync(clientScriptOutputFileAbsolutePath, "utf-8");

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

    global.document = new JSDOM.JSDOM("<!DOCTYPE html><div id=\"APPLICATION_ROOT\"></div>").window.document;
    const templateElement: HTMLTemplateElement = global.document.createElement("template");

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

            templateElement.content.replaceChildren(...new RootComponent().$DOM);

            rawResponse.write(
              generateHTML_Page({
                title: "YDUR",
                content: templateElement.innerHTML,
                script: clientScript
              })
            );

            rawResponse.end();

            templateElement.content.replaceChildren();

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
              title: "YDUR Server Starting Error",
              description: "The following error has occurred during the starting of YDUR server.",
              occurrenceLocation: "server.generateClientScriptSourceCode(options)",
              caughtError: error
            });
          }
        );

  }

  private static async buildClientScript(
    {
      argumentsVector,
      projectRootDirectoryAbsolutePath,
      mustWaitForExistingOfProcess
    }: Readonly<{
      argumentsVector: ReadonlyArray<string>;
      projectRootDirectoryAbsolutePath: string;
      mustWaitForExistingOfProcess: boolean;
    }>
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

    if (mustWaitForExistingOfProcess) {
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
                  occurrenceLocation: "UniversalApplicationInitializerForServer.buildClientScript()"
                });

                reject(new Error("Exit code is not 0"));

              }

            }
          );

        }
      );
    }

  }

}

export namespace UniversalApplicationInitializerForServer {

  export type InitializationOptions =

      Readonly<{
        rootComponent: new () => Component;
        projectRootDirectoryAbsolutePath: string;
        isDevelopmentMode: boolean;
        portNumber: number;
        temporaryFilesDirectoryPathRelativeToProjectRoot?: string;
        sourceFilePathRelativeToCurrentWorkingDirectory: string;
        incrementalDevelopmentBuildingOfClientScriptCommand: string;
        productionBuildingOfClientScriptCommand: string;
      }>;

}


export default UniversalApplicationInitializerForServer.initialize;
