import type { PowerUpType } from "@lib/powerup";

export class PowerUpBottle {
  public isForMe: boolean;
  public powerUp: PowerUpType;
  public position: [number, number];
  public snatched: boolean;
  public id: number;
  private speed: number;
  private static nextId: number = 0;

  constructor(isForMe: boolean, powerUp: PowerUpType) {
    this.isForMe = isForMe;
    this.powerUp = powerUp;
    this.snatched = false;
    this.speed = Math.random() * 2 + 1;
    this.id = PowerUpBottle.nextId;
    PowerUpBottle.nextId++;

    const xpos = Math.floor(Math.random() * (window.innerWidth - 100)) + 20;
    this.position = [xpos, -100];
  }

  public update(): boolean {
    this.position[1] += this.speed;
    return this.position[1] >= window.innerHeight - 150 || this.snatched;
  }

  public init() {}
  public destroy() {}
  public onClick() {}

  public label(): string {
    return "";
  }

  public icon(): string {
    return `/bottle_icons/${this.powerUp}.webp`;
  }
}
