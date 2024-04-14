import { PowerUp, PowerUpType } from ".";
import { Reset } from "./full_reset";

export function createPowerUp(type: PowerUpType): PowerUp {
  // TODO: Finish this
  switch (type) {
    case PowerUpType.FullReset:
      return new Reset();
  }
  return new PowerUp();
}
