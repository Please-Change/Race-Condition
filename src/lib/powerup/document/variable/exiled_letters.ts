//  4. No e's in variables
//   - Will flag all variables with an 'e' in it as not a variable
//   - Permanent

import type { Game } from "@lib/game";
import { PowerUp, PowerUpType } from "@lib/powerup";
import { get, type Unsubscriber } from "svelte/store";

import type Monaco from "monaco-editor";
import type Parser from "web-tree-sitter";


const CONTAINS_E = /e/i;
const MESSAGE = `Exhiled Letter\nYour variable names must not contain an \`e\`!`;
export class ExiledVariables extends PowerUp {

  public apply(g: Game): void {}
  
  public update(g: Game): boolean {
    const Monaco = g.editor.Monaco!;
    const vars = get(g.variables);
    const errors = vars
      .filter(variable => variable.text.match(CONTAINS_E))
      .map(node => ({
        startColumn: node.startPosition.column + 1,
        startLineNumber: node.startPosition.row + 1,
        endColumn: node.endPosition.column + 1,
        endLineNumber: node.endPosition.row + 1,
        severity: Monaco.MarkerSeverity.Error,
        message: MESSAGE,
        code: {
          value: "race-condition/exhiled-letter",
          target: Monaco.Uri.parse("race://powerups/exhiled-letters/details"),
        },
      }) as Monaco.editor.IMarkerData);
    
    g.markers = [...g.markers, ...errors];
    return false;
  }


  public type(): PowerUpType {
    return PowerUpType.ExiledLetters;
  }

  public destroy(_: Game): void {}
}