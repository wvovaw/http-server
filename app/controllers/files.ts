import { readFileSync } from "fs";
import { resolve } from "path";
import { type Route, decode } from "../lib";
import { args } from "../config";

export default {
  name: "files",
  path: "/files/:filename",
  handler: (req, res, ctx) => {
    const filename = ctx.params?.filename;
    if (filename) {
      const fileContent = readFileSync(resolve(args.directory!, filename));
      res
        .headers({
          "Content-Type": "application/octet-stream",
        })
        .status("200 OK")
        .send(decode(fileContent));
    } else {
      res.status("404 Not Found");
    }
  },
} as Route;
