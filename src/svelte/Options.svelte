<script>
    import { includePast, onlySchoolDays } from '../js/stores.js';
	import Checkbox from './Checkbox.svelte';

	let optionsList = new Array();

	class Option {
		constructor(type, store, displayMsg) {
			this.type = type; // str
			this.store = store; 
			this.displayMsg = displayMsg;
		}
	}

	optionsList.push(new Option("checkbox", includePast, "show past events"));
	optionsList.push(new Option("checkbox", onlySchoolDays, "calculate only school days"));
</script>

{#each optionsList as option}
	<Checkbox checkbox={option}></Checkbox>
{/each}