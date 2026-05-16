<template>
  <div class="app-container">
    <h1>Order Payment System</h1>
    <!-- Passing mock props to demonstrate the component -->
    <OrderPaymentDetails 
      :subTotal="100" 
      :surcharge="10" 
      :expectedTotal="126" 
    />
  </div>
</template>

<script setup lang="ts">
import OrderPaymentDetails from './components/OrderPaymentDetails.vue'
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f1f5f9;
  font-family: system-ui, -apple-system, sans-serif;
}
h1 {
  color: #334155;
  margin-bottom: 2rem;
}
</style>
