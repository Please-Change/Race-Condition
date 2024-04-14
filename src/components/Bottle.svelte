<script lang="ts">
  import type { PowerUpBottle } from "../lib/bottle";

  export let bottle: PowerUpBottle;

  const isForMe = () => {
    if (bottle.isForMe) {
      return "green";
    } else {
      return "red";
    }
  };

  const label = bottle.label();
</script>

<div
  style="position: absolute; z-index: 8; top: {Math.floor(
    bottle.position[1],
  )}px; left: {Math.floor(bottle.position[0])}px "
>
  <div class="flex-col">
    <div class="flex place-content-center">
      <button
        on:click={() => {
          bottle.onClick();
        }}
        class="border-4 rounded-md bg-white w-16"
        style="border-color: {isForMe()};"
      >
        <img
          alt="O"
          src={bottle.icon()}
          class="w-16 h-16"
          style="image-rendering: pixelated;"
        />
      </button>
    </div>
    {#if label != ""}
      <p class="text-black bg-white px-2 rounded-md mt-2">{label}</p>
    {/if}
  </div>
</div>
