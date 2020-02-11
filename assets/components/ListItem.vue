<template>
	<li
		:class="{
			'is-done': status === 'done',
			'is-focused': index === selectedIndex
		}"
		class="c-ListItem"
	>
		<span
			v-for="emoji in count"
			:key="emoji"
		>🍅</span>

		<contenteditable
			class="c-ListItem__text"
			tag="span"
			:contenteditable="status !== 'done'"
			v-model="internalText"
			:noNL="true"
			@keydown="handleTextEdit"
			@returned="handleTextEdit" />

		<span class="c-ListItem__deleteBtn"
			@click="handleDeleteClick(index)">
			🗑
		</span>
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
		handleDeleteClick(index) {
			this.$emit('clicked-delete', index);
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
	padding: 1rem 1.75rem;
	background-color: white;
	color: lighten(#212121, 3%);

	input {
		font-family: "Roboto Mono", monospace;
		font-size: 16px;
		position: absolute;
		left: 1.5rem;
		top: 0.95rem;
	}

	&__deleteBtn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		opacity: 0;
		pointer-events: none;
		cursor: pointer;
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

	&:hover .c-ListItem__deleteBtn {
		opacity: 1;
		pointer-events: initial;
	}
}
</style>
