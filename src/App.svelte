<script lang="ts">
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import Counter from "./components/Counter.svelte";
  import Editor from "./components/Editor.svelte";
  import type { EditorImpl } from "@lib/editor";

  let editor: EditorImpl;
</script>

<main>
  <h2 class="font-brand text-2xl font-bold">Race Condition</h2>
  <Editor
    language="typescript"
    initDocument={[
      "function hello() {",
      "  console.log('hello world');",
      "}",
    ].join("\n")}
    bind:editor
  />
</main>
