<template>
    <Bar
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
    />
</template>

<script setup>
import { ref } from 'vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
    lectureName: String,
    maxPnum: Number,
    prePnum: Number,
    failCnt: Number,
});

const chartData = ref({
    labels: ['수강 정원', '수강 인원', '과락 인원'],
    datasets: [{
        label: props.lectureName,
        data: [props.maxPnum, props.prePnum, props.failCnt],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 1,
    }]
})

const chartOptions = ref({
    responsive: true
})

</script>

<style>

</style>