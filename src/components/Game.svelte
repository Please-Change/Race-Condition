<script lang="ts">
  import GameEditor from "./GameEditor.svelte";
  import Bottle from "./Bottle.svelte";
  import Wall from "./Wall.svelte";
  import SvelteMarkdown from "svelte-markdown";
  import { SpeechCapture } from "../lib/speech";
  import { Game } from "../lib/game";
  import type { Client } from "../lib/socketing";
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

{#each $bottles as b (b.id)}
  <Bottle bottle={b} />
{/each}
<Wall wall = {powerups}/>
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
