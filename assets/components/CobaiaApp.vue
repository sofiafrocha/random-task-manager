<template>
    <div class="CobaiaApp">
        {{ message }}
    </div>
</template>

<script>
    export default {
        name: 'CobaiaApp',
        data() {
            return {
                message: 'this message is coming from a Vue component!',
            }
        }
    }
</script>

<style lang="scss" scoped>
    .CobaiaApp {
        font-size: 0.75rem;
        font-style: italic;
    }
</style>

