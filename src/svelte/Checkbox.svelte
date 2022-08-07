<script>
    export let checkbox;
</script>

<div class="checkbox">
    <label>
        <input type={checkbox.type} on:click={checkbox.store.flip}> {checkbox.displayMsg}
    </label>
</div>

<style>
    .checkbox {
        margin: 0.4em 0;
    }
    label, input {
        cursor: pointer;
    }
</style>