import { PowerUp, PowerUpType } from ".";
import { Bad_trip } from "./bad_trip";
import { Reset } from "./full_reset";
import { KeyboardLag } from "./keyboard/keyboard_lag";
import { KeyboardSwap } from "./keyboard/keyboard_swap";
import { NoShortcuts } from "./keyboard/no_shortcuts";
import { VoiceToText } from "./keyboard/voice_to_text";
import { BlackScreen } from "./screen/blinded";
import { LowPowerMode } from "./screen/low_power_mode";

export function createPowerUp(type: PowerUpType): PowerUp {
  // TODO: Finish this
  switch (type) {
    case PowerUpType.BadTrip:
      return new Bad_trip();
    case PowerUpType.Blinded:
      return new BlackScreen();
    case PowerUpType.FullReset:
      return new Reset();
    case PowerUpType.LowPowerMode:
      return new LowPowerMode();
    case PowerUpType.VoiceToText:
      return new VoiceToText();
    case PowerUpType.KeyboardLag:
      return new KeyboardLag();
    case PowerUpType.KeyboardSwap:
      return new KeyboardSwap();
    case PowerUpType.NoShortcuts:
      return new NoShortcuts();
  }
  return new PowerUp();
}
