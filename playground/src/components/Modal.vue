<script lang="ts" setup>
const props = defineProps({
  title: String,
  modelValue: Boolean,
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div v-show="modelValue" :class="`modal ${modelValue ? 'modalOpen' : ''}`">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="btn btn-transparent btn-circle">
          x
        </button>
      </div>
      <slot />
    </div>
    <div class="modal-backdrop" />
  </div>
</template>
