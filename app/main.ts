import * as net from "net";
import { decode, encode } from "./utils";
import { createHttpResponse, parseHttpRequest } from "./http";
import { createRouterContext, Router } from "./router";

const router = new Router([
  {
    name: "index",
    path: "/",
    handler: () => {
      console.log("index route handler run");
    },
  },
  {
    name: "echo",
    path: "/echo/:msg",
    handler: (req, res, ctx) => {
      if (ctx.params) {
        console.log("echo route handler run with the :msg = ", ctx.params?.msg);
        res.send(ctx.params.msg);
      }
    },
  },
  {
    name: "user-agent",
    path: "/user-agent",
    handler: (req, res, ctx) => {
      const userAgent = req.headers["User-Agent"];
      res.send(userAgent);
    },
  },
]);

const server = net.createServer((socket) => {
  socket.on("data", (buffer) => {
    const request = parseHttpRequest(buffer);
    const response = createHttpResponse();
    const context = createRouterContext();

    const result = router.handle(request, response, context);
    socket.write(result);
  });

  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
