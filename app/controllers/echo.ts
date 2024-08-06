import type { Route } from "../lib";

const route: Route = {
  method: "GET",
  name: "user-agent",
  path: "/user-agent",
  handler: ({ request, response }) => {
    const userAgent = request.headers["User-Agent"];
    response.body = userAgent;
  },
};
export default route;
