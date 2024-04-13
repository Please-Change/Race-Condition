<script lang="ts">
  import type { EditorImpl } from "@lib/editor";

  export let editor: EditorImpl;
</script>

<div bind:this={editor.divEl} class="h-screen" />
