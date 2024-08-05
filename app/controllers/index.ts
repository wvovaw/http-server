import type { Route } from "../lib";

const route: Route = {
  method: "GET",
  name: "index",
  path: "/",
  handler: () => {
    console.log("index route handler run");
  },
};

export default route;
