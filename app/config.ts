import { parseArgs } from "node:util";

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
}) as {
  values: {
    directory: string;
    port: string;
  };
};
