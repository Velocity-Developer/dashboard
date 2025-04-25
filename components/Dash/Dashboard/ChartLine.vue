<template>
  
  <Card class="md:h-[100%] dark:bg-zinc-800">
    <template #content>

      <div>
        <div class="text-sm dark:text-zinc-400">Bulan ini</div>
      </div>
      <div>
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-[100px]" />
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
                label: 'My First dataset',
                backgroundColor: documentStyle.getPropertyValue('--primary'),
                borderColor: documentStyle.getPropertyValue('--primary'),
                data: [25, 59, 40, 81, 56, 80, 90],
                pointRadius: 0,
                tension: 0.4
            },
            {
                label: 'My Second dataset',
                backgroundColor: documentStyle.getPropertyValue('--secondary'),
                borderColor: documentStyle.getPropertyValue('--secondary'),
                data: [28, 48, 40, 19, 86, 27, 30],
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
                labels: false
            },
            tooltip: {
                enabled: true
            }
        },
        scales: {
            x: {
              display: false
            },
            y: {
              display: false
            }
        }
    };
}
</script>
