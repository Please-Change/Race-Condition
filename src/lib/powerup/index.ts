import type { Game } from "@lib/game";

export class PowerUp {
  public id: string;
  private static nextId = 0;

  constructor() {
    this.id = `powerup-${PowerUp.nextId}-${Math.floor(Math.random() * 1000)}`;
    PowerUp.nextId++;
  }

  public apply(_: Game) {}

  /**
   * @returns Whether to destroy the powerup next tick.
   */
  public update(_: Game): boolean {
    return false;
  }

  public type(): PowerUpType {
    throw new Error("Apples");
  }

  public destroy(_: Game) {}
}

// Alphabetically sorted variable names

export enum PowerUpType {
  VoiceToText = "Mic",
  CharSwap = "Error",
  KeyboardSwap = "Swap",
  ExiledLetters = "NoE",
  SocialDistancing = "SocialDistancing",
  TabToSpace = "TabToSpace",
  ChangeLanguage = "SwapLang",
  KeyboardLag = "Lag",
  LightMode = "LightMode",
  LowPowerMode = "LowBat",
  FullReset = "Reset",
  Blinded = "Blind",
  BadTrip = "RandomLocation",
  NoShortcuts = "NoShortcut",
}
