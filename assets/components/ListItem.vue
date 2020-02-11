<template>
	<li
		:class="{
			'is-done': status === 'done',
			'is-focused': index === selectedIndex
		}"
		class="c-ListItem"
	>
		<span v-if="status !== 'done'"
			class="c-ListItem__doneBtn"
			@click="handleDoneClick">
			✅
		</span>
		<span
			v-for="emoji in count"
			:key="emoji"
		>🍅</span>

		<span v-if="status !== 'done'"
			class="c-ListItem__deleteBtn"
			@click="handleDeleteClick">
			🗑
		</span>

		<contenteditable
			class="c-ListItem__text"
			tag="span"
			:contenteditable="status !== 'done'"
			v-model="internalText"
			:noNL="true"
			@keydown="handleTextEdit"
			@returned="handleTextEdit" />
	</li>
</template>

<script>
export default {
	name: 'ListItem',
	data() {
		return {
			internalText: this.text,
		};
	},
	props: {
		status: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		index: {
			type: Number,
			required: true,
		},
		count: {
			type: Number,
			required: true,
		},
		selectedIndex: {
			required: true,
		},
	},
	methods: {
		handleDeleteClick() {
			this.$emit('clicked-delete', this.index);
		},
		handleDoneClick() {
			this.$emit('clicked-done', this.index);
		},
		handleTextEdit() {
			this.$emit('edited-text', {
				newText: this.internalText,
				index: this.index,
			});
		},
	},
	watch: {
		text() {
			this.internalText = this.text;
		},
	},
};
</script>

<style lang="scss" scoped>
.c-ListItem {
	position: relative;
	padding: 1rem 2.75rem;
	background-color: white;
	color: lighten(#212121, 3%);

	input {
		font-family: "Roboto Mono", monospace;
		font-size: 16px;
		position: absolute;
		left: 1.5rem;
		top: 0.95rem;
	}

	&__doneBtn,
	&__deleteBtn {
		position: absolute;
		top: 1rem;
		opacity: 0;
		pointer-events: none;
		cursor: pointer;
	}

	&__doneBtn {
		left: 0.8rem;
	}

	&__deleteBtn {
		right: 0.8rem;
	}


	& + & {
		border-top: 1px solid #f5f5f5;
	}

	&.is-done {
		.c-ListItem__text {
			color: lightgray;
			font-style: italic;
			text-decoration: line-through;
		}
	}

	&.is-focused {
		z-index: 4;
	}

	&:hover .c-ListItem__deleteBtn,
	&:hover .c-ListItem__doneBtn {
		opacity: 1;
		pointer-events: initial;
	}
}
</style>
