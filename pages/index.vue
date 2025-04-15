<template>

  <div class="flex flex-col md:flex-row gap-5 mb-5">
    <div class="md:basis-[65%]">
      <DashboardWelcome />
    </div>
    <div class="md:basis-[35%]">
      <DashboardChartLine />
    </div>
  </div>

  <div class="flex flex-col md:flex-row gap-5 mb-5">
    <div class="md:basis-[65%]">
      <DashboardChartBar />
    </div>
    <div class="md:basis-[35%]">
      <DashboardChartDoughnut />
    </div>
  </div>
  
  <div class="flex flex-col md:flex-row gap-5">
    <div class="md:basis-[35%]">
      <DashboardChartLine2 />
    </div>
    <div class="md:basis-[65%]">
      <DashboardDataTable />
    </div>
  </div>

</template>

<script setup lang="ts">
</script>