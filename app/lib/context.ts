import { HTTPRequest, HTTPResponse } from "./http";

export interface HTTPContext {
  request: HTTPRequest;
  response: HTTPResponse;
  params: Record<string, string> | null;
}

export function createrContext(
  request: HTTPRequest,
  response: HTTPResponse,
): HTTPContext {
  return {
    request,
    response,
  } as HTTPContext;
}
