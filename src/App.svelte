<script lang="ts">
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import Counter from "./components/Counter.svelte";
  import GameEditor from "./components/GameEditor.svelte";
  import { SpeechCapture } from "./lib/speech";
  import { Game } from "./lib/game";

  SpeechCapture.init();
  SpeechCapture.listenForWord(console.log);

  const game = new Game("typescript");
  game.init().catch(console.error);
</script>

<main>
  <h2 class="font-brand text-2xl font-bold">Race Condition</h2>
  <GameEditor editor={game.editor} />
</main>
