import Vue from 'vue';
import RandomTask from '../components/RandomTask.vue';

console.log('Hello world!');

const app = new Vue({
	render: (h) => {
		return h(RandomTask);
	},
});
app.$mount('.app-mount');
