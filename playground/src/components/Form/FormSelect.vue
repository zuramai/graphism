<script lang="ts" setup>
const props = defineProps<{
  data: Record<any, any>
  name: string
  label: string
}>()
</script>

<template>
  <div class="form-group">
    <label :for="name">{{label}}</label>
    <select id="custom-font-family" :name="name" class="form-input">
      <option v-for="(value, key) in data" :key="key" :value="key">
        {{ value }}
      </option>
    </select>
  </div>
</template>
