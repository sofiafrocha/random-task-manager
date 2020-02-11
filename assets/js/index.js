import Vue from 'vue';
import contenteditable from 'vue-contenteditable';
import RandomTask from '../components/RandomTask.vue';

Vue.use(contenteditable);

console.log('Hello world!');

const app = new Vue({
	render: (h) => {
		return h(RandomTask);
	},
});
app.$mount('.app-mount');
