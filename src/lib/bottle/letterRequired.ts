import type { PowerUpType } from "@lib/powerup";
import { PowerUpBottle } from ".";

export const ALLOWED_LETTERS =
  "abcdefghijklmnopqrstuvwxyz1234567890!\"£$%^&*()'#~]}{[-_/?;:.>'@".split("");

export class LetterBottle extends PowerUpBottle {
  public letters: string[];
  private listenFunc: (e: KeyboardEvent) => void;

  constructor(isForMe: boolean, powerUp: PowerUpType) {
    super(isForMe, powerUp);

    this.letters = [];
    const numOfLetters = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numOfLetters; i++) {
      this.letters.push(randomLetter());
    }

    this.listenFunc = e => {
      if (this.letters.length > 0) {
        const next = this.letters[0];
        if (e.key === next) {
          this.letters.shift();
          if (this.letters.length === 0) this.snatched = true;
        }
      }
    };
  }

  public init() {
    window.addEventListener("keyup", this.listenFunc);
  }

  public destroy() {
    window.removeEventListener("keyup", this.listenFunc);
  }

  public label(): string {
    return this.letters.join(" ");
  }
}

export function randomLetter() {
  const i = Math.floor(Math.random() * (ALLOWED_LETTERS.length - 1));
  return ALLOWED_LETTERS[i];
}
