import { type Route } from "../lib";

export default {
  name: "files",
  path: "/files/:filename",
  handler: (req, res, ctx) => {
    res.send("File bro");
  },
} as Route;
