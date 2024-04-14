<script lang="ts">
    import type { PowerUpBottle } from "../lib/bottle";
    import { PowerUp } from "../lib/powerup";

    export let wall: PowerUp[];
</script>

<div class="flex border-4 rounded-md" style="border-color: black">
    {#each wall as p}
        <div class="flex-none">
            <img alt = "" src={p.type()} class="w-16 h-16" style="image-rendering: pixelated;"/>
        </div>
    {/each}
</div>
