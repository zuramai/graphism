<script lang="ts" setup>
const props = defineProps({
  title: String,
  modelValue: Number 
})
defineEmits(['update:modelValue'])
</script>
<template>
    <div :class="`modal ${modelValue ? 'modalOpen' : ''}`" v-show="modelValue">
        <div class="modal-content">
            <div class="modal-header">
                <h3>{{ title }}</h3>
                <button class="btn btn-transparent btn-circle">x</button>
            </div>
        <slot></slot>
    </div>
  <div class="modal-backdrop"></div>
</div>
</template>