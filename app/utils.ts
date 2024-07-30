export function decode(buffer: Buffer) {
  const decoder = new TextDecoder();
  const data = decoder.decode(buffer);
  return data;
}

export function encode(str: string) {
  return Buffer.from(str);
}
