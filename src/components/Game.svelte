<script lang="ts">
  import GameEditor from "./GameEditor.svelte";
  import Bottle from "./Bottle.svelte";
  import SvelteMarkdown from "svelte-markdown";
  import { SpeechCapture } from "../lib/speech";
  import { Game, State } from "../lib/game";
  import { Action, ReadyStatus, type Client } from "../lib/socketing";
  import type { Language, Problem } from "../lib/types";
  import { derived, get, writable } from "svelte/store";

  export let ws: Client;
  export let language: Language;
  export let problem: Problem;

  console.log(language);
  console.log(problem);

  SpeechCapture.init();
  SpeechCapture.listenForWord(console.log);

  const game = new Game(ws, language, problem);
  game
    .init()
    .then(async () => {
      console.log("Loaded GAME!");
    })
    .catch(console.error);

  const languageP = game.language;

  const bottles = game.bottles;
  const powerups = game.powerUps;
  const state = game.state;
  const submitError = game.submitError;
  const task = game.task;

  (window as any).game = game;
</script>

{#if $state === State.Won}
  <div class="w-full px-10">
    <button
      class="bg-green-900 text-center text-xl font-bold font-brand rounded-lg w-full"
      on:click={() => {
        ws.send({ action: Action.ChangeReady, data: ReadyStatus.Waiting });
      }}
    >
      You Won!
    </button>
  </div>
{:else if $state === State.Lost}
  <div class="w-full px-10">
    <button
      class="bg-red-900 text-center text-xl font-bold font-brand rounded-lg w-full"
      on:click={() => {
        ws.send({ action: Action.ChangeReady, data: ReadyStatus.Waiting });
      }}
    >
      You lost, better luck next time!
    </button>
  </div>
{:else}
  {#each $bottles as b (b.id)}
    <Bottle bottle={b} />
  {/each}

  <div class="w-full">
    <div class="flex flex-row h-min-20 h-20 p-2 border-4 gap-2 bg-black mt-5 mb-8 relative content-center">
      <div
        class="bg-white text-black font-brand font-bold px-2 absolute text-md "
        style="translate: -16px calc(-100% - 16px)"
      >
        Power-Ups
      </div>
      {#each $powerups as p, i (i)}
        <div class="rounded-md bg-white h-14">
          <img
            alt=""
            src="/bottle_icons/{p.type()}.webp"
            class="w-14 h-14"
            style="image-rendering: pixelated;"
          />
        </div>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-2 w-full flex-grow">
    <div class="h-full w-full relative">
      <div
        class="bg-black text-white font-brand font-bold px-2 absolute text-md"
        style="translate: 0 calc(-100% - 4px)"
      >
        Editor
      </div>
      <GameEditor editor={game.editor} />
    </div>
    <div class="h-full flex flex-col mt-auto relative">
      <div
        class="text-white font-brand font-bold px-2 absolute text-md"
        style="translate: 0 calc(-100% - 4px)"
      >
        Task
      </div>
      
      <article
        class="p-2 prose prose-headings:m-0 prose-headings:font-brand prose-p:my-1 prose-li:my-0 prose-ul:my-1 prose-ol:my-1 prose-headings:text-white prose-invert"
      >
        <SvelteMarkdown source={$task} />
        <div class="p w-full">
          You are in <strong>{$languageP}</strong>.
        </div>
      </article>
      <div class="w-full px-6 flex gap-2">
        {#if $state === State.Submitting}<img
            alt="O"
            class="bg-white rounded-md aspect-square flex-none w-32"
            src="/loading.gif"
            style="image-rendering: pixelated;"
          />{/if}

        <button
          on:click={() => {
            game.submit();
          }}
          disabled={$state === State.Submitting}
          class="flex-auto font-brand font-bold text-2xl border-4 border-white hover:bg-white disabled:hover:bg-black disabled:hover:text-white hover:text-black rounded-md"
          >Submit
        </button>
      </div>
      {#if $submitError != ""}
        <pre
          class="mx-6 p-3 mt-3 rounded-md font-mono text-md bg-red-900">{$submitError}</pre>
      {/if}
    </div>
  </div>
{/if}
