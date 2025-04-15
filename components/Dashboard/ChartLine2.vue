<template>
  
  <Card class="md:h-[100%] dark:bg-zinc-800">
    <template #content>

      <div>
        <div class="text-sm dark:text-zinc-400">Minggu ini</div>
      </div>
      <div>
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-[300px]" />
      </div>
    
    </template>
  </Card>

</template>

<script setup lang="ts">
onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        datasets: [
            {
                label: 'Pembuatan',
                backgroundColor: documentStyle.getPropertyValue('--p-emerald-500'),
                borderColor: documentStyle.getPropertyValue('--p-emerald-500'),
                data: [25, 90, 40, 81],
                pointRadius: 0,
                tension: 0.4
            },
            {
                label: 'Perpanjangan',
                backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
                borderColor: documentStyle.getPropertyValue('--p-gray-500'),
                data: [50, 78, 40, 50],
                pointRadius: 0,
                tension: 0.4
            }
        ]
    };
};
const setChartOptions = () => {
    return {
        maintainAspectRatio: false,
        aspectRatio: 0.20,
        plugins: {
            legend: {
                labels: true
            },
            tooltip: {
                enabled: true
            }
        },
        scales: {
            x: {
              display: true
            },
            y: {
              display: false
            }
        }
    };
}
</script>
