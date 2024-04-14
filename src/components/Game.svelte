<script lang="ts">
  import GameEditor from "./GameEditor.svelte";
  import Bottle from "./Bottle.svelte";
  import SvelteMarkdown from "svelte-markdown";
  import { SpeechCapture } from "../lib/speech";
  import { Game, State } from "../lib/game";
  import { Action, ReadyStatus, type Client } from "../lib/socketing";
  import type { Language, Problem } from "../lib/types";
  import { derived, writable } from "svelte/store";

  export let ws: Client;
  export let language: Language;
  export let problem: Problem;

  SpeechCapture.init();
  SpeechCapture.listenForWord(console.log);

  const treeToString = writable("");

  const game = new Game(ws, language, problem);
  game
    .init()
    .then(async () => {
      console.log("Loaded GAME!");
      game.tree.subscribe(tree => {
        treeToString.set(tree.rootNode.toString());
      });
    })
    .catch(console.error);

  const bottles = game.bottles;
  const powerups = game.powerUps;

  (window as any).game = game;
</script>

{#if game.state === State.Won}
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
{:else if game.state === State.Lost}
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
    <div class="flex border-4 gap-2 py-2 bg-black mb-6">
      <div class="h-16"></div>
      {#each $powerups as p (p.id)}
        <div class="flex-none rounded-md bg-white h-16">
          <img
            alt=""
            src="/bottle_icons/{p.type()}.webp"
            class="w-16 h-16"
            style="image-rendering: pixelated;"
          />
        </div>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-2 w-full flex-grow">
    <div class="h-full w-full relative">
      <GameEditor editor={game.editor} />
    </div>
    <div class="overflow-y-auto">
      <article
        class="p-2 prose prose-headings:m-0 prose-headings:font-brand prose-p:my-1 prose-li:my-0 prose-ul:my-1 prose-ol:my-1 prose-headings:text-white prose-invert"
      >
        <SvelteMarkdown source={$treeToString} />
      </article>
      <div class="w-full px-6 flex gap-2">
        {#if game.state === State.Submitting}<img
            alt="O"
            class="bg-white rounded-md aspect-square flex-none w-32"
            src="/loading.gif"
            style="image-rendering: pixelated;"
          />{/if}

        <button
          on:click={() => {
            game.submit();
          }}
          disabled={game.state === State.Submitting}
          class="flex-auto font-brand font-bold text-2xl border-4 border-white hover:bg-white disabled:hover:bg-black disabled:hover:text-white hover:text-black rounded-md"
          >Submit
        </button>
      </div>
      {#if game.submitError}
        <pre
          class="mx-6 p-3 mt-3 rounded-md font-mono text-md bg-red-900">{game.submitError}</pre>
      {/if}
    </div>
  </div>
{/if}
