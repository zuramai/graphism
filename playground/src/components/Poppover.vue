<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  x: Number,
  y: Number
})
const styles = computed(() => ({
  x: props.x,
  y: props.y,
}))
</script>
<template>
  <div class="poppover" :style="styles">
    <label for="text">{{title}}</label>
    <slot/>
  </div>
</template>