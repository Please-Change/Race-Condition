<script lang="ts">
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import Counter from "./components/Counter.svelte";
  import Game from "./components/Game.svelte";
  import { Action, Client, GameStatus, ReadyStatus } from "./lib/socketing";
  import { Language, Problem, type Settings } from "./lib/types";

  const ws = new Client("ws://localhost:5174/game");

  let playerCount = 0;
  let status = ReadyStatus.Waiting;
  let gameStatus = GameStatus.Pending;

  // let status = ReadyStatus.Active;
  // let gameStatus = GameStatus.Active;

  let settings: Settings = {
    language: Language.JavaScript,
    problem: Problem.FizzBuzz,
  };

  ws.addListener(message => {
    switch (message.action) {
      case Action.PlayerCountUpdate:
        playerCount = message.data;
        break;
      case Action.StatusChanged:
        if (status === ReadyStatus.Ready || status === ReadyStatus.Active) {
          gameStatus = message.data.status;
        }
        break;
      case Action.ChangeReady:
        status = message.data;
        break;
      case Action.ChangeSettings:
        settings = message.data;
        break;
    }
  });

  function joinMatch() {
    ws.send({ action: Action.ChangeReady, data: ReadyStatus.Ready });
  }

  function startMatch() {
    ws.send({
      action: Action.StatusChanged,
      data: { status: GameStatus.Active },
    });
  }

  function updateSettings() {
    ws.send({
      action: Action.ChangeSettings,
      data: settings,
    });
  }
</script>

<main class="w-screen h-screen p-0 m-0 bg-black text-white flex flex-col">
  <h2 class="font-brand text-2xl font-bold">Race Condition</h2>
  {#if status === ReadyStatus.Waiting}
    <div class="ml-6">
      <button
        on:click={joinMatch}
        class="font-brand text-xl border border-white rounded-md p-2 mt-2"
        >Join match</button
      >
    </div>
  {:else if status === ReadyStatus.Ready}
    <div class="ml-6">
      <h3 class="font-brand text-xl">{playerCount} active players</h3>
      <div>
        <select
          bind:value={settings.language}
          on:change={updateSettings}
          class="rounded-md border border-white p-2 w-48 font-brand text-lg bg-black"
        >
          {#each Object.values(Language) as lang}
            <option value={lang}>{lang}</option>
          {/each}
        </select>

        <select
          bind:value={settings.problem}
          on:change={updateSettings}
          class="rounded-md border border-white p-2 w-48 font-brand text-lg bg-black"
        >
          {#each Object.values(Problem) as prob}
            <option value={prob}>{prob}</option>
          {/each}
        </select>
      </div>
      <button
        on:click={startMatch}
        class="font-brand text-xl border border-white rounded-md p-2 mt-2"
        >Start match</button
      >
    </div>
  {:else if gameStatus == GameStatus.Active}
    <Game {ws} language={Language.JavaScript} problem={Problem.FizzBuzz} />
  {/if}
</main>
