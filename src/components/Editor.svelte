<script lang="ts">
  export let language: string;
  export let initDocument: string;

  import { onMount } from "svelte";
  import { EditorImpl } from "../lib/editor";

  export let editor: EditorImpl = new EditorImpl();

  onMount(() => {
    editor.init(language, initDocument).catch(console.error);
    return () => {
      editor.dispose();
    };
  });
</script>

<div bind:this={editor.divEl} class="h-screen" />
