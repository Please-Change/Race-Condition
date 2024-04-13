import { EditorImpl } from "./editor";
import type { PowerUp } from "./powerup";
import type { PowerUpBottle } from "./bottle";

export class Game {
  public editor: EditorImpl;
  private language: string;
  private powerUps: PowerUp[];
  private bottles: PowerUpBottle[];

  constructor(startLanguage: string) {
    this.editor = new EditorImpl();
    this.language = startLanguage;
    this.powerUps = [];
    this.bottles = [];
  }

  public async init() {
    await this.editor.init(this.language, "");
  }

  public update() {
    this.powerUps = this.powerUps.filter((p, i) => {
      if (p.update(this.editor)) {
        this.removePowerUp(i);
        return false;
      }
      return true;
    });

    this.bottles = this.bottles.filter(b => !b.update());
  }

  public addPowerUp(p: PowerUp) {
    p.apply(this.editor);
    this.powerUps.push(p);
  }

  public removePowerUp(i: number) {
    if (this.powerUps[i]) {
      this.powerUps[i].destroy(this.editor);
      this.powerUps.splice(i, 1);
    }
  }
}
