import { EditorImpl } from "./editor";
import { PowerUp } from "./powerup";
import type { PowerUpBottle } from "./bottle";
import { SpeechBottle } from "./bottle/speechRequired";

export class Game {
  public editor: EditorImpl;
  private language: string;
  private powerUps: PowerUp[];
  private bottles: PowerUpBottle[];
  private running: boolean;

  constructor(startLanguage: string) {
    this.editor = new EditorImpl();
    this.language = startLanguage;
    this.powerUps = [];
    this.bottles = [];
    this.running = true;
  }

  public async init() {
    await this.editor.init(this.language, "");
    window.requestAnimationFrame(() => {
      this.loop();
    });

    // Test code

    // const bottle = new SpeechBottle(false, new PowerUp());
    // this.addBottle(bottle);
    // console.log(bottle.label());
  }

  public update() {
    this.powerUps = this.powerUps.filter((p, i) => {
      if (p.update(this.editor)) {
        p.destroy(this.editor);
        return false;
      }
      return true;
    });

    this.bottles = this.bottles.filter(b => {
      if (b.update()) {
        if (b.snatched) {
          console.log(`snatched: ${b.label()}`);
          if (b.isForMe) {
            this.addPowerUp(b.powerUp);
          } else {
            this.sendPowerUp(b.powerUp);
          }
        } else {
          console.log(`destroyed: ${b.label()}`);
        }
        b.destroy();
        return false;
      }
      return true;
    });
  }

  public addBottle(b: PowerUpBottle) {
    b.init();
    this.bottles.push(b);
  }

  public addPowerUp(p: PowerUp) {
    p.apply(this.editor);
    this.powerUps.push(p);
  }

  public sendPowerUp(p: PowerUp) {
    // TODO: send via websocket to other person
  }

  private loop() {
    this.update();

    if (this.running) {
      window.requestAnimationFrame(() => {
        this.loop();
      });
    }
  }
}
