import { type Route } from "../lib";

const route: Route = {
  method: "GET",
  name: "user-agent",
  path: "/user-agent",
  handler: (req, res, ctx) => {
    const userAgent = req.headers["User-Agent"];
    res.send(userAgent);
  },
};
export default route;
