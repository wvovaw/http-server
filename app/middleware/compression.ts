import type { HTTPContext } from "../lib";

/**
 * Make sure this middleware is at the top of the .use chain, so it will run at the most end
 */
export default function ({ request, response }: HTTPContext, next: () => void) {
  next();

  const acceptEncoding = request.headers["Accept-Encoding"]?.toLowerCase();
  if (!acceptEncoding || acceptEncoding === "identity") return;

  const algorithm =
    acceptEncoding === "*"
      ? SUPPORTED_ALGORITHMS.FALLBACK
      : SUPPORTED_ALGORITHMS[acceptEncoding];
  if (!algorithm) return;

  response.body = algorithm(response.body);
  response.setHeader("Content-Encoding", acceptEncoding);
  response.setHeader("Content-Length", String(response.body.length));
}

const gzip: CompressionAlgorithm = (content) => {
  return `GZIPED${content.split("").reverse().join("")}`;
};
const deflate: CompressionAlgorithm = (content) => {
  return `DEFLATED${content.split("").reverse().join("")}`;
};
const brotli: CompressionAlgorithm = (content) => {
  return `BROTLI${content.split("").reverse().join("")}`;
};

type CompressionAlgorithm = (content: string) => string;
const SUPPORTED_ALGORITHMS: Record<string, CompressionAlgorithm | undefined> = {
  gzip,
  deflate,
  br: brotli,
  FALLBACK: gzip,
};
