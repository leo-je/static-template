<template>
    <AntdDesignForm ref="designForm" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AntdDesignForm } from 'vue-form-create'

export default defineComponent({
    setup() {
        return {

        }
    },
    methods: {

    },
    mounted() {
        let designForm = this.$refs.designForm
        console.log(typeof designForm)
    }
})
</script>