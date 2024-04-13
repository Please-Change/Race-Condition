import type { EditorImpl } from "@lib/EditorImpl";

export class PowerUp {
  public apply(_editor: EditorImpl) {}

  public update(_editor: EditorImpl): boolean {
    return true;
  }

  public json(): string {
    return "";
  }

  public type(): PowerUpType {
    return PowerUpType.None;
  }

  public destroy(_editor: EditorImpl) {}

  public icon(): string {
    return "";
  }
}

// Alphabetically sorted variable names

export enum PowerUpType {
  None,
  VoiceToText,
  CharSwap,
  KeyboardSwap,
  ExiledLetters,
  SocialDistancing,
  ChangeLanguage,
  KeyboardLag,
  LightMode,
  LowPowerMode,
  FullReset,
  Blinded,
  BadTrip,
  Hints,
  NoShortcuts,
}
