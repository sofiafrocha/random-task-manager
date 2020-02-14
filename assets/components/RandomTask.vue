<template>
	<div class="a-RandomTask" :class="{ 'is-empty': tasks.length === 0 }">
		<main>
			<form class="c-AddItem"
				@submit.prevent="addTask">
				<input
					id=""
					v-model="newTaskText"
					type="text"
					name="new_task"
					placeholder="Enter a task and press enter"
					class="c-AddItem__input"
				>
			</form>

			<ol class="c-TaskList">
				<ListItem
					v-for="(task, index) in tasks"
					:key="index"
					:status="task.status"
					:count="task.pomodoros"
					:text="task.text"
					:index="index"
					:selected-index="selectedTaskIndex"
					@clicked-delete="deleteTask"
					@clicked-done="markTaskAsDone"
					@edited-text="editTaskText"
				></ListItem>
			</ol>

			<button
				class="c-Button is-focused"
				v-show="tasks.length && selectedTaskIndex === null"
				@click="showNextTask"
			>
				Get next task
			</button>

			<div v-show="selectedTaskIndex !== null">
				<button
					class="c-Button is-focused is-secondary"
					@click="finishTask"
				>
					Done
				</button>
				<button
					class="c-Button is-focused"
					@click="duplicateTask"
				>
					Keep task
				</button>
			</div>
		</main>

		<section class="c-Extras">
			<button class="c-Extras__btn is-trigger"
				title="Show extra options"
				@click="isExtrasVisible = !isExtrasVisible">
				⚙
			</button>
			<ul class="c-Extras__list"
				v-show="isExtrasVisible">
				<li>
					<button
						@click="resetData"
						class="c-Extras__btn"
						title="Reset task list"
					>
						Reset
					</button>
				</li>
				<li>
					<button
						@click="exportData"
						class="c-Extras__btn"
						title="Export task list">
						Export
					</button>
				</li>
			</ul>
		</section>
	</div>
</template>

<script>
import promptUserToDownloadJSON from '../js/export_tasks';
import ListItem from './ListItem.vue';

const LINES = 32;

export default {
	name: 'ARandomTask',
	components: {
		ListItem,
	},
	data() {
		return {
			newTaskText: '',
			showNextTaskFollowup: false,
			tasks: [],
			selectedTaskIndex: null,
			isExtrasVisible: false,
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
					nextTaskIndex += 1;

					if (nextTaskIndex === this.tasks.length) {
						nextTaskIndex = 0;
					}
				}

				this.selectedTaskIndex = nextTaskIndex;
			}
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
		markTaskAsDone(index) {
			this.tasks[index].status = 'done';
			this.saveStateToLocalStorage();
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
		deleteTask(index) {
			this.tasks.splice(index, 1);

			this.saveStateToLocalStorage();
		},
		editTaskText(input) {
			this.tasks[input.index].text = input.newText;
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
		exportData() {
			promptUserToDownloadJSON(this.tasks);
		},
	},
};
</script>

<style lang="scss" scoped>

.c-AddItem {
	&__input {
		box-sizing: border-box;
		width: 100%;
		text-align: center;
		padding: 0.5rem;
		margin-bottom: 2.5rem;
		border: none;
		border-bottom: 2px solid #C4C4C4;
		background-color: transparent;
		color: #464646;
		font-style: italic;
	}
}

.c-TaskList {
	margin-bottom: 2.5rem;
	text-align: left;
	list-style-type: disc;
	padding-left: 1.5rem;
}

.c-Extras {
	position: fixed;
	bottom: 1rem;
	right: 1rem;

	&__btn {
		appearance: none;
		background-color: transparent;
		border: none;
		font-family: 'Roboto Mono', monospace;
		cursor: pointer;

		&.is-trigger {
			font-size: 1.5rem;
		}
	}

	&__list {
		position: absolute;
		bottom: 2rem;
		right: 0;
		list-style-type: none;
		padding: 0;
		margin: 0;
		text-align: right;

		li {
			margin: 0.25rem 0;
		}
	}
}
    .a-RandomTask {
		padding: 2rem;
		padding-top: 4.5rem;
		box-sizing: border-box;
		min-height: 100vh;
		background-color: lighten(#b2dfdb, 3%);
		line-height: 1.6rem;

		main {
			text-align: center;
			max-width: 450px;
			margin: 0 auto;
		}

		&.is-empty {
			.c-AddItem {
				position: relative;
				margin: auto;
				padding-top: 1rem;
			}
		}

		@media screen and (min-width: 767px) {
			padding: 4rem;
		}
	}

	.c-Button {
		position: relative;
		padding: 1rem 1.5rem;
		border-radius: 2rem;
		border: 1px solid #4db6ac;
		border-bottom: 1px solid #26a69a;
		background-color: #4db6ac;
		color: darken(#004d40, 3%);
		box-shadow: 0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04);
		font-family: 'Roboto Mono', monospace;

		&.is-focused {
			z-index: 4;
		}

		&.is-secondary {
			background-color: #f57c00;
			border: 1px solid #f57c00;
			border-bottom: 1px solid #ef6c00;
		}
	}
</style>

