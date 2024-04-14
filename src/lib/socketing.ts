import type { PowerUpType } from "./powerup";
import type { Language, Settings } from "./types";

export type Message =
  | {
      action: Action.ChangeReady;
      data: ReadyStatus;
    }
  | {
      action: Action.ChangeSettings;
      data: Settings;
    }
  | {
      action: Action.UsePowerUp;
      data: PowerUpType;
    }
  | { action: Action.Submit; data: { program: string; language: Language } }
  | {
      action: Action.StatusChanged;
      data:
        | { status: GameStatus.End; success: boolean }
        | { status: GameStatus.Active | GameStatus.Pending };
    }
  | { action: Action.StatusRequest }
  | { action: Action.SubmitFailed; data: string }
  | { action: Action.PlayerCountUpdate; data: number };

export enum ReadyStatus {
  Ready = "ready",
  Active = "active",
  Waiting = "waiting",
}

export enum Action {
  ChangeReady = "ready",
  ChangeSettings = "config",
  PlayerCountUpdate = "players",
  StatusChanged = "status",
  StatusRequest = "status_req",
  Submit = "submit",
  SubmitFailed = "submit_failed",
  UsePowerUp = "use",
}

export enum GameStatus {
  Pending = "pending",
  Active = "active",
  End = "end", // accomaneed by if the user has won
}

type Listener = (message: Message) => boolean | void;

export class Client {
  socket: WebSocket;
  listeners: Record<number, Listener>;
  nextId: number;

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.listeners = [];
    this.nextId = 0;

    this.socket.onopen = () => {
      console.log("[open] Connection established");
    };

    this.socket.onmessage = event => {
      // TODO: Check event.data is json
      console.log(`[message] [received] ${event.data}`);
      for (const l of Object.values(this.listeners)) {
        const handled = l(JSON.parse(event.data) as Message);
        if (handled) break;
      }
    };

    this.socket.onclose = event => {
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`,
        );
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.error("[close] Connection died");
      }
    };

    this.socket.onerror = error => {
      console.log(`[error] ${error}`);
    };
  }

  addListener(listener: Listener): number {
    const currId = this.nextId;
    this.nextId++;

    this.listeners[currId] = listener;

    return currId;
  }

  removeListener(id: number) {
    delete this.listeners[id];
  }

  send(message: Message) {
    const info = JSON.stringify(message);
    console.log(`[message] [sent] ${info}`);
    this.socket.send(info);
  }
}
