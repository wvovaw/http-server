import * as net from "net";
import { decode, encode } from "./utils";
import { parseHttpMessage } from "./http";

interface Route {
  name: string;
  handler: () => void;
}

const router: Route[] = [
  {
    name: "/",
    handler: () => {
      console.log("index route handler run");
    },
  },
];

function resolveRoute(target: string): Route | null {
  const route = router.find((route) => route.name === target) ?? null;
  return route;
}

const server = net.createServer((socket) => {
  socket.on("data", (buffer) => {
    const req = parseHttpMessage(buffer);
    console.log(req);

    const route = resolveRoute(req.target);
    if (route) {
      route.handler();
      const response = encode("HTTP/1.1 200 OK\r\n\r\n");
      socket.write(response);
    } else {
      const response = encode("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.write(response);
    }
  });

  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
