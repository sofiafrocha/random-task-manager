<template>
    <div class="a-RandomTask">
        <h1>Random Task Manager</h1>
        <input type="text" name="new_task" id="">
        <button>Add task</button>
        <ol>
            <li v-for="task in tasks" :class="{ 'is-done': task.status === 'done'}">
                <span>
                    {{ task.text }}
                </span>
                <span v-for="emoji in task.pomodoros">🍅</span>
            </li>
        </ol>

        <hr>

        <button @click="showNextTask">Get next task</button>

        <div v-show="selectedTaskIndex != null" class="a-RandomTask__next">
            <h2>Your next task:</h2>
            <cite v-if="selectedTaskIndex != null">
                {{ tasks[selectedTaskIndex].text }}
            </cite>
            <br>
            <br>
            <button @click="addPomodoro">I did a 🍅</button>

            <div v-show="showNextTaskFollowup">
                <button @click="finishTask">Finished the task</button>
                <button>Didn't finish the task</button>
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
            message: 'this message is coming from a Vue component!',
            hasNextTask: true,
            showNextTaskFollowup: false,
            tasks: [
                {
                    text: 'Go shopping',
                    pomodoros: 0,
                    status: 'to-do',
                },
                {
                    text: 'Sharpen knives',
                    pomodoros: 0,
                    status: 'to-do',
                },
                {
                    text: 'Prepare ingredients',
                    pomodoros: 0,
                    status: 'to-do',
                },
                {
                    text: 'Cook food',
                    pomodoros: 0,
                    status: 'to-do',
                },
                {
                    text: 'Set table',
                    pomodoros: 0,
                    status: 'to-do',
                },
                {
                    text: 'Eat delicious food',
                    pomodoros: 0,
                    status: 'to-do',
                },
            ],
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

            console.log('random number!', randomInt);

            if (randomInt < this.tasks.length) {
                return randomInt;
            }  else {
                const resto = randomInt % this.tasks.length;
                console.log('resto', resto);

                return resto;
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

