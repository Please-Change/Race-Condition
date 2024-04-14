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
    throw new Error("Apples");
  }

  public destroy(_: Game) {}

  public icon(): string {
    return "";
  }
}

// Alphabetically sorted variable names

export enum PowerUpType {
  VoiceToText = "Mic",
  CharSwap = "Error",
  KeyboardSwap = "Swap",
  ExiledLetters = "NoE",
  SocialDistancing = "TabToSpace",
  ChangeLanguage = "SwapLang",
  KeyboardLag = "Lag",
  LightMode = "LightMode",
  LowPowerMode = "LowBat",
  FullReset = "Reset",
  Blinded = "Blind",
  BadTrip = "RandomLocation",
  Hints = "Hint",
  NoShortcuts = "NoShortcut",
}
