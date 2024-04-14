import type monaco from "monaco-editor";
import { get, writable, type Readable, type Writable } from "svelte/store";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import type { Language } from "./types";


export class EditorImpl {
  public editor: Writable<monaco.editor.IStandaloneCodeEditor | undefined> = writable(undefined);
  public sourceCode: Writable<string[]> = writable([]);

  public divEl: HTMLDivElement;
  public Monaco: typeof monaco | undefined;

  constructor() {
    this.divEl = document.createElement("div");
  }

  public async init(language: Readable<Language>) {
    this.Monaco = await import("monaco-editor");

    this.Monaco!.editor.defineTheme("racer", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1C1820",
      }
    });

    self.MonacoEnvironment = {
      getWorker(_, label) {
          if (label === 'json') { return new jsonWorker() }
          if (label === 'css' || label === 'scss' || label === 'less') { return new cssWorker() }
          if (label === 'html' || label === 'handlebars' || label === 'razor') { return new htmlWorker() }
          if (label === 'typescript' || label === 'javascript') { return new tsWorker() }
          return new editorWorker()
      }
    }

    const editor = this.Monaco!.editor.create(this.divEl, {
      value: "",
      language: get(language),
      automaticLayout: true,
      theme: "racer",
    });

    const model = editor.getModel();

    model?.onDidChangeContent(() => {
      this.sourceCode.set(model?.getLinesContent())
    });


    this.editor.set(editor);

    language.subscribe((lang) => {
      const editor = get(this.editor);
      const Monaco = this.Monaco;

      if (!editor || !Monaco) return;
      Monaco.editor.setModelLanguage(editor.getModel()!, lang);
    });
    return this;
  }

  public ready(): boolean {
    return Boolean(this.editor);
  }

  public dispose() {
    if (this.editor) get(this.editor)?.dispose();
  }
}
