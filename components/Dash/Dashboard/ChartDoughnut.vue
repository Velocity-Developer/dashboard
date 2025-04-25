<template>
  
  <Card class="md:h-[100%] dark:bg-zinc-800">
    <template #content>

      <div>
        <div class="text-sm dark:text-zinc-400">Hari ini</div>
      </div>
      <div>
        <Chart type="doughnut" :data="chartData" :options="chartOptions" class="h-[400px]" />
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
    const documentStyle = getComputedStyle(document.body);

    return {
        labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [540, 325, 702],
                backgroundColor: [documentStyle.getPropertyValue('--primary'), documentStyle.getPropertyValue('--secondary'), documentStyle.getPropertyValue('---p-zinc-200')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--primary'), documentStyle.getPropertyValue('--p-secondary'), documentStyle.getPropertyValue('--p-zinc-500')]
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    return {
        plugins: {
            legend: {
                labels: {
                    cutout: '60%',
                    color: textColor
                }
            }
        }
    };
};
</script>
