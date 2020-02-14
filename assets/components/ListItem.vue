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

		<span class="c-ListItem__deleteBtn"
			@click="handleDeleteClick">
			🗑
		</span>

		<contenteditable
			class="c-ListItem__text"
			tag="span"
			:contenteditable="status !== 'done'"
			v-model="internalText"
			:noNL="true"
			@keyup="handleTextEdit"
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
			const newText = this.internalText.length > 0 ? this.internalText : '...';

			this.$emit('edited-text', {
				newText,
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
	padding: 0.5rem 0.8rem;
	box-sizing: border-box;
	min-height: 2.6rem;
	color: #464646;

	&__doneBtn,
	&__deleteBtn {
		position: absolute;
		bottom: 0.4rem;
		opacity: 0;
		pointer-events: none;
		cursor: pointer;
	}

	&__doneBtn {
		left: -1rem;
	}

	&__deleteBtn {
		right: 0.8rem;
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
