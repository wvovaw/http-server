import { createServer, Server } from "net";
import { createHttpResponse, parseHttpRequest } from "./http";
import { createRouterContext, Route, Router } from "./router";

export class HTTPServer {
  private tcpServer: Server;

  constructor(private router: Router) {
    this.tcpServer = createServer((socket) => {
      socket.on("data", (buffer) => {
        const request = parseHttpRequest(buffer);
        const response = createHttpResponse();
        const context = createRouterContext();

        const result = this.router.handle(request, response, context);
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
}
