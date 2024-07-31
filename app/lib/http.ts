import { Socket } from "net";
import { decode, encode } from "./utils";

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
type HTTPStatusCode = string;

type HTTPHeaders = Record<string, string>;
type HTTPBody = string;

export interface HTTPRequest {
  method: HTTPMethod;
  target: string;
  version: HTTPVersion;
  headers: HTTPHeaders;
  body: HTTPBody;
}

export function parseHttpRequest(buffer: Buffer): HTTPRequest {
  const data = decode(buffer);
  const [meta, body] = data.split("\r\n\r\n");
  const metaLines = meta.split("\r\n");

  const options = metaLines[0].split(" ");
  const method = options[0] as HTTPMethod;
  const target = options[1];
  const version = options[2] as HTTPVersion;

  const headers = {} as HTTPHeaders;
  metaLines.slice(1).forEach((line) => {
    const parts = line.split(": ");
    const key = parts[0];
    const value = parts.slice(1).join(": ");
    headers[key] = value;
  });

  return {
    version,
    method,
    target,
    headers,
    body,
  };
}

export class HTTPResponse {
  private _data: string = "";
  private _code: HTTPStatusCode = "200 OK";
  private _headers: HTTPHeaders = {
    "Content-Type": "text/plain",
  };

  constructor() {}

  public send(data: string) {
    this._data = String(data);
    this.headers({
      "Content-Length": String(this._data.length),
    });
    return this;
  }
  public status(code: HTTPStatusCode) {
    this._code = code;
    return this;
  }
  public headers(headers: HTTPHeaders) {
    Object.assign(this._headers, headers);
    return this;
  }

  private static encodeToHTTP(response: HTTPResponse): Buffer {
    const ENDL = "\r\n";
    const statusLine = `HTTP/1.1 ${response._code}${ENDL}`;
    const headers = Object.entries(response._headers)
      .map(([key, value]) => {
        return `${key}: ${value}`;
      })
      .join(ENDL);
    const body = response._data;
    return encode(statusLine + headers + ENDL + ENDL + body);
  }

  public finish() {
    return HTTPResponse.encodeToHTTP(this);
  }
}

export function createHttpResponse() {
  const response = new HTTPResponse();
  return response;
}
