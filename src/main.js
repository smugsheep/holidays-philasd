import App from './App.svelte';
import Options from  './svelte/Options.svelte'
import Footer from './svelte/Footer.svelte'

const app = new App({
	target: document.getElementById('dates'),
});

const options = new Options({
	target: document.getElementById('options'),
})

const footer = new Footer({
	target: document.getElementById('footer'),
})

export default app;