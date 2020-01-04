import Vue from 'vue';
import CobaiaApp from '../components/CobaiaApp.vue';

console.log('Hello world!');

const app = new Vue({
	render: (h) => {
		return h(CobaiaApp);
	},
});
app.$mount('.app-mount');
