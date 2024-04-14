import { PowerUp, PowerUpType } from ".";
import { Bad_trip as BadTrip } from "./bad_trip";
import { ChangeProgrammingLanguage } from "./document/change_language";
import { CharacterSwap } from "./document/char_swap";
import { SwapTabsSpaces } from "./document/swap_tabs_spaces";
import { ExiledVariables } from "./document/variable/exiled_letters";
import { SocialDistancing } from "./document/variable/social_distancing";
import { Reset } from "./full_reset";
import { KeyboardLag } from "./keyboard/keyboard_lag";
import { KeyboardSwap } from "./keyboard/keyboard_swap";
import { NoShortcuts } from "./keyboard/no_shortcuts";
import { VoiceToText } from "./keyboard/voice_to_text";
import { BlackScreen } from "./screen/blinded";
import { LightMode } from "./screen/light_mode";
import { LowPowerMode } from "./screen/low_power_mode";

export function createPowerUp(type: PowerUpType): PowerUp {
  // TODO: Finish this
  switch (type) {
    case PowerUpType.BadTrip:
      return new BadTrip();
    case PowerUpType.ExiledLetters:
      return new ExiledVariables();
    case PowerUpType.SocialDistancing:
      return new SocialDistancing();
    case PowerUpType.ChangeLanguage:
      return new ChangeProgrammingLanguage();
    case PowerUpType.CharSwap:
      return new CharacterSwap();
    case PowerUpType.TabToSpace:
      return new SwapTabsSpaces();
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
    case PowerUpType.LightMode:
      return new LightMode();
    case PowerUpType.CharSwap:
      return new CharacterSwap();
    case PowerUpType.TabToSpace:
      return new SwapTabsSpaces();
    case PowerUpType.ChangeLanguage:
      return new ChangeProgrammingLanguage();
    case PowerUpType.ExiledLetters:
      return new ExiledVariables();
    case PowerUpType.SocialDistancing:
      return new SocialDistancing();
  }
  return new PowerUp();
}
