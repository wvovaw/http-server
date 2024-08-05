export interface HTTPContext {
  params: Record<string, string> | null;
}

export function createrContext(): HTTPContext {
  return {
    params: null,
  };
}
