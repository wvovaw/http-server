import type { HTTPContext } from "../lib";

export default function (_ctx: HTTPContext, next: () => void) {
  console.log("TEST MIDDLEWARE RUN");
  next();
}
