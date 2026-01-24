import type Component from "./Component";


class Router {

  private readonly mode: Router.Modes;
  private readonly routes: ReadonlyArray<Router.Route>;

  public constructor(
    {
      mode,
      routes
    }: Readonly<{
      mode: Router.Modes;
      routes: ReadonlyArray<Router.Route>;
    }>
  ) {

    this.mode = mode;
    this.routes = routes;

    /* eslint-disable-next-line no-console -- Temporary */
    console.log(this.mode);

    /* eslint-disable-next-line no-console -- Temporary */
    console.log(this.routes);

  }

}


namespace Router {

  export enum Modes {
    hash = "HASH",
    history = "HISTORY"
  }

  export type Route = Readonly<{
    pathTemplate: string;
    name: string;
    component: typeof Component | LoadedOnDemandComponent;
  }>;

  export type LoadedOnDemandComponent = Promise<typeof Component>;

}


export default Router;
