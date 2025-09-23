<template>
  <div class="loader m-6" />
</template>

<script setup></script>

<style>
.loader {
  width: 15px;
  aspect-ratio: 1;
  border-radius: 50%;
  animation: loader 1s infinite linear alternate;
}

@keyframes loader {
  0% {
    box-shadow: 20px 0 #f9bc8e, -20px 0 #f9bc8e30;
    background: #f9bc8e;
  }
  33% {
    box-shadow: 20px 0 #f9bc8e, -20px 0 #f9bc8e30;
    background: #f9bc8e30;
  }
  66% {
    box-shadow: 20px 0 #f9bc8e30, -20px 0 #f9bc8e;
    background: #f9bc8e30;
  }
  100% {
    box-shadow: 20px 0 #f9bc8e30, -20px 0 #f9bc8e;
    background: #f9bc8e;
  }
}
</style>
