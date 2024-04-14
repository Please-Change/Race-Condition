import Parser from "web-tree-sitter";
import { get, writable } from "svelte/store";
import { Language as L} from "./types";
import _ from "lodash";
import * as Gen from "@lib/genUtils";

const ready = writable(false);

const languages = {};


export namespace StaticAnalysis {
  export const SUPPORTED_LANGUAGES = [...Object.values(L)] as const;
  export type Language = L;
  type LanguageFeatures = {
    [key in Language]: {
      variables: string;
    };
  }

  const LANGUAGES: LanguageFeatures = {
    "javascript": {
      variables: `[
        (variable_declarator
          name: (identifier) @ident
        )
        (assignment_expression
          left: (identifier) @ident
        )
      ]`,
    },
    "python": {
      variables: `[
        (assignment
          left: (identifier) @ident
        )
        (named_expression
          name: (identifier) @ident
        )
      ]`,
    }, 
    "cpp": {
      variables: `[
        (declaration
          declarator: [
            (identifier) @ident
            (init_declarator
              declarator: (identifier) @ident
            )
            (pointer_declarator
              declarator: (identifier) @ident
            )
          ]
        )
      ]`
    },
    "go": {
      variables: `[
        (var_declaration
          (var_spec
            name: ((identifier) @spec
            ","?)+
          )
        )
        (short_var_declaration
          left: (expression_list
            ((identifier) @spec
            ","?)+
          )
        )
      ]`
    },
    "rust": {
      variables: `[
        (const_item
          name: (identifier) @indent
        )
        (let_declaration
          pattern: (identifier) @indent
        )
      ]`
    },
  };

  export async function init(): Promise<void> {
    if (get(ready)) return;

    return Parser.init({
      locateFile: () => "/ast/tree-sitter.wasm",
    }).then(() => ready.set(true));
  }

  export async function forLanguage(lang: typeof SUPPORTED_LANGUAGES[number]) {
    const parser = new Parser();
    const Lang = await Parser.Language.load(`/ast/tree-sitter-${lang}.wasm`);
    parser.setLanguage(Lang);

    return [Lang, parser] as const;
  }

  export function variables(lang_id: Language, lang: Parser.Language, ast: Parser.Tree) {
    return lang.query(LANGUAGES[lang_id].variables).matches(ast.rootNode)
  }
}
