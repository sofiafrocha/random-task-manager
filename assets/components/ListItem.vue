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
		<span class="c-ListItem__text">
			{{ text }}
		</span>
		<span class="c-ListItem__deleteBtn"
			@click="handleDeleteClick(index)">
			🗑
		</span>
	</li>
</template>

<script>
export default {
	name: 'ListItem',
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
	},
};
</script>

<style lang="scss" scoped>
.c-ListItem {
	position: relative;
	padding: 1rem 1.75rem;
	background-color: white;
	color: lighten(#212121, 3%);

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
