import { PowerUpBottle } from ".";

export class ClickBottle extends PowerUpBottle {
  public onClick() {
    this.snatched = true;
  }
}
