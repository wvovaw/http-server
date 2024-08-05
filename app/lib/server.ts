import { type Server, createServer } from "node:net";
import { type HTTPContext, createrContext } from "./context";
import { createHttpResponse, parseHttpRequest } from "./http";
import type { Handler, Router } from "./router";

type MiddlewareFn = (ctx: HTTPContext, next: () => void) => void;

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

  public listen(port: number, host = "localhost") {
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
      if (
        typeof ctx._meta.globalMwIx === "number" &&
        ctx._meta.globalMwIx < this.globalMiddleware.length
      ) {
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
      if (e instanceof Error) {
        ServerErrorHandler(ctx);
      }
    }
    return ctx.response.finish();
  }
}

const NotFoundHandler: Handler = (ctx) => {
  ctx.response.status("404 Not Found");
};
const ServerErrorHandler: Handler = (ctx) => {
  ctx.response.status("500 Internal Server Error");
};
