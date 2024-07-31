import { type Route } from "../lib";

export default {
  name: "index",
  path: "/",
  handler: () => {
    console.log("index route handler run");
  },
} as Route;
