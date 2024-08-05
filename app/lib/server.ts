import { createServer, Server } from "net";
import { createHttpResponse, parseHttpRequest } from "./http";
import type { HTTPRequest, HTTPResponse } from "./http";
import { Router } from "./router";
import { createrContext, type HTTPContext } from "./context";

type MiddlewareFn = (
  req: HTTPRequest,
  res: HTTPResponse,
  ctx: HTTPContext,
) => any | void;

export class HTTPServer {
  private tcpServer: Server;
  private globalMiddleware: MiddlewareFn[] = [];

  constructor(private router: Router) {
    this.tcpServer = createServer((socket) => {
      socket.on("data", (buffer) => {
        const request = parseHttpRequest(buffer);
        const response = createHttpResponse();
        const context = createrContext(request, response);

        const result = this.router.handle(context);
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

  public registerGlobalMiddleware(fn: MiddlewareFn): HTTPServer {
    if (typeof fn !== "function")
      throw new TypeError("middleware must be a function!");
    this.globalMiddleware.push(fn);
    return this;
  }
}
