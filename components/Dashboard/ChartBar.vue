<template>
  
  <Card class="md:h-[100%] dark:bg-zinc-800">
    <template #content>

      <div>
        <div class="text-sm dark:text-zinc-400">Tahun ini</div>
      </div>
      <div>
        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[400px]" />
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
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Penjualan',
                backgroundColor: documentStyle.getPropertyValue('--p-emerald-500'),
                borderColor: documentStyle.getPropertyValue('--p-emerald-500'),
                data: [25, 59, 40, 81, 56, 80, 90],
                pointRadius: 0,
                tension: 0.4,
                borderRadius: 10
            },
            {
                label: 'Pemasukan',
                backgroundColor: documentStyle.getPropertyValue('--p-sky-500'),
                borderColor: documentStyle.getPropertyValue('--p-sky-500'),
                data: [55, 59, 10, 71, 45, 80, 70],
                pointRadius: 0,
                tension: 0.4,
                borderRadius: 10
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
