//  5. Variable letters must be separated by _
//   - Will flag all variables where characters aren't separated by '_'s as not a variable
//   - 2 minutes

import type { Game } from "@lib/game";
import { PowerUp, PowerUpType } from "@lib/powerup";
import { get, type Unsubscriber } from "svelte/store";

import type Monaco from "monaco-editor";

const SOCIALLY_DISTANCED = /^[a-zA-Z0-9](\_[a-zA-Z0-9])*$/i;
const MESSAGE = `Socially Distancing\nYour variable names be ASCII, and seperated by underscores!\n"abc" => "a_b_c"`;
export class SocialDistancing extends PowerUp {
  public apply(g: Game): void {
  }
  
  public update(g: Game): boolean {
    const Monaco = g.editor.Monaco!;
  
    const errors = get(g.variables)
      .filter(variable => !variable.text.match(SOCIALLY_DISTANCED))
      .map(
        node =>
          ({
            startColumn: node.startPosition.column + 1,
            startLineNumber: node.startPosition.row + 1,
            endColumn: node.endPosition.column + 1,
            endLineNumber: node.endPosition.row + 1,
            severity: Monaco.MarkerSeverity.Error,
            message: MESSAGE,
            code: {
              value: "race-condition/social-distancing",
              target: Monaco.Uri.parse(
                "race://powerups/social-distancing/details",
              ),
            },
          }) as Monaco.editor.IMarkerData,
      );
  
    g.markers = [...g.markers, ...errors];
    return false;
  }

  public type(): PowerUpType {
    return PowerUpType.SocialDistancing;
  }

  public destroy(_: Game): void {}
}
