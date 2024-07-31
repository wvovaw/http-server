import { parseArgs } from "util";

export const { values: args } = parseArgs({
  args: Bun.argv,
  options: {
    directory: {
      type: "string",
      short: "d",
      default: "/tmp",
    },
    port: {
      type: "string",
      short: "p",
      default: "4221",
    },
  },
  allowPositionals: true,
});
