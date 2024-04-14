<script lang="ts">
    import type { PowerUpBottle } from "../lib/bottle";
    import { Motion, useAnimation } from "svelte-motion";

    export let bottle: PowerUpBottle;

    const isForMe = () => {
        if (bottle.isForMe) {
            return "green"
        } else {
            return "red"
        }
    };
</script>


<button on:click={() => {bottle.onClick()}} style="position: absolute; background: {isForMe()}; z-index: 8; top: {bottle.position[1]}px; left: {bottle.position[0]}px ">
    <img alt = "O" src={bottle.icon()}/>
</button>