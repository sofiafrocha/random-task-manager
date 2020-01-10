<template>
	<div class="a-RandomTask" :class="{ 'is-empty': tasks.length === 0 }">
		<div class="c-Overlay" :class="{ 'is-active': selectedTaskIndex !== null }"></div>
		<button
			@click="resetData"
			class="c-ResetButton"
		>
			Reset
		</button>
		<main>
			<div class="c-TaskList">
				<ol>
					<li class="c-ListItem c-ListItem__heading"
						v-if="tasks.length > 0">
						Your tasks
					</li>
					<li
						v-for="(task, index) in tasks"
						:key="index"
						:class="{
							'is-done': task.status === 'done',
							'is-selected': index === selectedTaskIndex
						}"
						class="c-ListItem"
					>
						<span
							v-for="emoji in task.pomodoros"
							:key="emoji"
						>🍅</span>
						<span class="c-ListItem__text">
							{{ task.text }}
						</span>
					</li>
				</ol>
				<div class="c-AddItem"
					:class="{'is-active': isAddItemTrayOpen}">
					<form @submit.prevent="addTask">
						<input
							id=""
							v-model="newTaskText"
							type="text"
							name="new_task"
							placeholder="Enter a task and click enter"
						>
						<div class="c-AddItem__toggle"
							@click="toggleTray"
							v-text="isAddItemTrayOpen ? '^' : '+'">
						</div>
					</form>
				</div>
			</div>

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
			isAddItemTrayOpen: false,
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
		toggleTray() {
			this.isAddItemTrayOpen = !this.isAddItemTrayOpen;
		}
	},
};
</script>

<style lang="scss" scoped>
    .a-RandomTask {
		padding: 4rem;
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
	}

	.c-Overlay.is-active {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: #263238;
		opacity: 0.8;
		z-index: 3;
	}

	.c-TaskList {
		margin: 0;
		margin-bottom: 2.5rem;
		position: relative;
		text-align: left;

		ol {
			position: relative;
			margin: 0;
			box-shadow: 0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04);
			padding-left: 0;
			list-style-type: none;
			overflow: hidden;
			border-radius: 0.5rem;
			z-index: 3;
		}
	}

	.c-ListItem {
		padding: 1rem 1.75rem;
		background-color: white;
		color: lighten(#212121, 3%);

		& + & {
			border-top: 1px solid #f5f5f5;
		}

		&__heading {
			color: lighten(#4db6ac, 30%);
		}

		&.is-done {
			.c-ListItem__text {
				color: lightgray;
				font-style: italic;
				text-decoration: line-through;
			}
		}

		&.is-selected {
			z-index: 4;
		}
	}

	.c-AddItem {
		position: relative;
		background-color: white;
		padding: 1rem 1rem;
		padding-top: 3rem;
		border-radius: 0.5rem;
		width: 100%;
		box-sizing: border-box;
		margin-top: -7.2rem;
		z-index: 1;

		input {
			box-sizing: border-box;
			padding: 1rem 1rem;
			width: 100%;
			border-radius: 10px;
			border: 1px solid #e0e0e0;
		}

		&__toggle {
			content: '+';
			background-color: white;
			color: lighten(#212121, 3%);
			position: absolute;
			margin: 0 auto;
			padding: 0.25rem 0.75rem;
			padding-bottom: 0.1rem;
			max-width: 18px;
			left: 0;
			right: 0;
			bottom: -20px;
			text-align: center;
			border-bottom-left-radius: 3rem;
			border-bottom-right-radius: 3rem;
		}

		&.is-active {
			margin-top: -2rem;
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

	.c-ResetButton {
		appearance: none;
		background-color: transparent;
		position: absolute;
		top: 2rem;
		left: 2rem;
		color: #26a69a;
		border: none;
		font-family: 'Roboto Mono', monospace;
		font-size: 0.8rem;
		cursor: pointer;
	}
</style>

