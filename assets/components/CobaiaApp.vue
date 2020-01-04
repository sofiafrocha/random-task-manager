<template>
    <div class="a-RandomTask">
        <h1>Random Task Manager</h1>

        <form v-on:submit.prevent="addTask">
            <input v-model="newTaskText" type="text" name="new_task" id="">
            <button type="submit">Add task</button>
        </form>

        <ol>
            <li v-for="(task, index) in tasks" :key="index"
                :class="{ 'is-done': task.status === 'done'}">
                <span>
                    {{ task.text }}
                </span>
                <span v-for="emoji in task.pomodoros" :key="emoji">🍅</span>
            </li>
        </ol>

        <hr>

        <button @click="showNextTask" :disabled="!hasAvailableTask">Get next task</button>

        <div v-show="selectedTaskIndex != null" class="a-RandomTask__next">
            <h2>Your next task:</h2>
            <cite v-if="selectedTaskIndex != null">
                {{ tasks[selectedTaskIndex].text }}
            </cite>
            <br>
            <br>

            <div>
                <button @click="finishTask">Finished the task</button>
                <button @click="duplicateTask">Didn't finish the task</button>
            </div>
        </div>
    </div>
</template>

<script>
const LINES = 32;

export default {
    name: 'a-RandomTask',
    data() {
        return {
            newTaskText: '',
            showNextTaskFollowup: false,
            tasks: [],
            selectedTaskIndex: null,
        }
    },
    computed: {
        availableTasks() {
            return this.tasks.filter((task) => task.status === 'to-do');
        },
        hasAvailableTask() {
            return this.availableTasks.length > 0;
        }
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
            }  else {
                return  randomInt % this.tasks.length;
            }
        },
        addPomodoro() {
            this.tasks[this.selectedTaskIndex].pomodoros += 1;
            this.showNextTaskFollowup = true;
        },
        finishTask() {
            this.tasks[this.selectedTaskIndex].status = 'done';
            this.showNextTaskFollowup = false;
            this.selectedTaskIndex = null;
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
        }
    }
}
</script>

<style lang="scss" scoped>
    .a-RandomTask {
        ol {
            padding-left: 0;
        }

        li {
            list-style-type: none;
        }

        li.is-done span:first-child {
            color: lightgray;
            font-style: italic;
            text-decoration: line-through;
        }
    }
</style>

