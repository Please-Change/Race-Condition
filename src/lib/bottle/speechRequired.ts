import type { PowerUp } from "@lib/powerup";
import { PowerUpBottle } from ".";
import { SpeechCapture } from "../speech";

export const ALLOWED_WORDS = [
  "banana",
  "apple",
  "fuck",
  "you",
  "myself",
  "orange",
  "accessory",
  "anemone",
  "choir",
  "February",
  "onomatopoeia",
  "click",
];

export class SpeechBottle extends PowerUpBottle {
  public words: string[];
  private listenId: number | undefined;

  constructor(isForMe: boolean, powerUp: PowerUp) {
    super(isForMe, powerUp);

    this.words = [];
    const numOfLetters = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numOfLetters; i++) {
      this.words.push(randomWord());
    }
  }

  public init() {
    this.listenId = SpeechCapture.listenForWord(word => {
      if (this.words.length > 0) {
        const next = this.words[0];
        if (word === next) {
          this.words.shift();
          if (this.words.length === 0) this.snatched = true;
        }
      }
    });
  }

  public destroy() {
    if (this.listenId) SpeechCapture.removeWordListener(this.listenId);
  }

  public label(): string {
    return this.words.join(" ");
  }
}

function randomWord() {
  const i = Math.floor(Math.random() * (ALLOWED_WORDS.length - 1));
  return ALLOWED_WORDS[i];
}
