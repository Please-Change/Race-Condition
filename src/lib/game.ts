import { PowerUp, PowerUpType } from "./powerup";
import { PowerUpBottle } from "./bottle";
import { EditorImpl } from "./EditorImpl";
import { SpeechBottle } from "./bottle/speechRequired";
import { Action, GameStatus, type Client, type Message } from "./socketing";
import { createPowerUp } from "./powerup/create";
import { StaticAnalysis } from "./analyze";
import Parser from "web-tree-sitter";
import _ from "lodash";
import {
  writable,
  type Readable,
  type Writable,
  derived,
  get,
} from "svelte/store";
import type { Language, Problem } from "./types";
import { ClickBottle } from "./bottle/clickRequired";
import { LetterBottle } from "./bottle/letterRequired";
import { ExiledVariables } from "./powerup/document/variable/exiled_letters";
import type Monaco from "monaco-editor";
import { SocialDistancing } from "./powerup/document/variable/social_distancing";
import { ChangeProgrammingLanguage } from "./powerup/document/change_language";
import { CharacterSwap } from "./powerup/document/char_swap";
import { SwapTabsSpaces } from "./powerup/document/swap_tabs_spaces";

const isVariableBased = (p: PowerUp) =>
  p.type() === PowerUpType.SocialDistancing ||
  p.type() === PowerUpType.ExiledLetters;

const POSSIBLE_AUDIO = ["cash_register.mp3", "fun.wav", "intense.ogg"];

export enum State {
  Building,
  Running,
  Submitting,
  Won,
  Lost,
}

export class Game {
  public editor: EditorImpl;
  public language: Writable<Language>;
  public tsLanguage: Readable<Parser.Language> =
    undefined as unknown as Readable<Parser.Language>;
  private parser: Readable<Parser> = undefined as unknown as Readable<Parser>;
  public tree: Readable<Parser.Tree> =
    undefined as unknown as Readable<Parser.Tree>;
  public variables: Readable<Parser.SyntaxNode[]> =
    undefined as unknown as Readable<Parser.SyntaxNode[]>;
  public markers: Monaco.editor.IMarkerData[] = [];

  public submitError: Writable<string>;

  private problem: Problem;
  public powerUps: Writable<PowerUp[]> = writable([]);
  public bottles: Writable<PowerUpBottle[]> = writable([]);
  public state: Writable<State>;
  private client: Client;
  private wsListenerId: number | undefined;

  private powerUpCountdown: number;

  constructor(ws: Client, startLanguage: Language, problem: Problem) {
    this.editor = new EditorImpl();
    this.language = writable(startLanguage);
    this.problem = problem;
    this.state = writable(State.Building);
    this.problem = problem;

    this.submitError = writable("");
    this.powerUpCountdown = 0;

    this.client = ws;
  }

  public async init() {
    await this.editor.init(this.language);
    await StaticAnalysis.init();
    const _parser = writable(
      await StaticAnalysis.forLanguage(get(this.language)),
    );

    this.powerUpCountdown = Math.floor(Math.random() * 300 + 150);

    this.language.subscribe(lang => {
      StaticAnalysis.forLanguage(lang).then(parser => _parser.set(parser));
    });

    this.parser = derived(_parser, ([, p]) => p);
    this.tree = derived(
      [this.editor.sourceCode, this.parser],
      ([lines, parser]) =>
        parser.parse((_, position) => {
          let line = lines[position!.row];
          if (line) return line.slice(position!.column);
          return "";
        }),
    );

    this.state.set(State.Running);
    this.parser = derived(_parser, ([, p]) => p);
    this.tsLanguage = derived(_parser, ([l]) => l);

    this.tree = derived(
      [this.editor.sourceCode, this.parser],
      ([lines, parser]) => parser.parse(lines.join("\n")),
    );

    this.variables = derived(
      [this.tree, this.language, this.tsLanguage],
      ([tree, language, tsLanguage]) =>
        _.uniqBy(
          StaticAnalysis.variables(language, tsLanguage, tree).map(
            a => a.captures[0].node,
          ),
          node => node.text,
        ),
    );

    const forVariablePowerUps = derived(
      [this.variables, this.powerUps, this.editor.editor] as const,
      ([_, powerUps, editor]) => {
        return [powerUps, editor] as const;
      },
    );

    forVariablePowerUps.subscribe(([powerUps, editor]) => {
      powerUps.filter(isVariableBased).forEach(p => p.update(this));
      const Monaco = this.editor.Monaco!;
      Monaco.editor.setModelMarkers(
        editor!.getModel()!,
        "race-condition",
        this.markers,
      );
    });

    window.requestAnimationFrame(() => {
      this.loop();
    });

    this.wsListenerId = this.client.addListener(message => {
      this.handleMessage(message);
    });

    // Test code

    // const bottle = new SpeechBottle(false, PowerUpType.BadTrip);
    // this.addBottle(bottle);
    // console.log(bottle.label());
    // this.addPowerUp(PowerUpType.LightMode);
  }

  public destroy() {
    get(this.powerUps).map(p => {
      p.destroy(this);
    });

    get(this.bottles).map(b => {
      b.destroy();
    });

    this.editor.dispose();
    if (this.wsListenerId) this.client.removeListener(this.wsListenerId);
  }

  public update() {
    this.powerUps.update(ps =>
      ps.filter(p => {
        if (p.update(this)) {
          p.destroy(this);
          return false;
        }
        return true;
      }),
    );

    this.markers = [];
    this.powerUps.update(powerUps =>
      powerUps.filter(p => {
        if (isVariableBased(p)) {
          return true;
        }

        if (p.update(this)) {
          p.destroy(this);
          return false;
        }
        return true;
      }),
    );

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

    this.powerUpCountdown--;
    if (this.powerUpCountdown < 0) {
      this.powerUpCountdown = Math.floor(Math.random() * 600 + 150);
      this.genPowerUp();
    }
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

    const sound =
      POSSIBLE_AUDIO[Math.floor(Math.random() * POSSIBLE_AUDIO.length)];

    this.powerUps.update(powerUps => {
      powerUps.push(p);
      return powerUps;
    });

    const audio = new Audio(`/sounds/${sound}`);

    audio.play();

    p.apply(this);
    this.powerUps.update(ps => {
      ps.push(p);
      return ps;
    });
  }

  public sendPowerUp(p: PowerUpType) {
    this.client.send({
      action: Action.UsePowerUp,
      data: p,
    });
  }

  public submit() {
    if (get(this.state) !== State.Submitting && this.editor.editor) {
      this.state.set(State.Submitting);
      this.submitError.set("");
      this.client.send({
        action: Action.Submit,
        data: {
          program: get(this.editor.sourceCode).join("\n"),
          language: get(this.language),
        },
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
          if (message.data.success) {
            console.log("You WON!");
            this.state.set(State.Won);
          } else {
            const audio = new Audio("/sounds/death.wav");
            audio.play();
            this.state.set(State.Lost);
            console.log("You lost :(");
          }
          this.destroy();
        }
        break;
      case Action.SubmitFailed:
        if (get(this.state) === State.Submitting) {
          this.state.set(State.Running);
          this.submitError.set(message.data);
        }
    }
  }

  private loop() {
    this.update();

    if (get(this.state) !== State.Lost && get(this.state) !== State.Won) {
      window.requestAnimationFrame(() => {
        this.loop();
      });
    }
  }

  private genPowerUp() {
    const options = Object.values(PowerUpType);
    const type = options[Math.floor(Math.random() * options.length)];

    const forMe = Math.random() < 0.25;
    const thing = Math.floor(Math.random() * 3);
    let bottle: PowerUpBottle;
    if (thing === 0) {
      bottle = new ClickBottle(forMe, type);
    } else if (thing === 1) {
      bottle = new LetterBottle(forMe, type);
    } else {
      bottle = new SpeechBottle(forMe, type);
    }

    this.addBottle(bottle);
  }

  /// DEBUG

  public _tree() {
    return get(this.tree);
  }
  public _powerUps() {
    return get(this.powerUps);
  }

  public _setLanguage(lang: Language) {
    return this.language.set(lang);
  }

  public _changeLanguage() {
    let a = new ChangeProgrammingLanguage();
    a.apply(this);
    this.powerUps.update(ar => [...ar, a]);
  }

  public _applyExiled() {
    let a = new ExiledVariables();
    a.apply(this);
    this.powerUps.update(ar => [...ar, a]);
  }
  public _appltDistancing() {
    let a = new SocialDistancing();
    a.apply(this);
    this.powerUps.update(ar => [...ar, a]);
  }
  public _characterSwap() {
    let a = new CharacterSwap();
    a.apply(this);
    this.powerUps.update(ar => [...ar, a]);
  }
  public _swapTabsSpaces() {
    let a = new SwapTabsSpaces();
    a.apply(this);
    this.powerUps.update(ar => [...ar, a]);
  }
}
