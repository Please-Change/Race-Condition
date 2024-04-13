import type monaco from "monaco-editor";
import { getWorkerFromLabel } from "./worker";

export class EditorImpl {
  public editor: monaco.editor.IStandaloneCodeEditor | undefined;
  public divEl: HTMLDivElement;
  private Monaco: typeof import("monaco-editor") | undefined;

  constructor() {
    // TODO: Change - this is a global variable
    self.MonacoEnvironment = {
      getWorker: function (_moduleId: string, label: string) {
        return getWorkerFromLabel(label);
      },
    };

    this.divEl = document.createElement("div");
  }

  public async init(language: string, text: string) {
    this.Monaco = await import("monaco-editor");

    this.editor = this.Monaco.editor.create(this.divEl, {
      value: text,
      language,
    });

    return this;
  }

  public ready(): boolean {
    return Boolean(this.editor);
  }

  public dispose() {
    if (this.editor) this.editor.dispose();
  }
}
