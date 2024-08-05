import type { HTTPRequest, HTTPResponse } from "./http";

export interface HTTPContext {
  request: HTTPRequest;
  response: HTTPResponse;
  params: Record<string, string> | null;
  _meta: Record<string, unknown>;
}

export function createrContext(
  request: HTTPRequest,
  response: HTTPResponse,
): HTTPContext {
  return {
    request,
    response,
    _meta: {},
  } as HTTPContext;
}
