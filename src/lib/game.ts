import { EditorImpl } from "./editor";
import { PowerUp, PowerUpType } from "./powerup";
import type { PowerUpBottle } from "./bottle";
import { SpeechBottle } from "./bottle/speechRequired";
import { Action, GameStatus, type Client, type Message } from "./socketing";
import { createPowerUp } from "./powerup/create";

export class Game {
  public editor: EditorImpl;
  public submitError: string;
  public submitting: boolean;

  private language: string;
  private powerUps: PowerUp[];
  private bottles: PowerUpBottle[];
  private running: boolean;
  private client: Client;
  private wsListenerId: number | undefined;

  constructor(ws: Client, startLanguage: string) {
    this.editor = new EditorImpl();
    this.language = startLanguage;
    this.powerUps = [];
    this.bottles = [];
    this.running = true;

    this.submitError = "";
    this.submitting = false;

    this.client = ws;
  }

  public async init() {
    await this.editor.init(this.language, "");
    window.requestAnimationFrame(() => {
      this.loop();
    });

    this.wsListenerId = this.client.addListener(message => {
      this.handleMessage(message);
    });

    // Test code

    // const bottle = new SpeechBottle(false, PowerUpType.None);
    // this.addBottle(bottle);
    // console.log(bottle.label());
  }

  public destroy() {
    this.editor.dispose();
    if (this.wsListenerId) this.client.removeListener(this.wsListenerId);
  }

  public update() {
    this.powerUps = this.powerUps.filter(p => {
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

  public addPowerUp(type: PowerUpType) {
    const p = createPowerUp(type);

    p.apply(this.editor);
    this.powerUps.push(p);
  }

  public sendPowerUp(p: PowerUpType) {
    this.client.send({
      action: Action.UsePowerUp,
      data: p,
    });
  }

  public submit() {
    if (!this.submitting && this.editor.editor) {
      this.submitting = true;
      this.submitError = "";
      this.client.send({
        action: Action.Submit,
        data: this.editor.editor.getValue(),
      });
    }
  }

  private handleMessage(message: Message) {
    switch (message.action) {
      case Action.UsePowerUp:
        this.addPowerUp(message.data);
        break;
      case Action.StatusChanged:
        if (message.data.status === GameStatus.End) {
          // TODO: end animation + destroy

          if (message.data.success) {
            console.log("You WON!");
          } else {
            console.log("You lost :(");
          }
        }
        break;
      case Action.SubmitFailed:
        if (this.submitting) {
          this.submitting = false;
          this.submitError = message.data;
        }
    }
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
