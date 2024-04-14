<script lang="ts">
  import { Game } from "./lib/game";
  import GameEditor from "./components/GameEditor.svelte";
  import { SpeechCapture } from "./lib/speech";
  import { Client } from "./lib/socketing";
  import Bottle from "./components/Bottle.svelte";
  import SvelteMarkdown from "svelte-markdown";
  import { derived, writable } from "svelte/store";

  SpeechCapture.init();
  // SpeechCapture.listenForWord(console.log);

  const ws = new Client("ws://localhost:5174");

  const treeToString = writable("");

  const game = new Game(ws, "javascript");
  game.init().then(async () => {
    console.log("Loaded GAME!");
    game.tree.subscribe(tree => {
      treeToString.set(tree.rootNode.toString());
    });
  });
  const bottles = game.bottles;
  (window as any).game = game;
</script>

<main class="w-screen h-screen p-0 m-0 bg-black text-white flex flex-col">
  {#each $bottles as b}
    <Bottle bottle={b} />
  {/each}
  <h2 class="font-brand text-2xl font-bold">Race Condition</h2>
  <div class="grid grid-cols-2 w-full flex-grow">
    <div class="h-full w-full relative">
      <GameEditor editor={game.editor} />
    </div>
    <article
      class="p-2 prose prose-headings:m-0 prose-headings:font-brand prose-p:my-1 prose-li:my-0 prose-ul:my-1 prose-ol:my-1 prose-headings:text-white prose-invert"
    >
      <SvelteMarkdown source={$treeToString} />
    </article>
  </div>
</main>
