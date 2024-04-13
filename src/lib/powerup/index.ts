import type { Game } from "@lib/game";

export class PowerUp {
  public apply(_: Game) {}

  public update(_: Game): boolean {
    return true;
  }

  public json(): string {
    return "";
  }

  public type(): PowerUpType {
    return PowerUpType.None;
  }

  public destroy(_: Game) {}

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
