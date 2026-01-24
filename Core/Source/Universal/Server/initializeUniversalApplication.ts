export default function initializeUniversalApplication(): void {
export default function initializeUniversalApplication(
  {
    rootComponent: RootComponent,
    rootComponentAbsolutePath__TEMPORARY,
    projectRootDirectoryAbsolutePath__TEMPORARY,
    sourceFilePathRelativeToCurrentWorkingDirectory,
    portNumber,
    temporaryFilesDirectoryPathRelativeToProjectRoot = ".ydur"
  }: Readonly<{
    rootComponent: new () => Component;
    rootComponentAbsolutePath__TEMPORARY: string;
    projectRootDirectoryAbsolutePath__TEMPORARY: string;
    portNumber: number;
    temporaryFilesDirectoryPathRelativeToProjectRoot?: string;
    sourceFilePathRelativeToCurrentWorkingDirectory: string;
  }>
): void {
type InitializationOptions =
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
              content: templateElement.innerHTML
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
            title: "OK",
            description: "Started"
          });
        }
      ).

      on("error", (error: Error): void => {
        Logger.logError({
          errorType: "HTTP_RequestsServingBootstrapError",
          title: "",
          description: "",
          occurrenceLocation: "server.startHTTP_RequestServingIfCorrespondingConfigurationDefined()",
          caughtError: error
        });
      });

}
