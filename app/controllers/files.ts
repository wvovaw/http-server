import { resolve } from "node:path";
import { args } from "../config";
import { type Route, decode } from "../lib";
import { deleteFile, readFile, writeFile } from "../lib/utils";

const download: Route = {
  method: "GET",
  name: "files",
  path: "/files/:filename",
  handler: ({ params, response }) => {
    const filename = params?.filename;
    if (filename) {
      const content = readFile(resolve(args.directory, filename));
      if (content) {
        response.setHeader("Content-Type", "application/octet-stream");
        response.status = "200 OK";
        response.body = decode(content);
        return;
      }
    }

    response.status = "404 Not Found";
  },
};
const upload: Route = {
  method: "POST",
  name: "files",
  path: "/files/:filename",
  handler: ({ request, response, params }) => {
    const filename = params?.filename;
    if (filename) {
      const filePath = resolve(args.directory, filename);
      const content = request.body;

      writeFile(filePath, content);
      response.status = "201 Created";
    } else {
      response.status = "400 Bad Request";
      response.body = "Incorrect filename provided";
    }
  },
};

const destroy: Route = {
  method: "DELETE",
  name: "files",
  path: "/files/:filename",
  handler: ({ response, params }) => {
    const filename = params?.filename;
    if (filename) {
      const filePath = resolve(args.directory, filename);

      deleteFile(filePath);
      response.status = "204 No Content";
    } else {
      response.status = "400 Bad Request";
      response.body = "Incorrect filename provided";
    }
  },
};
export default {
  download,
  upload,
  destroy,
};
