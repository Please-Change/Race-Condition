<script lang="ts">
  import type { EditorImpl } from "@lib/EditorImpl";
  import { onMount } from "svelte";

  export let editor: EditorImpl;

  onMount(() => {
    return () => {
      editor.dispose();
    };
  });
</script>

<div class="relative w-full h-full">
  <div bind:this={editor.divEl} style="min-height: 100% !important" />
</div>
