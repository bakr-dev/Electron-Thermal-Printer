declare module 'electron-store' {
  import type { Schema } from 'electron-store';

  interface Options<T extends Record<string, unknown> = Record<string, unknown>> {
    defaults?: T;
    schema?: Schema<T>;
    name?: string;
  }

  declare class ElectronStore<T extends Record<string, unknown> = Record<string, unknown>> {
    constructor(options?: Options<T>);
    get: <K extends keyof T>(key: K) => T[K];
    set: <K extends keyof T>(key: K, value: T[K]) => void;
    delete: (key: keyof T) => void;
    clear: () => void;
    path: string;
  }

  export = ElectronStore;
}
