import { type Route } from "../lib";

export default {
  name: "user-agent",
  path: "/user-agent",
  handler: (req, res, ctx) => {
    const userAgent = req.headers["User-Agent"];
    res.send(userAgent);
  },
} as Route;
