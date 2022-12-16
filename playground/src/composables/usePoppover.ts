import { ref } from "vue"

export default function() {
  const show = ref(false)
  const text = ref('')
  const x = ref(0)
  const y = ref(0)
  
  return {
    show,
    text, 
    x, 
    y
  }
}