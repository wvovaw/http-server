import { type Route } from "../lib";

const route: Route = {
  method: "GET",
  name: "echo",
  path: "/echo/:msg",
  handler: ({ response, params }) => {
    if (params) {
      console.log("echo route handler run with the :msg = ", params?.msg);
      response.send(params.msg);
    }
  },
};

export default route;
