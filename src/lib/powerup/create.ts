import { PowerUp, PowerUpType } from ".";
import { Reset } from "./full_reset";
import { BlackScreen } from "./screen/blinded";
import { LowPowerMode } from "./screen/low_power_mode";

export function createPowerUp(type: PowerUpType): PowerUp {
  // TODO: Finish this
  switch (type) {
    case PowerUpType.Blinded:
      return new BlackScreen;
    case PowerUpType.FullReset:
      return new Reset();
    case PowerUpType.LowPowerMode:
      return new LowPowerMode;
  }
  return new PowerUp();
}
