import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { type Route, decode } from "../lib";
import { args } from "../config";

export default {
  name: "files",
  path: "/files/:filename",
  handler: (_req, res, ctx) => {
    const filePath = resolve(args.directory!, ctx.params?.filename!);
    const isFileExist = existsSync(filePath);

    if (isFileExist) {
      const fileContent = readFileSync(filePath);
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
