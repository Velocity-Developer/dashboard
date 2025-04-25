<template>

  <div class="flex flex-col md:flex-row gap-5 mb-5">
    <div class="md:basis-[65%]">
      <DashDashboardWelcome />
    </div>
    <div class="md:basis-[35%]">
      <DashDashboardChartLine />
    </div>
  </div>

  <div class="flex flex-col md:flex-row gap-5 mb-5">
    <div class="md:basis-[65%]">
      <DashDashboardChartBar />
    </div>
    <div class="md:basis-[35%]">
      <DashDashboardChartDoughnut />
    </div>
  </div>
  
  <div class="flex flex-col md:flex-row gap-5">
    <div class="md:basis-[35%]">
      <DashDashboardChartLine2 />
    </div>
    <div class="md:basis-[65%]">
      <DashDashboardDataTable />
    </div>
  </div>

</template>

<script setup lang="ts">
</script>