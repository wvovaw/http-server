import { readFileSync, existsSync, writeFileSync } from "fs";
import { resolve } from "path";
import { type Route, decode } from "../lib";
import { args } from "../config";

const download: Route = {
  method: "GET",
  name: "files",
  path: "/files/:filename",
  handler: ({ params, response }) => {
    const filePath = resolve(args.directory!, params?.filename!);
    const isFileExist = existsSync(filePath);

    if (isFileExist) {
      const fileContent = readFileSync(filePath);
      response
        .headers({
          "Content-Type": "application/octet-stream",
        })
        .status("200 OK")
        .send(decode(fileContent));
    } else {
      response.status("404 Not Found");
    }
  },
};
const upload: Route = {
  method: "POST",
  name: "files",
  path: "/files/:filename",
  handler: ({ request, response, params }) => {
    const filePath = resolve(args.directory!, params?.filename!);
    const fileContent = request.body;

    try {
      writeFileSync(filePath, fileContent);
      response
        .headers({
          "Content-Type": "application/octet-stream",
        })
        .status("201 Created");
    } catch (e: unknown) {
      if (e instanceof Error)
        response.send(e.message).status("500 Internal Server Error");
    }
  },
};
export default {
  download,
  upload,
};
