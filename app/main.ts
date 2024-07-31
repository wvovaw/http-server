import { Router, HTTPServer } from "./lib";
import index from "./controllers/index";
import userAgent from "./controllers/user-agent";
import echo from "./controllers/echo";
import files from "./controllers/files";
import { args } from "./config";

const router = new Router([index, userAgent, echo, files]);
const server = new HTTPServer(router);

server.listen(parseInt(args.port!));
