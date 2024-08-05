import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";

export function decode(buffer: Buffer) {
  const decoder = new TextDecoder();
  const data = decoder.decode(buffer);
  return data;
}

export function encode(str: string) {
  return Buffer.from(str);
}

export function readFile(path: string): Buffer | undefined {
  const isFileExist = existsSync(path);

  if (isFileExist) {
    const fileContent = readFileSync(path);
    return fileContent;
  }
}

export function writeFile(path: string, content: string) {
  writeFileSync(path, content);
}

export function deleteFile(path: string) {
  const isFileExist = existsSync(path);

  if (isFileExist) {
    unlinkSync(path);
  }
}
