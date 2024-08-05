import { createServer, Server } from "net";
import { createHttpResponse, parseHttpRequest } from "./http";
import type { HTTPRequest, HTTPResponse } from "./http";
import { type Handler, Router } from "./router";
import { createrContext, type HTTPContext } from "./context";

type MiddlewareFn = (ctx: HTTPContext, next: Function) => void;

export class HTTPServer {
  private tcpServer: Server;
  private globalMiddleware: MiddlewareFn[] = [];

  constructor(private router: Router) {
    this.tcpServer = createServer((socket) => {
      socket.on("data", (buffer) => {
        const request = parseHttpRequest(buffer);
        const response = createHttpResponse();
        const context = createrContext(request, response);

        const result = this.handle(context);
        socket.write(result);
      });

      socket.on("close", () => {
        socket.end();
      });
    });
  }

  public listen(port: number, host: string = "localhost") {
    this.tcpServer.listen(port, host);
  }

  public use(middleware: MiddlewareFn): HTTPServer {
    if (typeof middleware !== "function")
      throw new TypeError("middleware must be a function!");

    this.globalMiddleware.push(middleware);
    return this;
  }

  private handle(ctx: HTTPContext): Buffer {
    ctx._meta.globalMwIx = 0;

    const next = () => {
      if (ctx._meta.globalMwIx < this.globalMiddleware.length) {
        const mw = this.globalMiddleware[ctx._meta.globalMwIx++];
        mw(ctx, next);
      } else {
        const handler = this.router.getHandler(ctx);
        if (handler) {
          handler(ctx);
        } else {
          NotFoundHandler(ctx);
        }
      }
    };

    try {
      next();
    } catch (e: unknown) {
      ServerErrorHandler(ctx);
    } finally {
      return ctx.response.finish();
    }
  }
}

const NotFoundHandler: Handler = function (ctx) {
  ctx.response.status("404 Not Found");
};
const ServerErrorHandler: Handler = function (ctx) {
  ctx.response.status("500 Internal Server Error");
};
