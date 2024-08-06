import { args } from "./config";
import echo from "./controllers/echo";
import files from "./controllers/files";
import index from "./controllers/index";
import userAgent from "./controllers/user-agent";
import { HTTPServer, Router } from "./lib";
import compression from "./middleware/compression";

const router = new Router([
  index,
  userAgent,
  echo,
  files.upload,
  files.download,
  files.destroy,
]);
const server = new HTTPServer(router);

server.use(compression);
server.use((ctx, next) => {
  console.log(`[${ctx.request.method}]: ${ctx.request.target}`);
  next();
});

server.listen(Number.parseInt(args.port ?? "3000"));
