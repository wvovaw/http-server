import { readFileSync, existsSync, writeFileSync } from "fs";
import { resolve } from "path";
import { type Route, decode } from "../lib";
import { args } from "../config";

const download: Route = {
  method: "GET",
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
};
const upload: Route = {
  method: "POST",
  name: "files",
  path: "/files/:filename",
  handler: (req, res, ctx) => {
    const filePath = resolve(args.directory!, ctx.params?.filename!);
    const fileContent = req.body;

    try {
      writeFileSync(filePath, fileContent);
      res
        .headers({
          "Content-Type": "application/octet-stream",
        })
        .status("201 Created");
    } catch (e: unknown) {
      if (e instanceof Error)
        res.send(e.message).status("500 Internal Server Error");
    }
  },
};
export default {
  download,
  upload,
};
