import { PowerUp, PowerUpType } from "./powerup";
import type { PowerUpBottle } from "./bottle";
import { EditorImpl } from "./EditorImpl";
import { SpeechBottle } from "./bottle/speechRequired";
import { Action, GameStatus, type Client, type Message } from "./socketing";
import { createPowerUp } from "./powerup/create";
import { StaticAnalysis } from "./analyze";
import Parser from "web-tree-sitter";
import {
  writable,
  type Readable,
  type Writable,
  derived,
  readonly,
  get,
} from "svelte/store";

export class Game {
  public editor: EditorImpl;
  private language: Writable<StaticAnalysis.Language>;
  private parser: Readable<Parser> = undefined as unknown as Readable<Parser>;
  public tree: Readable<Parser.Tree> =
    undefined as unknown as Readable<Parser.Tree>;

  public submitError: string;
  public submitting: boolean;

  private powerUps: PowerUp[];
  public bottles: Writable<PowerUpBottle[]>;
  private running: boolean;
  private client: Client;
  private wsListenerId: number | undefined;

  constructor(ws: Client, startLanguage: StaticAnalysis.Language) {
    this.editor = new EditorImpl();
    this.language = writable(startLanguage);
    this.powerUps = [];
    this.bottles = writable([]);
    this.running = true;

    this.submitError = "";
    this.submitting = false;

    this.client = ws;
  }

  public async init() {
    await this.editor.init(this.language);
    await StaticAnalysis.init();
    const _parser = writable(
      await StaticAnalysis.forLanguage(get(this.language)),
    );

    this.language.subscribe(lang => {
      StaticAnalysis.forLanguage(lang).then(parser => _parser.set(parser));
    });

    this.parser = readonly(_parser);
    this.tree = derived(
      [this.editor.sourceCode, this.parser],
      ([lines, parser]) =>
        parser.parse((_, position) => {
          let line = lines[position!.row];
          if (line) return line.slice(position!.column);
          return "";
        }),
    );

    window.requestAnimationFrame(() => {
      this.loop();
    });

    this.wsListenerId = this.client.addListener(message => {
      this.handleMessage(message);
    });

    // Test code

    const bottle = new SpeechBottle(false, PowerUpType.BadTrip);
    this.addBottle(bottle);
    console.log(bottle.label());
  }

  public destroy() {
    this.editor.dispose();
    if (this.wsListenerId) this.client.removeListener(this.wsListenerId);
  }

  public update() {
    this.powerUps = this.powerUps.filter(p => {
      if (p.update(this)) {
        p.destroy(this);
        return false;
      }
      return true;
    });

    this.bottles.update(bottles =>
      bottles.filter(b => {
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
      }),
    );
  }

  public addBottle(b: PowerUpBottle) {
    b.init();
    this.bottles.update(bottles => {
      bottles.push(b);
      return bottles;
    });
  }

  public addPowerUp(type: PowerUpType) {
    const p = createPowerUp(type);

    p.apply(this);
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
        data: get(this.editor.sourceCode).join("\n"),
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

  /// DEBUG

  public _tree() {
    return get(this.tree);
  }

  public _setLanguage(lang: StaticAnalysis.Language) {
    return this.language.set(lang);
  }
}
