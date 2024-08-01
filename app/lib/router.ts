import { HTTPMethod, HTTPRequest, HTTPResponse } from "./http";

export interface Route {
  method: HTTPMethod;
  name: string;
  path: string;
  handler: (req: HTTPRequest, res: HTTPResponse, ctx: RouteContext) => void;
}

export interface RouteContext {
  params: Record<string, string> | null;
}

export function createRouterContext(): RouteContext {
  return {} as RouteContext;
}

export class Router {
  constructor(public routes: Route[]) {}

  private static notFoundHandler(
    req: HTTPRequest,
    res: HTTPResponse,
    ctx: RouteContext,
  ) {
    res.status("404 Not Found");
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

  public handle(
    request: HTTPRequest,
    response: HTTPResponse,
    ctx: RouteContext,
  ): Buffer {
    const matchingRoute = this.findMatchingRoute(
      request.target,
      request.method,
    );

    if (matchingRoute) {
      const params = this.extractParams(request.target, matchingRoute);
      ctx.params = params;
      matchingRoute.handler(request, response, ctx);
    } else {
      Router.notFoundHandler(request, response, ctx);
    }

    return response.finish();
  }
}
