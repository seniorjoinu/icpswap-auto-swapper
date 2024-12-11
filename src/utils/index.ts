export function optUnwrap<T>(it: [] | [T] | T[]): T | undefined {
  return it.length > 0 ? it[0] : undefined;
}

export function opt<T>(it: T | undefined): [] | [T] {
  return it !== undefined ? [it] : [];
}

export function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export function panic(...reason: any[]): never {
  console.error(reason);
  throw new Error("The program panicked explicitely");
}
