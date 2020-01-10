<template>
	<div class="a-RandomTask">
		<!-- h1>Random Task Manager</h1>

		<small @click="resetData">reset</small -->

		<!-- form @submit.prevent="addTask">
			<input
				id=""
				v-model="newTaskText"
				type="text"
				name="new_task"
			>
			<button type="submit">
				Add task
			</button>
		</form -->

		<ol class="c-TaskList">
			<li
				v-for="(task, index) in tasks"
				:key="index"
				:class="{ 'is-done': task.status === 'done'}"
				class="c-ListItem"
			>
				<span
					v-for="emoji in task.pomodoros"
					:key="emoji"
				>🍅</span>
				<span class="a-RandomTask__task__text">
					{{ task.text }}
				</span>
			</li>
		</ol>

		<!-- hr -->

		<button
			class="c-Button"
			:disabled="!hasAvailableTask"
			@click="showNextTask"
		>
			Get next task
		</button>

		<div
			v-show="selectedTaskIndex != null"
			class="a-RandomTask__next"
		>
			<h2>Your next task:</h2>
			<cite v-if="selectedTaskIndex != null">
				{{ tasks[selectedTaskIndex].text }}
			</cite>
			<br>
			<br>

			<div>
				<button @click="finishTask">
					Finished the task
				</button>
				<button @click="duplicateTask">
					Didn't finish the task
				</button>
			</div>
		</div>
	</div>
</template>

<script>
const LINES = 32;

export default {
	name: 'ARandomTask',
	data() {
		return {
			newTaskText: '',
			showNextTaskFollowup: false,
			tasks: [],
			selectedTaskIndex: null,
		};
	},
	computed: {
		availableTasks() {
			return this.tasks.filter((task) => {
				return task.status === 'to-do';
			});
		},
		hasAvailableTask() {
			return this.availableTasks.length > 0;
		},
	},
	beforeMount() {
		this.loadStateFromLocalStorage();
	},
	methods: {
		showNextTask() {
			if (this.hasAvailableTask) {
				let nextTaskIndex = this.getNextTaskIndex();

				while (this.tasks[nextTaskIndex].status === 'done') {
					console.log('🚨 i got a done task, trying the one below');

					nextTaskIndex += 1;

					if (nextTaskIndex === this.tasks.length) {
						nextTaskIndex = 0;
					}
				}

				this.selectedTaskIndex = nextTaskIndex;
			}

			console.log('selectedTaskIndex', this.selectedTaskIndex);
		},
		getNextTaskIndex() {
			let randomInt = Math.random() * LINES;
			randomInt = Math.round(randomInt);

			if (randomInt < this.tasks.length) {
				return randomInt;
			}
			return randomInt % this.tasks.length;
		},
		addPomodoro() {
			this.tasks[this.selectedTaskIndex].pomodoros += 1;
		},
		finishTask() {
			this.addPomodoro();
			this.tasks[this.selectedTaskIndex].status = 'done';
			this.selectedTaskIndex = null;
			this.saveStateToLocalStorage();
		},
		duplicateTask() {
			const cloneTask = JSON.parse(JSON.stringify(this.tasks[this.selectedTaskIndex]));
			this.tasks.push(cloneTask);

			this.finishTask();
		},
		addTask() {
			const text = this.newTaskText;
			const status = 'to-do';
			const pomodoros = 0;

			this.tasks.push({
				text,
				status,
				pomodoros,
			});

			this.newTaskText = '';

			this.saveStateToLocalStorage();
		},
		saveStateToLocalStorage() {
			localStorage.setItem('rtm_tasks', JSON.stringify(this.tasks));
		},
		loadStateFromLocalStorage() {
			const storedData = localStorage.getItem('rtm_tasks');

			if (storedData) {
				this.tasks = JSON.parse(storedData);
			}
		},
		resetData() {
			this.tasks = [];
			localStorage.removeItem('rtm_tasks');
		},
	},
};
</script>

<style lang="scss" scoped>
    .a-RandomTask {
		text-align: center;
		max-width: 450px;
		margin: 0 auto;

        li.is-done .a-RandomTask__task__text {
            color: lightgray;
            font-style: italic;
            text-decoration: line-through;
        }
	}

	.c-TaskList {
		margin: 0;
		margin-bottom: 2rem;
		overflow: hidden;
		padding-left: 0;
		list-style-type: none;
		border-radius: 0.5rem;
		text-align: left;
		box-shadow: 0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04);
	}

	.c-ListItem {
		padding: 1rem 1.75rem;
		background-color: white;
		color: lighten(#212121, 3%);

		& + & {
			border-top: 1px solid #f5f5f5;
		}
	}

	.c-Button {
		padding: 1rem 1.5rem;
		border-radius: 2rem;
		border: 1px solid #4db6ac;
		border-bottom: 1px solid #26a69a;
		background-color: #4db6ac;
		color: darken(#004d40, 3%);
		box-shadow: 0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04);
		font-family: 'Roboto Mono', monospace;
	}
</style>

