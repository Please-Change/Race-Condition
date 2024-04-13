import Parser from "web-tree-sitter";
import { get, writable } from "svelte/store";

const ready = writable(false);

const languages = {}

export namespace StaticAnalysis {
  export type Language = typeof SUPPORTED_LANGUAGES[number];
  export const SUPPORTED_LANGUAGES = ["javascript", "python", "go", "cpp", "c", "rust"] as const;


  export async function init(): Promise<void> {
    if (get(ready)) return;

    return Parser.init({
      locateFile: () => "/ast/tree-sitter.wasm",
    }).then(() => ready.set(true));
  }

  export async function forLanguage(lang: typeof SUPPORTED_LANGUAGES[number]): Promise<Parser> {
    const parser = new Parser();
    const Lang = await Parser.Language.load(`/ast/tree-sitter-${lang}.wasm`);
    parser.setLanguage(Lang);

    return parser;
  }
}
