import { type Route } from "../lib";

const route: Route = {
  method: "GET",
  name: "echo",
  path: "/echo/:msg",
  handler: (req, res, ctx) => {
    if (ctx.params) {
      console.log("echo route handler run with the :msg = ", ctx.params?.msg);
      res.send(ctx.params.msg);
    }
  },
};

export default route;
