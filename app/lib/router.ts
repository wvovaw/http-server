import { HTTPContext } from "./context";
import { HTTPMethod, HTTPRequest, HTTPResponse } from "./http";

export interface Route {
  method: HTTPMethod;
  name: string;
  path: string;
  handler: (ctx: HTTPContext) => void;
}

export class Router {
  constructor(public routes: Route[]) {}

  private static notFoundHandler({ response }: HTTPContext) {
    response.status("404 Not Found");
  }

  private findMatchingRoute(target: string, method: HTTPMethod) {
    const matchingRoute = this.routes.find((route) => {
      const reg = route.path.replace(/:([^/]+)/g, "([^/]+)");
      const regex = new RegExp(`^${reg}\/?$`);
      return regex.test(target) && route.method === method;
    });
    return matchingRoute;
  }

  private extractParams(target: string, route: Route) {
    const patternSegments = route.path.split("/");
    const urlSegments = target.split("/");

    const params: Record<string, string> = {};
    patternSegments.forEach((patternSegment, index) => {
      const segment = urlSegments[index];
      if (patternSegment.startsWith(":")) {
        const paramName = patternSegment.slice(1);
        params[paramName] = segment;
      }
    });

    return params;
  }

  public handle(ctx: HTTPContext): Buffer {
    const matchingRoute = this.findMatchingRoute(
      ctx.request.target,
      ctx.request.method,
    );

    if (matchingRoute) {
      const params = this.extractParams(ctx.request.target, matchingRoute);
      ctx.params = params;
      matchingRoute.handler(ctx);
    } else {
      Router.notFoundHandler(ctx);
    }

    return ctx.response.finish();
  }
}
