import { decode } from "./utils";

type HTTPMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE";
type HTTPVersion = "HTTP/1.1";

type HTTPHeaders = Record<string, string>;
type HTTPBody = string;

interface HTTPRequest {
  method: HTTPMethod;
  target: string;
  version: HTTPVersion;
  headers: HTTPHeaders;
  body: HTTPBody;
}

export function parseHttpMessage(buffer: Buffer): HTTPRequest {
  const data = decode(buffer);
  const lines = data.split("\r\n").filter((val) => val.length);

  const firstLine = lines[0];
  const options = firstLine.split(" ");
  const method = options[0] as HTTPMethod;
  const target = options[1];
  const version = options[2] as HTTPVersion;

  const headers = {} as HTTPHeaders;
  lines.slice(1, lines.length - 1).forEach((line) => {
    const parts = line.split(": ");
    const key = parts[0];
    const value = parts.slice(1).join(": ");
    headers[key] = value;
  });

  const body = lines[lines.length - 1];

  return {
    version,
    method,
    target,
    headers,
    body,
  };
}
