<template>
  <div class="spinner-loader m-6" :class="sizeClass" />
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  }
})

const sizeClass = {
  xs: 'spinner-xs',
  sm: 'spinner-sm',
  md: 'spinner-md',
  lg: 'spinner-lg',
  xl: 'spinner-xl'
}[props.size]
</script>

<style>
.spinner-loader {
  aspect-ratio: 1;
  border-radius: 50%;
  animation: spinner 1s infinite linear;
}

.spinner-xs {
  width: 16px;
  background:
    radial-gradient(farthest-side, var(--color-secondary-600) 94%, #0000)
      top/3px 3px no-repeat,
    conic-gradient(#0000 30%, var(--color-secondary-600));
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 3px), #000 0);
}

.spinner-sm {
  width: 24px;
  background:
    radial-gradient(farthest-side, var(--color-secondary-600) 94%, #0000)
      top/4px 4px no-repeat,
    conic-gradient(#0000 30%, var(--color-secondary-600));
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 4px), #000 0);
}

.spinner-md {
  width: 50px;
  background:
    radial-gradient(farthest-side, var(--color-secondary-600) 94%, #0000)
      top/8px 8px no-repeat,
    conic-gradient(#0000 30%, var(--color-secondary-600));
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
}

.spinner-lg {
  width: 64px;
  background:
    radial-gradient(farthest-side, var(--color-secondary-600) 94%, #0000)
      top/10px 10px no-repeat,
    conic-gradient(#0000 30%, var(--color-secondary-600));
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 10px), #000 0);
}

.spinner-xl {
  width: 80px;
  background:
    radial-gradient(farthest-side, var(--color-secondary-600) 94%, #0000)
      top/12px 12px no-repeat,
    conic-gradient(#0000 30%, var(--color-secondary-600));
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 12px), #000 0);
}

@keyframes spinner {
  100% {
    transform: rotate(1turn);
  }
}
</style>
